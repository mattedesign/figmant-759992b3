
-- Enable Claude AI by default and set proper default configuration
INSERT INTO public.admin_settings (setting_key, setting_value, description, updated_by) 
VALUES 
  ('claude_ai_enabled', 'true', 'Enable Claude AI integration features', NULL),
  ('claude_model', 'claude-sonnet-4-20250514', 'Claude model version to use', NULL),
  ('claude_system_prompt', 'You are a UX analytics expert that provides insights on user behavior and experience patterns. Analyze data and provide actionable recommendations for improving user experience, conversion rates, and engagement.', 'System prompt for Claude AI interactions', NULL)
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description,
  updated_at = now();

-- Update the get_claude_settings function to use the new default model
CREATE OR REPLACE FUNCTION public.get_claude_settings()
 RETURNS TABLE(claude_ai_enabled boolean, claude_model text, claude_system_prompt text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT 
    COALESCE((SELECT (setting_value->>'value')::boolean FROM public.admin_settings WHERE setting_key = 'claude_ai_enabled'), true) as claude_ai_enabled,
    COALESCE((SELECT setting_value->>'value' FROM public.admin_settings WHERE setting_key = 'claude_model'), 'claude-sonnet-4-20250514') as claude_model,
    COALESCE((SELECT setting_value->>'value' FROM public.admin_settings WHERE setting_key = 'claude_system_prompt'), 'You are a UX analytics expert that provides insights on user behavior and experience patterns. Analyze data and provide actionable recommendations for improving user experience, conversion rates, and engagement.') as claude_system_prompt
$function$;
