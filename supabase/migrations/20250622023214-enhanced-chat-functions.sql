
-- Additional functions for enhanced chat context management

-- Function to get recent messages for context (lightweight version)
CREATE OR REPLACE FUNCTION public.get_recent_messages_for_context(p_session_id uuid, p_user_id uuid, p_limit integer DEFAULT 10)
RETURNS TABLE(
  role text, 
  content text, 
  created_at timestamp with time zone,
  message_order integer
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
    cm.role,
    cm.content,
    cm.created_at,
    cm.message_order
  FROM chat_messages cm
  WHERE cm.chat_session_id = p_session_id
  ORDER BY cm.message_order DESC, cm.created_at DESC
  LIMIT p_limit;
END;
$$;

-- Function to clean up old conversation summaries (keep only latest 5)
CREATE OR REPLACE FUNCTION public.cleanup_old_summaries(p_session_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete old summaries, keeping only the 5 most recent
  DELETE FROM chat_conversation_summaries 
  WHERE chat_session_id = p_session_id 
  AND id NOT IN (
    SELECT id FROM chat_conversation_summaries 
    WHERE chat_session_id = p_session_id 
    ORDER BY created_at DESC 
    LIMIT 5
  );
END;
$$;

-- Function to get conversation statistics
CREATE OR REPLACE FUNCTION public.get_conversation_stats(p_session_id uuid, p_user_id uuid)
RETURNS TABLE(
  total_messages bigint,
  total_summaries bigint,
  estimated_tokens bigint,
  last_activity timestamp with time zone
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
    (SELECT COUNT(*) FROM chat_messages WHERE chat_session_id = p_session_id) as total_messages,
    (SELECT COUNT(*) FROM chat_conversation_summaries WHERE chat_session_id = p_session_id) as total_summaries,
    (SELECT COALESCE(SUM(token_count_estimate), 0) FROM chat_conversation_summaries WHERE chat_session_id = p_session_id) as estimated_tokens,
    (SELECT MAX(created_at) FROM chat_messages WHERE chat_session_id = p_session_id) as last_activity;
END;
$$;
