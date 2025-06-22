
-- Add the missing tables and policies one by one to avoid deadlocks

-- First, add the chat_message_attachments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.chat_message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  attachment_id UUID REFERENCES public.chat_attachments(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.chat_links(id) ON DELETE CASCADE,
  attachment_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_attachment_xor_link CHECK (
    (attachment_id IS NOT NULL AND link_id IS NULL) OR 
    (attachment_id IS NULL AND link_id IS NOT NULL)
  )
);

-- Add conversation summaries table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.chat_conversation_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  summary_content TEXT NOT NULL,
  messages_included INTEGER NOT NULL DEFAULT 0,
  token_count_estimate INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);
