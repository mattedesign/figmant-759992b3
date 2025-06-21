
-- Drop existing functions first
DROP FUNCTION IF EXISTS public.get_user_sessions_safe(uuid);
DROP FUNCTION IF EXISTS public.get_session_attachments_safe(uuid, uuid);
DROP FUNCTION IF EXISTS public.get_session_links_safe(uuid, uuid);

-- Recreate get_user_sessions_safe with user_id included
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
  FROM chat_sessions cs
  WHERE cs.user_id = p_user_id 
  AND cs.is_active = true
  ORDER BY cs.last_activity DESC
  LIMIT 50; -- Prevent excessive data loading
END;
$$;

-- Recreate get_session_attachments_safe with all required fields
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
  -- Verify session belongs to user
  IF NOT EXISTS (
    SELECT 1 FROM chat_sessions 
    WHERE id = p_session_id AND user_id = p_user_id AND is_active = true
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
  FROM chat_attachments ca
  WHERE ca.chat_session_id = p_session_id 
  AND ca.is_active = true
  ORDER BY ca.upload_timestamp DESC
  LIMIT 20; -- Prevent excessive data loading
END;
$$;

-- Recreate get_session_links_safe with all required fields
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
  -- Verify session belongs to user
  IF NOT EXISTS (
    SELECT 1 FROM chat_sessions 
    WHERE id = p_session_id AND user_id = p_user_id AND is_active = true
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
  FROM chat_links cl
  WHERE cl.chat_session_id = p_session_id 
  AND cl.is_active = true
  ORDER BY cl.upload_timestamp DESC
  LIMIT 20; -- Prevent excessive data loading
END;
$$;
