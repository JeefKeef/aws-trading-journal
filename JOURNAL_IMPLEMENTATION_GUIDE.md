# 📓 Journal System - Complete Implementation Guide

## Overview

The Signal Trading Journal is a hybrid journaling and trade note-taking system that combines:
- **File/folder tree** for structured organization
- **Rich text editor** (Tiptap) for note-taking and strategy documentation  
- **Trading details integration** (tickers, setup, P/L, AI summaries)
- **AI-powered features** for summarization, tag generation, and trade analysis

The journal feels like a connected workspace — blending a Notion-like editor with quick access to trading data.

---

## 🚀 Quick Start

### 1. Navigate to Journal
```
/journal
```

### 2. Create Your First Note
- Click **"+ Note"** button in the sidebar
- Enter a title (e.g., "AAPL Breakout Setup")
- Start writing with the rich text editor

### 3. Organize with Folders
- Click **"+ Folder"** to create categories
- Examples: "Trades → 2025 → November", "Setups → Breakouts"
- Drag notes into folders (future feature)

### 4. Link a Trade
- Click **"Add Trade Details"** in the toolbar
- Select from your trade history
- View ticker, entry/exit, P/L inline

### 5. Use AI Features
- Click **"AI Actions"** button
- Choose: Summarize Note | Analyze Trades | Generate Tags
- AI insights append directly to your note

---

## 🏗️ Architecture

### File Structure
```
app/(shell)/journal/
  └── page.tsx                    # Main journal page with ResizablePanel layout

components/journal/
  ├── file-tree.tsx               # Collapsible folder/note sidebar
  ├── note-editor-enhanced.tsx    # Rich text editor + trade linking
  └── rich-text-editor.tsx        # Tiptap editor component

lib/types/
  └── journal.ts                  # TypeScript type definitions
```

### Key Components

#### 1. **FileTree** (`file-tree.tsx`)
- **Purpose:** Sidebar navigation with folder/note hierarchy
- **Features:**
  - Create/rename/delete folders and notes
  - Expand/collapse folders
  - Search notes by title
  - Context menu (right-click or kebab menu)
  - Active note highlighting

- **State:** Local state (mock data) - easily swappable with API calls

#### 2. **NoteEditorEnhanced** (`note-editor-enhanced.tsx`)
- **Purpose:** Main editing interface with rich text and trade linking
- **Features:**
  - Title editing
  - Tag management (add/remove)
  - Rich text formatting (see Rich Text Editor section)
  - Linked trade card with P/L display
  - AI action panel
  - Auto-save status indicator
  - Image attachments (future)

- **Props:**
  - `noteId: string | null` - ID of current note
  - `onSave: (note: NoteContent) => void` - Save callback

#### 3. **RichTextEditor** (`rich-text-editor.tsx`)
- **Purpose:** Tiptap-based WYSIWYG editor
- **Extensions:**
  - StarterKit (basic functionality)
  - Link (with custom styling)
  - Image (inline images)
  - Highlight (text highlighting)
  - Underline
  - Placeholder

- **Toolbar Features:**
  - **Text Formatting:** Bold, Italic, Underline, Highlight
  - **Headers:** H1, H2, H3
  - **Lists:** Bullet, Numbered
  - **Blocks:** Code, Quote, Horizontal Rule
  - **Insert:** Link, Image, Divider
  - **History:** Undo/Redo

---

## 📊 Data Model

### Core Types (`lib/types/journal.ts`)

#### TreeNode
```typescript
type TreeNode = {
  id: string;
  name: string;
  type: "folder" | "note";
  parentId?: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  position?: number;
};
```

#### NoteContent
```typescript
type NoteContent = {
  id: string;
  title: string;
  content: string;              // HTML from Tiptap
  tags: string[];
  linkedTrade?: LinkedTrade;
  images: NoteImage[];
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
};
```

#### LinkedTrade
```typescript
type LinkedTrade = {
  id: string;
  ticker: string;
  entryPrice: number;
  exitPrice?: number;
  setup: string;
  date: string;
  profitLoss?: number;
  status?: "open" | "closed" | "cancelled";
  tags: string[];
};
```

---

## 🎨 UI Components & Styling

### Layout
- **Split Pane:** 20% sidebar | 80% editor (resizable)
- **Sidebar:** File tree with search + create buttons
- **Editor:** Full-height scrollable with fixed toolbar

### Design System
- **Colors:** Neutral palette with semantic theme variables
- **Typography:** Clear hierarchy (H1-H3, body text, code)
- **Spacing:** Consistent padding (px-3 py-2 for compact, px-5 py-6 for content)
- **Dark Mode:** Full support via `next-themes`

### shadcn/ui Components Used
- `Button` - Primary actions
- `Input` - Title, tags, search
- `Badge` - Tags display
- `Card` - Trade cards, AI option cards
- `Dialog` - Link trade, AI actions, create folder/note
- `DropdownMenu` - Context menu for nodes
- `ResizablePanel` - Sidebar/editor split
- `Separator` - Toolbar dividers

---

## 🧠 AI Integration

### AI Actions

#### 1. **Summarize Note**
- Analyzes note content
- Generates concise summary
- Appends to bottom of note with separator

#### 2. **Summarize Linked Trades**
- Fetches all trades linked to current note
- Calculates win rate, R:R, best setups
- Provides actionable recommendations

#### 3. **Generate Tags**
- NLP analysis of note content
- Suggests relevant tags (e.g., "Technical Analysis", "Swing Trade")
- Auto-adds to note metadata

#### 4. **Reformat** (Future)
- Improves note structure
- Adds headers, bullet points
- Makes content more scannable

### Implementation Pattern
```typescript
const handleAIAction = async () => {
  setIsProcessingAI(true);
  
  try {
    // Simulate API call (replace with real endpoint)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const response = await fetch("/api/ai/journal", {
      method: "POST",
      body: JSON.stringify({
        action: aiAction,
        noteId: note.id,
        content: note.content,
      }),
    });
    
    const result = await response.json();
    
    // Update note with AI result
    setNote({
      ...note,
      content: `${note.content}\n\n${result.summary}`,
      updatedAt: new Date().toISOString(),
    });
  } finally {
    setIsProcessingAI(false);
  }
};
```

---

## 💾 Auto-Save System

### How It Works
1. **Debounced Save:** 1-second delay after last keystroke
2. **Status Indicator:** "Saving..." → "Saved" → (fade out)
3. **Optimistic UI:** Changes apply immediately, save happens in background

### Implementation
```typescript
useEffect(() => {
  if (!note) return;

  const timer = setTimeout(() => {
    setSaveStatus("Saving...");
    setTimeout(() => {
      onSave(note);
      setSaveStatus("Saved");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 500);
  }, 1000);

  return () => clearTimeout(timer);
}, [note, onSave]);
```

---

## 🔍 Search & Filters

### Current Implementation
- **Basic Search:** Filter sidebar tree by note title
- **Real-time:** Updates as you type
- **Case-insensitive:** Flexible matching

### Future Enhancements
- Full-text search across note content
- Filter by tag
- Filter by linked ticker
- Filter by date range
- Search results panel with snippets

---

## 📷 Image Attachments

### Planned Features
1. **Upload Methods:**
   - Drag & drop into editor
   - Click "Insert Image" toolbar button
   - Paste from clipboard

2. **Storage:**
   - Upload to Supabase Storage (when implemented)
   - Store URLs in `journal_attachments` table
   - Link via `note_id` foreign key

3. **Display:**
   - Inline preview in editor
   - Thumbnail grid below editor
   - Hover overlay with delete button

### Implementation Placeholder
```typescript
const handleImageUpload = async (file: File): Promise<string> => {
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("journal-images")
    .upload(`${userId}/${noteId}/${Date.now()}-${file.name}`, file);
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("journal-images")
    .getPublicUrl(data.path);
  
  return publicUrl;
};
```

---

## 🔗 Trade Linking

### Link Flow
1. Click **"Add Trade Details"** button
2. Dialog opens with list of trades
3. Select a trade from the list
4. Trade card appears above editor
5. Click X to unlink

### Trade Card Display
- **Ticker Symbol:** Large, bold
- **Setup Type:** Badge
- **Key Metrics:** Entry, Exit, P/L, Date
- **Color Coding:** Green P/L for profits, red for losses

### Data Binding
```typescript
linkedTrade: {
  id: "trade-1",
  ticker: "AAPL",
  entryPrice: 192.5,
  exitPrice: 201.25,
  setup: "Momentum Breakout",
  date: "2025-11-03",
  profitLoss: 4.55,
  tags: ["Breakout", "Tech"],
}
```

---

## 🔄 Version History (Future)

### Planned Implementation
- **Table:** `journal_note_versions`
- **Trigger:** Auto-create version on every save
- **Storage:** Snapshot of title + content + timestamp
- **UI:** "Version History" button → List of versions → Restore option

### Database Trigger (SQL)
```sql
CREATE TRIGGER journal_note_versioning
  BEFORE UPDATE ON journal_notes
  FOR EACH ROW
  EXECUTE FUNCTION create_note_version();
```

---

## 🚀 Migration to Supabase (Future)

### Steps
1. **Create Tables:**
   - Run `supabase-journal-schema.sql`
   - Creates `journal_folders`, `journal_notes`, `journal_attachments`, etc.

2. **Install Dependencies:**
   ```bash
   npm install @supabase/ssr @supabase/supabase-js
   ```

3. **Environment Variables:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```

4. **Replace Mock Data:**
   - Swap `mockNotes` with API calls
   - Use `lib/supabase/journal-client.ts` helper functions
   - Enable RLS policies for security

5. **Create Storage Bucket:**
   ```sql
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('journal-images', 'journal-images', false);
   ```

6. **Test Auth Integration:**
   - Verify `user_id` filters work
   - Check RLS policies block unauthorized access

---

## 🎯 Best Practices

### Do's ✅
- **Use Auto-Save:** Don't require manual save buttons
- **Provide Feedback:** Show "Saving..." status
- **Organize Early:** Create folders before notes pile up
- **Link Trades:** Connect notes to actual trade data for analysis
- **Tag Consistently:** Use standard tags for easier filtering
- **Use AI Wisely:** Let AI summarize, don't let it write your notes

### Don'ts ❌
- **Don't Over-Tag:** 3-5 tags per note is plenty
- **Don't Skip Titles:** Always give notes descriptive titles
- **Don't Ignore Structure:** Use headers, lists, and formatting
- **Don't Delete Without Backup:** Version history coming soon
- **Don't Store Passwords:** Never put sensitive data in journal

---

## 🐛 Debugging Tips

### Common Issues

#### 1. **Editor Not Loading**
- Check Tiptap dependencies are installed
- Verify `content` prop is valid HTML
- Check browser console for errors

#### 2. **Auto-Save Not Triggering**
- Ensure `onSave` callback is defined
- Check `useEffect` dependencies array
- Verify debounce timer isn't being cleared

#### 3. **Images Not Displaying**
- Check image URLs are accessible
- Verify CORS settings for external images
- Ensure Next.js `Image` component has proper `domains` config

#### 4. **Folders Not Expanding**
- Verify `isExpanded` state is updating
- Check `toggleFolder` function logic
- Ensure click event isn't being prevented

---

## 📚 Next Steps

### Phase 1 (Current)
- ✅ File tree with folder/note management
- ✅ Rich text editor with Tiptap
- ✅ Trade linking
- ✅ AI action framework
- ✅ Auto-save
- ✅ Tag management

### Phase 2 (Immediate)
- [ ] Supabase integration
- [ ] Real-time persistence
- [ ] Image upload to storage
- [ ] Full-text search
- [ ] Filter by tag/ticker

### Phase 3 (Future)
- [ ] Version history
- [ ] Collaborative editing
- [ ] Export to PDF/Markdown
- [ ] Mobile app view
- [ ] Keyboard shortcuts (Cmd+B, Cmd+I, etc.)
- [ ] Drag & drop folder organization

---

## 🤝 Contributing

When adding features:
1. Follow existing patterns (Context for state, shadcn/ui for components)
2. Update this documentation
3. Add TypeScript types to `lib/types/journal.ts`
4. Test dark mode support
5. Ensure mobile responsiveness

---

## 📄 License

Part of Signal Trading Journal - Internal use only

---

**Last Updated:** November 4, 2025  
**Version:** 1.0.0  
**Status:** ✅ Fully Functional (Mock Data)
