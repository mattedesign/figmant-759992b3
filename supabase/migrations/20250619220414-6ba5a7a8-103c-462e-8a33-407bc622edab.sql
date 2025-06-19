
-- Create chat sessions table for organizing conversations
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  session_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create chat attachments table for file storage metadata
CREATE TABLE public.chat_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  message_id UUID,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  upload_timestamp TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Create chat links table for URL storage
CREATE TABLE public.chat_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  message_id UUID,
  url TEXT NOT NULL,
  link_title TEXT,
  link_description TEXT,
  link_thumbnail TEXT,
  upload_timestamp TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions" 
  ON public.chat_sessions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions" 
  ON public.chat_sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" 
  ON public.chat_sessions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions" 
  ON public.chat_sessions FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for chat_attachments
CREATE POLICY "Users can view their own attachments" 
  ON public.chat_attachments FOR SELECT 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own attachments" 
  ON public.chat_attachments FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own attachments" 
  ON public.chat_attachments FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own attachments" 
  ON public.chat_attachments FOR DELETE 
  USING (auth.uid() = created_by);

-- Create RLS policies for chat_links
CREATE POLICY "Users can view their own links" 
  ON public.chat_links FOR SELECT 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own links" 
  ON public.chat_links FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own links" 
  ON public.chat_links FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own links" 
  ON public.chat_links FOR DELETE 
  USING (auth.uid() = created_by);

-- Create indexes for better performance
CREATE INDEX idx_chat_sessions_user ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_activity ON public.chat_sessions(last_activity DESC);
CREATE INDEX idx_chat_attachments_session ON public.chat_attachments(chat_session_id);
CREATE INDEX idx_chat_attachments_user ON public.chat_attachments(created_by);
CREATE INDEX idx_chat_attachments_message ON public.chat_attachments(message_id);
CREATE INDEX idx_chat_links_session ON public.chat_links(chat_session_id);
CREATE INDEX idx_chat_links_user ON public.chat_links(created_by);
CREATE INDEX idx_chat_links_message ON public.chat_links(message_id);

-- Create storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'chat-attachments',
  'chat-attachments',
  false,
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
);

-- Create storage policies for chat attachments bucket
CREATE POLICY "Users can upload their own files" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'chat-attachments' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own files" 
  ON storage.objects FOR SELECT 
  USING (
    bucket_id = 'chat-attachments' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own files" 
  ON storage.objects FOR UPDATE 
  USING (
    bucket_id = 'chat-attachments' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own files" 
  ON storage.objects FOR DELETE 
  USING (
    bucket_id = 'chat-attachments' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to clean up old attachments (run monthly)
CREATE OR REPLACE FUNCTION public.cleanup_old_attachments()
RETURNS void AS $$
BEGIN
  -- Mark files older than 6 months as inactive
  UPDATE public.chat_attachments 
  SET is_active = false 
  WHERE upload_timestamp < NOW() - INTERVAL '6 months';
  
  -- Mark old links as inactive too
  UPDATE public.chat_links 
  SET is_active = false 
  WHERE upload_timestamp < NOW() - INTERVAL '6 months';
  
  -- Mark old sessions with no recent activity as inactive
  UPDATE public.chat_sessions 
  SET is_active = false 
  WHERE last_activity < NOW() - INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update session activity
CREATE OR REPLACE FUNCTION public.update_session_activity(session_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.chat_sessions 
  SET last_activity = NOW() 
  WHERE id = session_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
