
-- Create table to store chat messages for persistence
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  message_order INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Create table to link messages with their attachments
CREATE TABLE public.chat_message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  attachment_id UUID REFERENCES public.chat_attachments(id) ON DELETE SET NULL,
  link_id UUID REFERENCES public.chat_links(id) ON DELETE SET NULL,
  attachment_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create table for conversation summaries to manage long contexts
CREATE TABLE public.chat_conversation_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  summary_content TEXT NOT NULL,
  messages_included INTEGER NOT NULL DEFAULT 0,
  token_count_estimate INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversation_summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view their own messages" 
  ON public.chat_messages FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can create their own messages" 
  ON public.chat_messages FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own messages" 
  ON public.chat_messages FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own messages" 
  ON public.chat_messages FOR DELETE 
  USING (created_by = auth.uid());

-- Create RLS policies for chat_message_attachments
CREATE POLICY "Users can view their own message attachments" 
  ON public.chat_message_attachments FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.chat_messages cm 
    WHERE cm.id = message_id AND cm.created_by = auth.uid()
  ));

CREATE POLICY "Users can create their own message attachments" 
  ON public.chat_message_attachments FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.chat_messages cm 
    WHERE cm.id = message_id AND cm.created_by = auth.uid()
  ));

-- Create RLS policies for chat_conversation_summaries
CREATE POLICY "Users can view their own conversation summaries" 
  ON public.chat_conversation_summaries FOR SELECT 
  USING (created_by = auth.uid());

CREATE POLICY "Users can create their own conversation summaries" 
  ON public.chat_conversation_summaries FOR INSERT 
  WITH CHECK (created_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_chat_messages_session ON public.chat_messages(chat_session_id);
CREATE INDEX idx_chat_messages_order ON public.chat_messages(chat_session_id, message_order);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX idx_chat_message_attachments_message ON public.chat_message_attachments(message_id);
CREATE INDEX idx_chat_conversation_summaries_session ON public.chat_conversation_summaries(chat_session_id);

-- Function to get session messages with attachments safely
CREATE OR REPLACE FUNCTION public.get_session_messages_safe(p_session_id uuid, p_user_id uuid)
RETURNS TABLE(
  id uuid, 
  role text, 
  content text, 
  created_at timestamp with time zone,
  message_order integer,
  metadata jsonb,
  attachments jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify session belongs to user
  IF NOT EXISTS (
    SELECT 1 FROM chat_sessions 
    WHERE id = p_session_id AND user_id = p_user_id
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    cm.id,
    cm.role,
    cm.content,
    cm.created_at,
    cm.message_order,
    cm.metadata,
    COALESCE(
      jsonb_agg(
        CASE 
          WHEN cma.attachment_id IS NOT NULL THEN 
            jsonb_build_object(
              'id', ca.id,
              'type', 'file',
              'name', ca.file_name,
              'path', ca.file_path,
              'size', ca.file_size,
              'file_type', ca.file_type
            )
          WHEN cma.link_id IS NOT NULL THEN
            jsonb_build_object(
              'id', cl.id,
              'type', 'url',
              'name', cl.link_title,
              'url', cl.url,
              'description', cl.link_description
            )
          ELSE NULL
        END
      ) FILTER (WHERE cma.id IS NOT NULL),
      '[]'::jsonb
    ) as attachments
  FROM chat_messages cm
  LEFT JOIN chat_message_attachments cma ON cm.id = cma.message_id
  LEFT JOIN chat_attachments ca ON cma.attachment_id = ca.id
  LEFT JOIN chat_links cl ON cma.link_id = cl.id
  WHERE cm.chat_session_id = p_session_id
  GROUP BY cm.id, cm.role, cm.content, cm.created_at, cm.message_order, cm.metadata
  ORDER BY cm.message_order ASC, cm.created_at ASC
  LIMIT 200; -- Prevent excessive data loading
END;
$$;

-- Function to save a message with its attachments
CREATE OR REPLACE FUNCTION public.save_chat_message(
  p_session_id uuid,
  p_role text,
  p_content text,
  p_message_order integer,
  p_metadata jsonb DEFAULT '{}',
  p_attachment_ids uuid[] DEFAULT ARRAY[]::uuid[],
  p_link_ids uuid[] DEFAULT ARRAY[]::uuid[]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_message_id uuid;
  attachment_id uuid;
  link_id uuid;
  i integer;
BEGIN
  -- Verify session belongs to user
  IF NOT EXISTS (
    SELECT 1 FROM chat_sessions 
    WHERE id = p_session_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Session not found or access denied';
  END IF;

  -- Insert the message
  INSERT INTO chat_messages (
    chat_session_id, role, content, message_order, metadata, created_by
  ) VALUES (
    p_session_id, p_role, p_content, p_message_order, p_metadata, auth.uid()
  ) RETURNING id INTO new_message_id;

  -- Link attachments
  IF array_length(p_attachment_ids, 1) > 0 THEN
    FOR i IN 1..array_length(p_attachment_ids, 1) LOOP
      INSERT INTO chat_message_attachments (
        message_id, attachment_id, attachment_order
      ) VALUES (
        new_message_id, p_attachment_ids[i], i
      );
    END LOOP;
  END IF;

  -- Link URLs
  IF array_length(p_link_ids, 1) > 0 THEN
    FOR i IN 1..array_length(p_link_ids, 1) LOOP
      INSERT INTO chat_message_attachments (
        message_id, link_id, attachment_order
      ) VALUES (
        new_message_id, p_link_ids[i], i
      );
    END LOOP;
  END IF;

  RETURN new_message_id;
END;
$$;

-- Function to create conversation summary
CREATE OR REPLACE FUNCTION public.create_conversation_summary(
  p_session_id uuid,
  p_summary_content text,
  p_messages_included integer,
  p_token_count_estimate integer DEFAULT 0
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  summary_id uuid;
BEGIN
  -- Verify session belongs to user
  IF NOT EXISTS (
    SELECT 1 FROM chat_sessions 
    WHERE id = p_session_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Session not found or access denied';
  END IF;

  INSERT INTO chat_conversation_summaries (
    chat_session_id, summary_content, messages_included, token_count_estimate, created_by
  ) VALUES (
    p_session_id, p_summary_content, p_messages_included, p_token_count_estimate, auth.uid()
  ) RETURNING id INTO summary_id;

  RETURN summary_id;
END;
$$;
