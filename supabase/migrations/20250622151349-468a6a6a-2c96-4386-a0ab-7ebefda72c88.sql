
-- Fix the ambiguous column reference errors in the safe functions
-- by adding proper table aliases and ensuring all column references are explicit

-- Drop and recreate get_user_sessions_safe with proper aliases
DROP FUNCTION IF EXISTS public.get_user_sessions_safe(uuid);

CREATE OR REPLACE FUNCTION public.get_user_sessions_safe(p_user_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  session_name text,
  created_at timestamp with time zone,
  last_activity timestamp with time zone,
  is_active boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cs.id,
    cs.user_id,
    cs.session_name,
    cs.created_at,
    cs.last_activity,
    cs.is_active
  FROM public.chat_sessions cs
  WHERE cs.user_id = p_user_id 
  AND cs.is_active = true
  ORDER BY cs.last_activity DESC
  LIMIT 50;
END;
$$;

-- Drop and recreate get_session_attachments_safe with proper aliases
DROP FUNCTION IF EXISTS public.get_session_attachments_safe(uuid, uuid);

CREATE OR REPLACE FUNCTION public.get_session_attachments_safe(p_session_id uuid, p_user_id uuid)
RETURNS TABLE(
  id uuid,
  chat_session_id uuid,
  message_id uuid,
  file_name text,
  file_path text,
  file_size integer,
  file_type text,
  upload_timestamp timestamp with time zone,
  is_active boolean,
  created_by uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify session belongs to user first
  IF NOT EXISTS (
    SELECT 1 FROM public.chat_sessions cs
    WHERE cs.id = p_session_id AND cs.user_id = p_user_id AND cs.is_active = true
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    ca.id,
    ca.chat_session_id,
    ca.message_id,
    ca.file_name,
    ca.file_path,
    ca.file_size,
    ca.file_type,
    ca.upload_timestamp,
    ca.is_active,
    ca.created_by
  FROM public.chat_attachments ca
  WHERE ca.chat_session_id = p_session_id 
  AND ca.is_active = true
  ORDER BY ca.upload_timestamp DESC
  LIMIT 20;
END;
$$;

-- Drop and recreate get_session_links_safe with proper aliases
DROP FUNCTION IF EXISTS public.get_session_links_safe(uuid, uuid);

CREATE OR REPLACE FUNCTION public.get_session_links_safe(p_session_id uuid, p_user_id uuid)
RETURNS TABLE(
  id uuid,
  chat_session_id uuid,
  message_id uuid,
  url text,
  link_title text,
  link_description text,
  link_thumbnail text,
  upload_timestamp timestamp with time zone,
  is_active boolean,
  created_by uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify session belongs to user first
  IF NOT EXISTS (
    SELECT 1 FROM public.chat_sessions cs
    WHERE cs.id = p_session_id AND cs.user_id = p_user_id AND cs.is_active = true
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    cl.id,
    cl.chat_session_id,
    cl.message_id,
    cl.url,
    cl.link_title,
    cl.link_description,
    cl.link_thumbnail,
    cl.upload_timestamp,
    cl.is_active,
    cl.created_by
  FROM public.chat_links cl
  WHERE cl.chat_session_id = p_session_id 
  AND cl.is_active = true
  ORDER BY cl.upload_timestamp DESC
  LIMIT 20;
END;
$$;

-- Create a new function to safely get session messages with proper aliases
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
    SELECT 1 FROM public.chat_sessions cs
    WHERE cs.id = p_session_id AND cs.user_id = p_user_id
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
  FROM public.chat_messages cm
  LEFT JOIN public.chat_message_attachments cma ON cm.id = cma.message_id
  LEFT JOIN public.chat_attachments ca ON cma.attachment_id = ca.id
  LEFT JOIN public.chat_links cl ON cma.link_id = cl.id
  WHERE cm.chat_session_id = p_session_id
  GROUP BY cm.id, cm.role, cm.content, cm.created_at, cm.message_order, cm.metadata
  ORDER BY cm.message_order ASC, cm.created_at ASC
  LIMIT 200;
END;
$$;

-- Create a function to save chat messages safely
CREATE OR REPLACE FUNCTION public.save_chat_message(
  p_session_id uuid, 
  p_role text, 
  p_content text, 
  p_message_order integer, 
  p_metadata jsonb DEFAULT '{}'::jsonb, 
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
    SELECT 1 FROM public.chat_sessions cs
    WHERE cs.id = p_session_id AND cs.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Session not found or access denied';
  END IF;

  -- Insert the message
  INSERT INTO public.chat_messages (
    chat_session_id, role, content, message_order, metadata, created_by
  ) VALUES (
    p_session_id, p_role, p_content, p_message_order, p_metadata, auth.uid()
  ) RETURNING id INTO new_message_id;

  -- Link attachments
  IF array_length(p_attachment_ids, 1) > 0 THEN
    FOR i IN 1..array_length(p_attachment_ids, 1) LOOP
      INSERT INTO public.chat_message_attachments (
        message_id, attachment_id, attachment_order
      ) VALUES (
        new_message_id, p_attachment_ids[i], i
      );
    END LOOP;
  END IF;

  -- Link URLs
  IF array_length(p_link_ids, 1) > 0 THEN
    FOR i IN 1..array_length(p_link_ids, 1) LOOP
      INSERT INTO public.chat_message_attachments (
        message_id, link_id, attachment_order
      ) VALUES (
        new_message_id, p_link_ids[i], i
      );
    END LOOP;
  END IF;

  RETURN new_message_id;
END;
$$;

-- Create a function to create conversation summaries
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
    SELECT 1 FROM public.chat_sessions cs
    WHERE cs.id = p_session_id AND cs.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Session not found or access denied';
  END IF;

  INSERT INTO public.chat_conversation_summaries (
    chat_session_id, summary_content, messages_included, token_count_estimate, created_by
  ) VALUES (
    p_session_id, p_summary_content, p_messages_included, p_token_count_estimate, auth.uid()
  ) RETURNING id INTO summary_id;

  RETURN summary_id;
END;
$$;
