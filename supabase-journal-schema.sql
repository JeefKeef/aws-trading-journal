-- Journal System Database Schema
-- Supabase PostgreSQL Tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: journal_folders
-- ============================================
CREATE TABLE journal_folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES journal_folders(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0, -- For manual ordering
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT folder_name_not_empty CHECK (char_length(name) > 0)
);

-- Indexes for performance
CREATE INDEX idx_journal_folders_user_id ON journal_folders(user_id);
CREATE INDEX idx_journal_folders_parent_id ON journal_folders(parent_id);
CREATE INDEX idx_journal_folders_user_parent ON journal_folders(user_id, parent_id);

-- RLS Policies
ALTER TABLE journal_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own folders"
  ON journal_folders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own folders"
  ON journal_folders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders"
  ON journal_folders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders"
  ON journal_folders FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TABLE: journal_notes
-- ============================================
CREATE TABLE journal_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES journal_folders(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Note',
  content TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  trade_id UUID REFERENCES trades(id) ON DELETE SET NULL,
  position INTEGER DEFAULT 0, -- For manual ordering within folder
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT note_title_not_empty CHECK (char_length(title) > 0)
);

-- Indexes for performance
CREATE INDEX idx_journal_notes_user_id ON journal_notes(user_id);
CREATE INDEX idx_journal_notes_folder_id ON journal_notes(folder_id);
CREATE INDEX idx_journal_notes_trade_id ON journal_notes(trade_id);
CREATE INDEX idx_journal_notes_created_at ON journal_notes(created_at DESC);
CREATE INDEX idx_journal_notes_updated_at ON journal_notes(updated_at DESC);
CREATE INDEX idx_journal_notes_tags ON journal_notes USING GIN(tags);

-- Full-text search index
CREATE INDEX idx_journal_notes_search ON journal_notes 
  USING GIN(to_tsvector('english', title || ' ' || content));

-- RLS Policies
ALTER TABLE journal_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes"
  ON journal_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
  ON journal_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON journal_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON journal_notes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TABLE: journal_attachments
-- ============================================
CREATE TABLE journal_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID NOT NULL REFERENCES journal_notes(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT file_url_not_empty CHECK (char_length(file_url) > 0),
  CONSTRAINT file_name_not_empty CHECK (char_length(file_name) > 0),
  CONSTRAINT file_size_positive CHECK (file_size > 0)
);

-- Indexes
CREATE INDEX idx_journal_attachments_note_id ON journal_attachments(note_id);

-- RLS Policies (inherit from parent note)
ALTER TABLE journal_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments of their notes"
  ON journal_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM journal_notes
      WHERE journal_notes.id = journal_attachments.note_id
      AND journal_notes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create attachments for their notes"
  ON journal_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM journal_notes
      WHERE journal_notes.id = journal_attachments.note_id
      AND journal_notes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete attachments from their notes"
  ON journal_attachments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM journal_notes
      WHERE journal_notes.id = journal_attachments.note_id
      AND journal_notes.user_id = auth.uid()
    )
  );

-- ============================================
-- TABLE: journal_note_versions (optional)
-- ============================================
CREATE TABLE journal_note_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID NOT NULL REFERENCES journal_notes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  version_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Constraints
  CONSTRAINT version_number_positive CHECK (version_number > 0),
  UNIQUE(note_id, version_number)
);

-- Indexes
CREATE INDEX idx_journal_versions_note_id ON journal_note_versions(note_id);
CREATE INDEX idx_journal_versions_created_at ON journal_note_versions(created_at DESC);

-- RLS Policies
ALTER TABLE journal_note_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions of their notes"
  ON journal_note_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM journal_notes
      WHERE journal_notes.id = journal_note_versions.note_id
      AND journal_notes.user_id = auth.uid()
    )
  );

-- ============================================
-- TABLE: trades (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  entry_price DECIMAL(10, 2),
  exit_price DECIMAL(10, 2),
  quantity INTEGER,
  setup TEXT,
  date DATE NOT NULL,
  profit_loss DECIMAL(10, 2),
  profit_loss_percentage DECIMAL(10, 2),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT ticker_not_empty CHECK (char_length(ticker) > 0),
  CONSTRAINT quantity_positive CHECK (quantity > 0)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_ticker ON trades(ticker);
CREATE INDEX IF NOT EXISTS idx_trades_date ON trades(date DESC);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_trades_tags ON trades USING GIN(tags);

-- RLS Policies
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own trades" ON trades;
CREATE POLICY "Users can view their own trades"
  ON trades FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own trades" ON trades;
CREATE POLICY "Users can create their own trades"
  ON trades FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own trades" ON trades;
CREATE POLICY "Users can update their own trades"
  ON trades FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own trades" ON trades;
CREATE POLICY "Users can delete their own trades"
  ON trades FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_journal_folders_updated_at
  BEFORE UPDATE ON journal_folders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_notes_updated_at
  BEFORE UPDATE ON journal_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON trades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create note version on update
CREATE OR REPLACE FUNCTION create_note_version()
RETURNS TRIGGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM journal_note_versions
  WHERE note_id = NEW.id;
  
  -- Insert version if content changed
  IF OLD.content IS DISTINCT FROM NEW.content OR OLD.title IS DISTINCT FROM NEW.title THEN
    INSERT INTO journal_note_versions (note_id, title, content, version_number, created_by)
    VALUES (NEW.id, OLD.title, OLD.content, next_version, auth.uid());
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for versioning
CREATE TRIGGER journal_note_versioning
  BEFORE UPDATE ON journal_notes
  FOR EACH ROW
  EXECUTE FUNCTION create_note_version();

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Run this in Supabase Storage UI or via SQL:
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('journal-images', 'journal-images', false);

-- Storage policies (run after bucket creation)
-- CREATE POLICY "Users can upload their own images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'journal-images' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "Users can view their own images"
--   ON storage.objects FOR SELECT
--   USING (
--     bucket_id = 'journal-images' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "Users can delete their own images"
--   ON storage.objects FOR DELETE
--   USING (
--     bucket_id = 'journal-images' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- ============================================
-- UTILITY VIEWS
-- ============================================

-- View for notes with trade details
CREATE OR REPLACE VIEW journal_notes_with_trades AS
SELECT 
  n.*,
  t.ticker,
  t.entry_price,
  t.exit_price,
  t.profit_loss,
  t.profit_loss_percentage,
  t.setup AS trade_setup,
  t.date AS trade_date,
  t.status AS trade_status
FROM journal_notes n
LEFT JOIN trades t ON n.trade_id = t.id;

-- View for folder tree structure
CREATE OR REPLACE VIEW journal_folder_tree AS
WITH RECURSIVE folder_tree AS (
  -- Base case: root folders
  SELECT 
    id,
    user_id,
    name,
    parent_id,
    ARRAY[name] AS path,
    1 AS depth
  FROM journal_folders
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- Recursive case: child folders
  SELECT 
    f.id,
    f.user_id,
    f.name,
    f.parent_id,
    ft.path || f.name,
    ft.depth + 1
  FROM journal_folders f
  INNER JOIN folder_tree ft ON f.parent_id = ft.id
)
SELECT * FROM folder_tree;

-- ============================================
-- SEARCH FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION search_journal_notes(
  search_query TEXT,
  user_filter UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  tags TEXT[],
  folder_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.title,
    n.content,
    n.tags,
    n.folder_id,
    n.created_at,
    n.updated_at,
    ts_rank(
      to_tsvector('english', n.title || ' ' || n.content),
      plainto_tsquery('english', search_query)
    ) AS rank
  FROM journal_notes n
  WHERE 
    (user_filter IS NULL OR n.user_id = user_filter)
    AND (
      to_tsvector('english', n.title || ' ' || n.content) @@ plainto_tsquery('english', search_query)
      OR n.tags && string_to_array(search_query, ' ')
    )
  ORDER BY rank DESC, n.updated_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE QUERIES
-- ============================================

-- Get all folders for a user
-- SELECT * FROM journal_folders WHERE user_id = auth.uid() ORDER BY position, name;

-- Get all notes in a folder
-- SELECT * FROM journal_notes WHERE folder_id = 'folder-uuid' ORDER BY position, created_at DESC;

-- Search notes
-- SELECT * FROM search_journal_notes('breakout trading', auth.uid());

-- Get recent notes
-- SELECT * FROM journal_notes WHERE user_id = auth.uid() ORDER BY updated_at DESC LIMIT 10;

-- Get notes by tag
-- SELECT * FROM journal_notes WHERE user_id = auth.uid() AND 'Breakout' = ANY(tags);

-- Get folder tree
-- SELECT * FROM journal_folder_tree WHERE user_id = auth.uid() ORDER BY path;
