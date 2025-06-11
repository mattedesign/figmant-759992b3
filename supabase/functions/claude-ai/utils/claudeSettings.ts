
import { ClaudeSettings } from './types.ts';

export async function getClaudeSettings(supabase: any): Promise<ClaudeSettings> {
  console.log('=== FETCHING CLAUDE SETTINGS FROM ADMIN SETTINGS ===');
  
  try {
    const { data: settingsData, error: settingsError } = await supabase
      .rpc('get_claude_settings');

    if (settingsError) {
      console.error('Failed to get Claude settings:', settingsError);
      throw new Error('Failed to get Claude AI configuration');
    }

    const settings = Array.isArray(settingsData) ? settingsData[0] : settingsData;
    
    if (!settings?.claude_ai_enabled) {
      console.error('Claude AI is not enabled in admin settings');
      throw new Error('Claude AI is not enabled. Please contact your administrator.');
    }

    console.log('Claude settings retrieved:', {
      enabled: settings.claude_ai_enabled,
      model: settings.claude_model,
      systemPromptLength: settings.claude_system_prompt?.length || 0
    });

    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'claude_api_key')
      .single();

    if (apiKeyError || !apiKeyData) {
      console.error('Failed to get Claude API key from admin settings:', apiKeyError);
      throw new Error('Claude API key not configured in admin settings');
    }

    const apiKey = apiKeyData.setting_value?.value;
    if (!apiKey) {
      console.error('Claude API key is empty in admin settings');
      throw new Error('Claude API key not set in admin settings');
    }

    console.log('Claude API key retrieved from admin settings successfully');

    return {
      apiKey,
      model: settings.claude_model || 'claude-sonnet-4-20250514',
      systemPrompt: settings.claude_system_prompt || 'You are a UX analytics expert that provides insights on user behavior and experience patterns. When analyzing designs or images, provide detailed feedback on usability, visual hierarchy, accessibility, and conversion optimization opportunities.'
    };
  } catch (error) {
    console.error('Error getting Claude settings:', error);
    throw error;
  }
}
