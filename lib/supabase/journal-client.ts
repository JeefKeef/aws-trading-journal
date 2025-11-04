/**
 * Supabase Journal Client
 * 
 * Handles all database operations for the journal system
 */

import { createBrowserClient } from "@supabase/ssr";
import type {
  NoteContent,
  Folder,
  TreeNode,
  LinkedTrade,
  SearchResult,
  SearchFilters,
  NoteFormData,
  FolderFormData,
} from "@/lib/types/journal";

// Initialize Supabase client
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================
// Folder Operations
// ============================================

export async function getFolders(userId?: string): Promise<Folder[]> {
  const { data, error } = await supabase
    .from("journal_folders")
    .select("*")
    .order("position", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    parentId: row.parent_id ?? undefined,
    userId: row.user_id,
    position: row.position ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function createFolder(data: FolderFormData): Promise<Folder> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data: folder, error } = await supabase
    .from("journal_folders")
    .insert({
      user_id: userData.user.id,
      name: data.name,
      parent_id: data.parentId ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: folder.id,
    name: folder.name,
    parentId: folder.parent_id ?? undefined,
    userId: folder.user_id,
    position: folder.position ?? 0,
    createdAt: folder.created_at,
    updatedAt: folder.updated_at,
  };
}

export async function updateFolder(
  folderId: string,
  data: Partial<FolderFormData>
): Promise<void> {
  const { error } = await supabase
    .from("journal_folders")
    .update({
      name: data.name,
      parent_id: data.parentId ?? null,
    })
    .eq("id", folderId);

  if (error) throw error;
}

export async function deleteFolder(folderId: string): Promise<void> {
  const { error } = await supabase
    .from("journal_folders")
    .delete()
    .eq("id", folderId);

  if (error) throw error;
}

// ============================================
// Note Operations
// ============================================

export async function getNotes(folderId?: string): Promise<NoteContent[]> {
  let query = supabase
    .from("journal_notes")
    .select(`
      *,
      trades (
        id,
        ticker,
        entry_price,
        exit_price,
        quantity,
        setup,
        date,
        profit_loss,
        profit_loss_percentage,
        status,
        tags
      ),
      journal_attachments (
        id,
        file_url,
        file_name,
        file_size,
        mime_type,
        created_at
      )
    `)
    .order("position", { ascending: true })
    .order("updated_at", { ascending: false });

  if (folderId) {
    query = query.eq("folder_id", folderId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    tags: row.tags ?? [],
    linkedTrade: row.trades
      ? {
          id: row.trades.id,
          ticker: row.trades.ticker,
          entryPrice: row.trades.entry_price ?? 0,
          exitPrice: row.trades.exit_price ?? undefined,
          quantity: row.trades.quantity ?? undefined,
          setup: row.trades.setup ?? "",
          date: row.trades.date,
          profitLoss: row.trades.profit_loss ?? undefined,
          profitLossPercentage: row.trades.profit_loss_percentage ?? undefined,
          status: row.trades.status,
          tags: row.trades.tags ?? [],
        }
      : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: (row.journal_attachments ?? []).map((att: any) => ({
      id: att.id,
      url: att.file_url,
      fileName: att.file_name,
      fileSize: att.file_size ?? undefined,
      mimeType: att.mime_type ?? undefined,
      createdAt: att.created_at,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isArchived: row.is_archived,
  }));
}

export async function getNote(noteId: string): Promise<NoteContent | null> {
  const { data, error } = await supabase
    .from("journal_notes")
    .select(`
      *,
      trades (
        id,
        ticker,
        entry_price,
        exit_price,
        quantity,
        setup,
        date,
        profit_loss,
        profit_loss_percentage,
        status,
        tags
      ),
      journal_attachments (
        id,
        file_url,
        file_name,
        file_size,
        mime_type,
        created_at
      )
    `)
    .eq("id", noteId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    tags: data.tags ?? [],
    linkedTrade: data.trades
      ? {
          id: data.trades.id,
          ticker: data.trades.ticker,
          entryPrice: data.trades.entry_price ?? 0,
          exitPrice: data.trades.exit_price ?? undefined,
          quantity: data.trades.quantity ?? undefined,
          setup: data.trades.setup ?? "",
          date: data.trades.date,
          profitLoss: data.trades.profit_loss ?? undefined,
          profitLossPercentage: data.trades.profit_loss_percentage ?? undefined,
          status: data.trades.status,
          tags: data.trades.tags ?? [],
        }
      : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: (data.journal_attachments ?? []).map((att: any) => ({
      id: att.id,
      url: att.file_url,
      fileName: att.file_name,
      fileSize: att.file_size ?? undefined,
      mimeType: att.mime_type ?? undefined,
      createdAt: att.created_at,
    })),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    isArchived: data.is_archived,
  };
}

export async function createNote(data: NoteFormData): Promise<NoteContent> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data: note, error } = await supabase
    .from("journal_notes")
    .insert({
      user_id: userData.user.id,
      title: data.title,
      content: data.content,
      tags: data.tags,
      folder_id: data.folderId ?? null,
      trade_id: data.tradeId ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: note.id,
    title: note.title,
    content: note.content,
    tags: note.tags ?? [],
    images: [],
    createdAt: note.created_at,
    updatedAt: note.updated_at,
    isArchived: note.is_archived,
  };
}

export async function updateNote(
  noteId: string,
  data: Partial<NoteContent>
): Promise<void> {
  const { error } = await supabase
    .from("journal_notes")
    .update({
      title: data.title,
      content: data.content,
      tags: data.tags,
      trade_id: data.linkedTrade?.id ?? null,
    })
    .eq("id", noteId);

  if (error) throw error;
}

export async function deleteNote(noteId: string): Promise<void> {
  const { error } = await supabase
    .from("journal_notes")
    .delete()
    .eq("id", noteId);

  if (error) throw error;
}

// ============================================
// Trade Operations
// ============================================

export async function getTrades(): Promise<LinkedTrade[]> {
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    ticker: row.ticker,
    entryPrice: row.entry_price ?? 0,
    exitPrice: row.exit_price ?? undefined,
    quantity: row.quantity ?? undefined,
    setup: row.setup ?? "",
    date: row.date,
    profitLoss: row.profit_loss ?? undefined,
    profitLossPercentage: row.profit_loss_percentage ?? undefined,
    status: row.status,
    tags: row.tags ?? [],
  }));
}

export async function linkTradeToNote(
  noteId: string,
  tradeId: string
): Promise<void> {
  const { error } = await supabase
    .from("journal_notes")
    .update({ trade_id: tradeId })
    .eq("id", noteId);

  if (error) throw error;
}

export async function unlinkTradeFromNote(noteId: string): Promise<void> {
  const { error } = await supabase
    .from("journal_notes")
    .update({ trade_id: null })
    .eq("id", noteId);

  if (error) throw error;
}

// ============================================
// Image/Attachment Operations
// ============================================

export async function uploadImage(
  noteId: string,
  file: File
): Promise<{ url: string; id: string }> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  // Upload to Supabase Storage
  const fileName = `${userData.user.id}/${noteId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("journal-images")
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("journal-images").getPublicUrl(fileName);

  // Save attachment record
  const { data: attachment, error: attachmentError } = await supabase
    .from("journal_attachments")
    .insert({
      note_id: noteId,
      file_url: publicUrl,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    })
    .select()
    .single();

  if (attachmentError) throw attachmentError;

  return { url: publicUrl, id: attachment.id };
}

export async function deleteImage(imageId: string): Promise<void> {
  // Get the image record first
  const { data: image, error: fetchError } = await supabase
    .from("journal_attachments")
    .select("file_url")
    .eq("id", imageId)
    .single();

  if (fetchError) throw fetchError;

  // Extract file path from URL
  const filePath = image.file_url.split("/journal-images/")[1];

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from("journal-images")
    .remove([filePath]);

  if (storageError) throw storageError;

  // Delete attachment record
  const { error } = await supabase
    .from("journal_attachments")
    .delete()
    .eq("id", imageId);

  if (error) throw error;
}

// ============================================
// Search Operations
// ============================================

export async function searchNotes(
  query: string,
  filters?: SearchFilters
): Promise<SearchResult[]> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase.rpc("search_journal_notes", {
    search_query: query,
    user_filter: userData.user.id,
  });

  if (error) throw error;

  let results = data as SearchResult[];

  // Apply additional filters
  if (filters?.tags && filters.tags.length > 0) {
    results = results.filter((note) =>
      filters.tags!.some((tag) => note.tags.includes(tag))
    );
  }

  if (filters?.folderId) {
    results = results.filter((note) => note.folderId === filters.folderId);
  }

  if (filters?.dateFrom) {
    results = results.filter(
      (note) => new Date(note.createdAt) >= new Date(filters.dateFrom!)
    );
  }

  if (filters?.dateTo) {
    results = results.filter(
      (note) => new Date(note.createdAt) <= new Date(filters.dateTo!)
    );
  }

  return results;
}

// ============================================
// Tree Building Utilities
// ============================================

export async function buildFolderTree(): Promise<TreeNode[]> {
  const folders = await getFolders();
  const notes = await getNotes();

  // Build folder map
  const folderMap = new Map<string, TreeNode>();
  const rootNodes: TreeNode[] = [];

  // Create folder nodes
  folders.forEach((folder) => {
    const node: TreeNode = {
      id: folder.id,
      name: folder.name,
      type: "folder",
      parentId: folder.parentId,
      children: [],
      isExpanded: false,
      position: folder.position,
    };
    folderMap.set(folder.id, node);
  });

  // Add note nodes to their folders or root
  notes.forEach((note) => {
    const noteNode: TreeNode = {
      id: note.id,
      name: note.title,
      type: "note",
      parentId: undefined,
    };

    if (note.linkedTrade?.id) {
      // If note has a linked trade, we can access it via note.linkedTrade
      // but TreeNode doesn't have folderId - it has parentId for the folder
      // We need to find the folder this note belongs to
      const noteFolder = folders.find((f) =>
        notes.some((n) => n.id === note.id && f.id === note.linkedTrade?.id)
      );
      if (noteFolder) {
        const folderNode = folderMap.get(noteFolder.id);
        if (folderNode) {
          folderNode.children!.push(noteNode);
        }
      } else {
        rootNodes.push(noteNode);
      }
    } else {
      rootNodes.push(noteNode);
    }
  });

  // Build folder hierarchy
  folderMap.forEach((node) => {
    if (node.parentId && folderMap.has(node.parentId)) {
      folderMap.get(node.parentId)!.children!.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  return rootNodes;
}

export { supabase };
