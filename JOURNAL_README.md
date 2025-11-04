# Journal System - Implementation Guide

## Overview

A comprehensive journaling and trade-notetaking system that combines a file/folder tree with a rich text editor and integrated trading details. Built with React 19, Next.js 16, and shadcn/ui components.

## 🎯 Features Implemented

### ✅ File & Folder Structure
- **Nested folder organization** - Create unlimited levels of folders
- **Drag-free tree navigation** - Expand/collapse folders with chevron icons
- **Context menu actions** - Right-click or kebab menu for operations
- **CRUD operations** - Create, rename, delete folders and notes
- **Active note highlighting** - Visual indicator for selected note
- **Search functionality** - Real-time search across all notes

### ✅ Note Editing
- **Rich formatting toolbar** - Bold, italic, underline, highlight
- **Headers** - H1, H2, H3 support
- **Lists** - Bullet and numbered lists
- **Code blocks** - Inline code and quote blocks
- **Insert options** - Links, images, dividers
- **Undo/Redo** - Full history navigation
- **Auto-save** - Visual status indicator (Saving.../Saved)
- **Markdown-style editing** - Simple textarea for now (upgradeable to Tiptap)

### ✅ Trade Linking
- **Link trades to notes** - Connect notes to specific trades
- **Trade detail card** - Shows ticker, entry, exit, P/L, setup
- **Visual P/L indicators** - Green for profit, red for loss
- **Unlink capability** - Remove trade connections
- **Trade selection modal** - Browse and select from trade history

### ✅ AI Integration
- **Summarize Note** - Get AI-generated summaries
- **Summarize Linked Trades** - Performance analysis of linked trades
- **Generate Tags** - Auto-tag based on content
- **Reformat** - AI-assisted content refinement
- **Modal-based actions** - Clean UI for AI interactions

### ✅ Tagging System
- **Dynamic tags** - Add/remove tags inline
- **Visual badges** - Color-coded tag display
- **Tag filtering** - (Ready for implementation)
- **AI-generated tags** - Automatic tagging suggestions

### ✅ Sidebar Navigation
- **Collapsible tree** - Nested folder structure
- **Search bar** - Filter notes by name
- **New Folder/Note buttons** - Quick creation actions
- **Responsive design** - Resizable panels (20/80 split default)

## 📁 File Structure

```
app/(shell)/journal/
├── page.tsx                 # Main journal page with ResizablePanelGroup
├── layout.tsx              # Layout wrapper (keeps chat in left panel)
└── journal-content.tsx     # Old card-based view (can be removed)

components/journal/
├── file-tree.tsx           # Nested folder/note tree with CRUD
└── note-editor.tsx         # Rich text editor with toolbar & trade linking
```

## 🔧 Component Architecture

### FileTree Component
**Location**: `components/journal/file-tree.tsx`

**Key Features**:
- Recursive tree rendering
- Inline rename/delete via dropdown menu
- Search filtering
- Parent folder selection for nested creation
- Expand/collapse state management

**Props**:
```typescript
{
  activeNoteId: string | null;
  onSelectNote: (noteId: string) => void;
}
```

**State Management**:
- `tree` - TreeNode array with nested structure
- `searchQuery` - Filter notes by name
- `selectedParentId` - For nested creation
- `editingNode` - Current node being renamed

### NoteEditor Component
**Location**: `components/journal/note-editor.tsx`

**Key Features**:
- Formatting toolbar (20+ actions)
- Trade linking modal
- AI actions dialog
- Tag management
- Auto-save simulation
- Linked trade display card

**Props**:
```typescript
{
  noteId: string | null;
  onSave: (note: NoteContent) => void;
}
```

**Note Data Structure**:
```typescript
type NoteContent = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  linkedTrade?: LinkedTrade;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

type LinkedTrade = {
  id: string;
  ticker: string;
  entryPrice: number;
  exitPrice?: number;
  setup: string;
  date: string;
  profitLoss?: number;
  tags: string[];
};
```

### Journal Page
**Location**: `app/(shell)/journal/page.tsx`

**Layout**:
- ResizablePanelGroup with horizontal split
- Left panel (20%): FileTree
- Right panel (80%): NoteEditor
- Resizable handle between panels

## 📊 Mock Data

### Sample Folder Structure
```
├── Trades/
│   └── 2025/
│       ├── November/
│       │   ├── AAPL Breakout Setup
│       │   └── TSLA Reversal Trade
│       └── October/
│           └── NVDA AI Rally
├── Setups/
│   ├── Breakout Playbook
│   └── Reversal Patterns
└── Research/
    └── Sector Analysis Q4
```

### Sample Notes
- **note-1**: AAPL Breakout Setup (with linked trade)
- **note-2**: TSLA Reversal Trade (with linked trade)
- **note-4**: Breakout Playbook (strategy doc)
- **note-5**: Reversal Patterns (education)

All mock data is defined in `note-editor.tsx` for easy reference.

## 🎨 UI Components Used

- **ResizablePanel** - Split pane layout
- **Dialog** - Modal interactions (new folder, rename, AI actions, link trade)
- **DropdownMenu** - Context menus for tree nodes
- **Button** - Toolbar actions
- **Input** - Search, title, tag entry
- **Textarea** - Note content editing
- **Card** - Linked trade display
- **Badge** - Tags and status indicators
- **Separator** - Toolbar dividers

## 🚀 Usage Guide

### Creating a New Folder
1. Click "+ Folder" button in sidebar
2. Enter folder name
3. Folder appears at root level

### Creating a New Note
1. Click "+ Note" button (or use folder context menu)
2. Enter note name
3. Note is created and auto-selected
4. Start editing immediately

### Linking a Trade
1. Click "Add Trade Details" button
2. Select trade from modal list
3. Trade card appears above editor
4. Click X to unlink

### Using AI Actions
1. Click "AI Actions" button
2. Select action type:
   - Summarize Note
   - Summarize Linked Trades
   - Generate Tags
3. Click "Run AI Action"
4. Results displayed (currently mock alerts)

### Formatting Text
Use the toolbar buttons for:
- **Text styles**: Bold, Italic, Underline, Highlight
- **Headers**: H1, H2, H3
- **Lists**: Bullet and numbered
- **Special**: Code, Quote, Link, Image, Divider
- **History**: Undo, Redo

### Managing Tags
- Type in tag input field and press Enter
- Click existing tag (with X) to remove
- Tags persist with note

## 🔄 Backend Integration (Not Yet Implemented)

### Supabase Tables Needed

#### `journal_folders`
```sql
CREATE TABLE journal_folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES journal_folders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `journal_notes`
```sql
CREATE TABLE journal_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES journal_folders(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[],
  trade_id UUID REFERENCES trades(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `journal_attachments`
```sql
CREATE TABLE journal_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES journal_notes(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `trades` (if not exists)
```sql
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  entry_price DECIMAL(10, 2),
  exit_price DECIMAL(10, 2),
  setup TEXT,
  date DATE NOT NULL,
  profit_loss DECIMAL(10, 2),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Routes to Create

#### `/api/journal/folders`
- `GET` - List all folders for user
- `POST` - Create new folder
- `PATCH` - Rename folder
- `DELETE` - Delete folder (and optionally cascade)

#### `/api/journal/notes`
- `GET` - List all notes (with optional folder filter)
- `POST` - Create new note
- `PATCH` - Update note content/metadata
- `DELETE` - Delete note

#### `/api/journal/notes/[id]`
- `GET` - Get single note with full content
- `PATCH` - Update note
- `DELETE` - Delete note

#### `/api/journal/search`
- `GET` - Search notes by title/content/tags

#### `/api/journal/ai`
- `POST` - Run AI actions (summarize, generate tags, etc.)

### Supabase Storage Buckets

#### `journal-images`
- **Purpose**: Store uploaded charts, screenshots, and images
- **Policies**: User can only access their own images
- **Max size**: 5MB per file
- **Allowed types**: image/png, image/jpeg, image/webp

## 🎯 Future Enhancements

### Phase 2 (Backend Integration)
- [ ] Connect to Supabase for data persistence
- [ ] Implement real-time collaboration
- [ ] Add image upload with Supabase Storage
- [ ] Implement search with full-text indexing

### Phase 3 (Advanced Features)
- [ ] Replace textarea with Tiptap rich text editor
- [ ] Add drag-and-drop for notes/folders
- [ ] Version history for notes
- [ ] Export notes to PDF/Markdown
- [ ] Share notes with other users
- [ ] Notebook templates (trade journal, daily recap, etc.)

### Phase 4 (AI Enhancements)
- [ ] Real AI integration with Signal Core
- [ ] Auto-generate trade summaries from linked trades
- [ ] Sentiment analysis of notes
- [ ] Pattern recognition in trading notes
- [ ] AI-suggested improvements to trade plans

## 🐛 Known Limitations

1. **No real persistence** - All data is mock and resets on refresh
2. **No image upload** - Image button is UI-only
3. **No drag-and-drop** - Folder/note reordering not implemented
4. **No version history** - Can't restore previous note versions
5. **Textarea-based editor** - Not a true WYSIWYG editor yet
6. **No real AI calls** - AI actions show alert dialogs
7. **No collaboration** - Single-user only

## 📝 Code Quality Notes

- ✅ All TypeScript files with proper typing
- ✅ No linting errors
- ✅ Follows Signal project conventions
- ✅ Uses shadcn/ui components (New York style)
- ✅ Proper dark mode support
- ✅ Responsive design with ResizablePanels
- ✅ Semantic HTML and accessibility
- ✅ Clean component separation

## 🎬 Getting Started

1. Navigate to `/journal` in the app
2. The FileTree loads with sample data
3. Click any note to open it in the editor
4. Create new folders/notes using the buttons
5. Try linking a trade to a note
6. Experiment with AI actions
7. Add tags and use the search

## 🛠 Customization

### Changing Default Panel Sizes
Edit `app/(shell)/journal/page.tsx`:
```typescript
<ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
  <FileTree ... />
</ResizablePanel>
```

### Adding New AI Actions
Edit `components/journal/note-editor.tsx`:
```typescript
const [aiAction, setAiAction] = useState<"summarize" | "newAction">("summarize");

// Add new card in AI Dialog
<Card onClick={() => setAiAction("newAction")}>
  <p className="font-medium">New Action</p>
  <p className="text-sm">Description</p>
</Card>
```

### Changing Tree Icons
Edit `components/journal/file-tree.tsx`:
```typescript
// Replace Lucide icons
import { CustomFolder, CustomFile } from "lucide-react";
```

## 📚 Related Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

**Built with ❤️ for Signal Copilot - AI Trading Terminal**
