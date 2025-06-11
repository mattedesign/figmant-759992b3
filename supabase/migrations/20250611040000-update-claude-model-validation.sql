
-- Update the validate_claude_model function to include the new Claude 4 models
CREATE OR REPLACE FUNCTION public.validate_claude_model(model text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
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
$function$;

-- Update the get_claude_settings function to use the new default model
CREATE OR REPLACE FUNCTION public.get_claude_settings()
 RETURNS TABLE(claude_ai_enabled boolean, claude_model text, claude_system_prompt text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT 
    COALESCE((SELECT (setting_value->>'value')::boolean FROM public.admin_settings WHERE setting_key = 'claude_ai_enabled'), false) as claude_ai_enabled,
    COALESCE((SELECT setting_value->>'value' FROM public.admin_settings WHERE setting_key = 'claude_model'), 'claude-sonnet-4-20250514') as claude_model,
    COALESCE((SELECT setting_value->>'value' FROM public.admin_settings WHERE setting_key = 'claude_system_prompt'), 'You are a UX analytics expert that provides insights on user behavior and experience patterns.') as claude_system_prompt
$function$;
