
-- Fix the upsert issue by adding a proper unique constraint and improving the table structure
ALTER TABLE public.admin_settings DROP CONSTRAINT IF EXISTS admin_settings_setting_key_key;
ALTER TABLE public.admin_settings ADD CONSTRAINT admin_settings_setting_key_unique UNIQUE (setting_key);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_settings_setting_key ON public.admin_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_claude_usage_logs_user_id_created_at ON public.claude_usage_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_claude_insights_user_id_created_at ON public.claude_insights(user_id, created_at);

-- Add validation function for Claude API keys
CREATE OR REPLACE FUNCTION validate_claude_api_key(api_key text) 
RETURNS boolean 
LANGUAGE plpgsql 
AS $$
BEGIN
  -- Basic validation: should start with 'sk-ant-' and be at least 20 characters
  RETURN api_key IS NOT NULL 
    AND length(api_key) >= 20 
    AND api_key LIKE 'sk-ant-%';
END;
$$;

-- Add validation function for Claude models
CREATE OR REPLACE FUNCTION validate_claude_model(model text) 
RETURNS boolean 
LANGUAGE plpgsql 
AS $$
BEGIN
  RETURN model IN (
    'claude-opus-4-20250514',
    'claude-sonnet-4-20250514', 
    'claude-3-5-haiku-20241022',
    'claude-3-7-sonnet-20250219',
    'claude-3-5-sonnet-20241022',
    'claude-3-opus-20240229',
    'claude-3-haiku-20240307'
  );
END;
$$;

-- Improve the get_claude_settings function with better error handling
CREATE OR REPLACE FUNCTION public.get_claude_settings()
RETURNS TABLE (
  claude_ai_enabled BOOLEAN,
  claude_model TEXT,
  claude_system_prompt TEXT
) 
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    COALESCE((SELECT (setting_value->>'value')::boolean FROM public.admin_settings WHERE setting_key = 'claude_ai_enabled'), false) as claude_ai_enabled,
    COALESCE((SELECT setting_value->>'value' FROM public.admin_settings WHERE setting_key = 'claude_model'), 'claude-3-5-haiku-20241022') as claude_model,
    COALESCE((SELECT setting_value->>'value' FROM public.admin_settings WHERE setting_key = 'claude_system_prompt'), 'You are a UX analytics expert that provides insights on user behavior and experience patterns.') as claude_system_prompt
$$;

-- Add a better upsert function for admin settings
CREATE OR REPLACE FUNCTION upsert_admin_setting(
  p_setting_key TEXT,
  p_setting_value TEXT,
  p_description TEXT DEFAULT NULL,
  p_updated_by UUID DEFAULT auth.uid()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check if user has permission (must be owner)
  IF NOT public.has_role(auth.uid(), 'owner') THEN
    RAISE EXCEPTION 'Only owners can modify admin settings';
  END IF;

  -- Validate Claude API key if that's what we're setting
  IF p_setting_key = 'claude_api_key' AND NOT validate_claude_api_key(p_setting_value) THEN
    RAISE EXCEPTION 'Invalid Claude API key format. Must start with sk-ant- and be at least 20 characters.';
  END IF;

  -- Validate Claude model if that's what we're setting
  IF p_setting_key = 'claude_model' AND NOT validate_claude_model(p_setting_value) THEN
    RAISE EXCEPTION 'Invalid Claude model. Must be one of the supported models.';
  END IF;

  -- Validate system prompt length
  IF p_setting_key = 'claude_system_prompt' AND length(p_setting_value) > 2000 THEN
    RAISE EXCEPTION 'System prompt too long. Maximum 2000 characters allowed.';
  END IF;

  -- Perform the upsert with proper JSON wrapping
  INSERT INTO public.admin_settings (setting_key, setting_value, description, updated_by)
  VALUES (p_setting_key, jsonb_build_object('value', p_setting_value), p_description, p_updated_by)
  ON CONFLICT (setting_key) 
  DO UPDATE SET 
    setting_value = jsonb_build_object('value', p_setting_value),
    description = COALESCE(EXCLUDED.description, admin_settings.description),
    updated_by = p_updated_by,
    updated_at = now()
  RETURNING jsonb_build_object(
    'setting_key', setting_key,
    'setting_value', setting_value,
    'success', true
  ) INTO result;

  RETURN result;
END;
$$;
