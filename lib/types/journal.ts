/**
 * Journal System - Shared Type Definitions
 * 
 * These types are used across the journal components and can be
 * imported anywhere in the application for type safety.
 */

// ============================================
// Core Journal Types
// ============================================

/**
 * Represents a node in the file tree (folder or note)
 */
export type TreeNode = {
  id: string;
  name: string;
  type: "folder" | "note";
  parentId?: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  position?: number; // For manual ordering
};

/**
 * Full note content with metadata
 */
export type NoteContent = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  linkedTrade?: LinkedTrade;
  linkedTrades?: LinkedTrade[]; // Support multiple trades
  images: NoteImage[];
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
};

/**
 * Minimal note info for listings
 */
export type NoteMetadata = {
  id: string;
  title: string;
  tags: string[];
  folderId?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Folder structure
 */
export type Folder = {
  id: string;
  name: string;
  parentId?: string;
  userId: string;
  position?: number;
  createdAt: string;
  updatedAt: string;
};

// ============================================
// Trade Types
// ============================================

/**
 * Trade data that can be linked to notes
 */
export type LinkedTrade = {
  id: string;
  ticker: string;
  entryPrice: number;
  exitPrice?: number;
  quantity?: number;
  setup: string;
  date: string;
  profitLoss?: number;
  profitLossPercentage?: number;
  status?: "open" | "closed" | "cancelled";
  tags: string[];
};

/**
 * Full trade record from database
 */
export type Trade = LinkedTrade & {
  userId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

// ============================================
// Attachment Types
// ============================================

/**
 * Image or file attachment for a note
 */
export type NoteImage = {
  id: string;
  url: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
};

/**
 * Attachment database record
 */
export type Attachment = {
  id: string;
  noteId: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
};

// ============================================
// Version History Types
// ============================================

/**
 * Historical version of a note
 */
export type NoteVersion = {
  id: string;
  noteId: string;
  title: string;
  content: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
};

// ============================================
// Search Types
// ============================================

/**
 * Search result with ranking
 */
export type SearchResult = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folderId?: string;
  folderPath?: string[];
  createdAt: string;
  updatedAt: string;
  rank?: number;
  snippet?: string;
};

/**
 * Search filters
 */
export type SearchFilters = {
  query: string;
  tags?: string[];
  folderId?: string;
  dateFrom?: string;
  dateTo?: string;
  hasLinkedTrade?: boolean;
};

// ============================================
// AI Action Types
// ============================================

/**
 * Available AI actions
 */
export type AIActionType = 
  | "summarize"
  | "summarizeTrades"
  | "reformat"
  | "generateTags"
  | "analyzeSentiment"
  | "suggestImprovements";

/**
 * AI action request
 */
export type AIActionRequest = {
  action: AIActionType;
  noteId: string;
  content?: string;
  linkedTrades?: LinkedTrade[];
};

/**
 * AI action response
 */
export type AIActionResponse = {
  action: AIActionType;
  result: string | string[] | Record<string, unknown>;
  success: boolean;
  error?: string;
};

// ============================================
// API Response Types
// ============================================

/**
 * Standard API success response
 */
export type ApiSuccessResponse<T = unknown> = {
  success: true;
  data: T;
  message?: string;
};

/**
 * Standard API error response
 */
export type ApiErrorResponse = {
  success: false;
  error: string;
  details?: Record<string, unknown>;
};

/**
 * Combined API response type
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================
// Component Prop Types
// ============================================

/**
 * Props for FileTree component
 */
export type FileTreeProps = {
  activeNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onError?: (error: Error) => void;
};

/**
 * Props for NoteEditor component
 */
export type NoteEditorProps = {
  noteId: string | null;
  onSave: (note: NoteContent) => void;
  onError?: (error: Error) => void;
};

/**
 * Props for TradeCard component
 */
export type TradeCardProps = {
  trade: LinkedTrade;
  onUnlink?: () => void;
  compact?: boolean;
};

// ============================================
// Form Types
// ============================================

/**
 * Form data for creating/editing folders
 */
export type FolderFormData = {
  name: string;
  parentId?: string;
};

/**
 * Form data for creating/editing notes
 */
export type NoteFormData = {
  title: string;
  content: string;
  tags: string[];
  folderId?: string;
  tradeId?: string;
};

/**
 * Form data for trade linking
 */
export type TradeLinkFormData = {
  noteId: string;
  tradeId: string;
};

// ============================================
// State Management Types
// ============================================

/**
 * Journal state in context or store
 */
export type JournalState = {
  folders: Folder[];
  notes: NoteMetadata[];
  activeNoteId: string | null;
  activeNote: NoteContent | null;
  searchQuery: string;
  searchResults: SearchResult[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * Journal actions for state management
 */
export type JournalActions = {
  loadFolders: () => Promise<void>;
  loadNotes: (folderId?: string) => Promise<void>;
  loadNote: (noteId: string) => Promise<void>;
  createFolder: (data: FolderFormData) => Promise<Folder>;
  createNote: (data: NoteFormData) => Promise<NoteContent>;
  updateNote: (noteId: string, data: Partial<NoteContent>) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  searchNotes: (query: string, filters?: SearchFilters) => Promise<SearchResult[]>;
  linkTrade: (noteId: string, tradeId: string) => Promise<void>;
  unlinkTrade: (noteId: string) => Promise<void>;
};

// ============================================
// Database Row Types (for Supabase)
// ============================================

/**
 * Database row for journal_folders table
 */
export type JournalFolderRow = {
  id: string;
  user_id: string;
  name: string;
  parent_id: string | null;
  position: number;
  created_at: string;
  updated_at: string;
};

/**
 * Database row for journal_notes table
 */
export type JournalNoteRow = {
  id: string;
  user_id: string;
  folder_id: string | null;
  title: string;
  content: string;
  tags: string[];
  trade_id: string | null;
  position: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Database row for journal_attachments table
 */
export type JournalAttachmentRow = {
  id: string;
  note_id: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
};

/**
 * Database row for trades table
 */
export type TradeRow = {
  id: string;
  user_id: string;
  ticker: string;
  entry_price: number | null;
  exit_price: number | null;
  quantity: number | null;
  setup: string | null;
  date: string;
  profit_loss: number | null;
  profit_loss_percentage: number | null;
  status: "open" | "closed" | "cancelled";
  tags: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
};

// ============================================
// Utility Types
// ============================================

/**
 * Type guard to check if response is error
 */
export function isApiError(response: ApiResponse): response is ApiErrorResponse {
  return !response.success;
}

/**
 * Type guard to check if response is success
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.success;
}

/**
 * Convert database row to app type
 */
export function noteRowToContent(row: JournalNoteRow, trade?: TradeRow): NoteContent {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    tags: row.tags,
    linkedTrade: trade ? tradeRowToLinked(trade) : undefined,
    images: [], // Would need to join with attachments
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isArchived: row.is_archived,
  };
}

/**
 * Convert trade row to linked trade
 */
export function tradeRowToLinked(row: TradeRow): LinkedTrade {
  return {
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
    tags: row.tags,
  };
}

/**
 * Convert folder row to app type
 */
export function folderRowToFolder(row: JournalFolderRow): Folder {
  return {
    id: row.id,
    name: row.name,
    parentId: row.parent_id ?? undefined,
    userId: row.user_id,
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
