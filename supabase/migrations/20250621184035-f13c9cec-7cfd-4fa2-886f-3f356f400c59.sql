
-- Emergency cleanup for stuck uploads and invalid data
UPDATE design_uploads 
SET status = 'failed', updated_at = now() 
WHERE status = 'processing' 
AND created_at < now() - INTERVAL '1 hour';

-- Clean up orphaned chat sessions and attachments
UPDATE chat_sessions 
SET is_active = false 
WHERE last_activity < now() - INTERVAL '24 hours' 
AND is_active = true;

UPDATE chat_attachments 
SET is_active = false 
WHERE upload_timestamp < now() - INTERVAL '24 hours' 
AND is_active = true 
AND chat_session_id IN (
  SELECT id FROM chat_sessions WHERE is_active = false
);

UPDATE chat_links 
SET is_active = false 
WHERE upload_timestamp < now() - INTERVAL '24 hours' 
AND is_active = true 
AND chat_session_id IN (
  SELECT id FROM chat_sessions WHERE is_active = false
);

-- Create function to safely get user sessions with limits
CREATE OR REPLACE FUNCTION public.get_user_sessions_safe(p_user_id uuid)
RETURNS TABLE(
  id uuid,
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

-- Create function to safely get session attachments
CREATE OR REPLACE FUNCTION public.get_session_attachments_safe(p_session_id uuid, p_user_id uuid)
RETURNS TABLE(
  id uuid,
  file_name text,
  file_path text,
  file_size integer,
  file_type text,
  upload_timestamp timestamp with time zone
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
    ca.file_name,
    ca.file_path,
    ca.file_size,
    ca.file_type,
    ca.upload_timestamp
  FROM chat_attachments ca
  WHERE ca.chat_session_id = p_session_id 
  AND ca.is_active = true
  ORDER BY ca.upload_timestamp DESC
  LIMIT 20; -- Prevent excessive data loading
END;
$$;

-- Create function to safely get session links
CREATE OR REPLACE FUNCTION public.get_session_links_safe(p_session_id uuid, p_user_id uuid)
RETURNS TABLE(
  id uuid,
  url text,
  link_title text,
  link_description text,
  link_thumbnail text,
  upload_timestamp timestamp with time zone
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
    cl.url,
    cl.link_title,
    cl.link_description,
    cl.link_thumbnail,
    cl.upload_timestamp
  FROM chat_links cl
  WHERE cl.chat_session_id = p_session_id 
  AND cl.is_active = true
  ORDER BY cl.upload_timestamp DESC
  LIMIT 20; -- Prevent excessive data loading
END;
$$;

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_active 
ON chat_sessions(user_id, is_active, last_activity DESC);

CREATE INDEX IF NOT EXISTS idx_chat_attachments_session_active 
ON chat_attachments(chat_session_id, is_active, upload_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_chat_links_session_active 
ON chat_links(chat_session_id, is_active, upload_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_design_uploads_status_created 
ON design_uploads(status, created_at DESC);
