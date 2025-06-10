
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClaudeSettings } from '@/types/claude';

export const useClaudeSettings = () => {
  return useQuery({
    queryKey: ['claude-settings'],
    queryFn: async (): Promise<ClaudeSettings> => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .in('setting_key', ['claude_ai_enabled', 'claude_api_key', 'claude_model', 'claude_system_prompt']);
      
      if (error) throw error;
      
      const settings: ClaudeSettings = {};
      data.forEach(setting => {
        const key = setting.setting_key;
        
        // Handle both old format (direct value) and new format (JSON with value property)
        let value;
        if (setting.setting_value && typeof setting.setting_value === 'object' && 'value' in setting.setting_value) {
          value = (setting.setting_value as any).value;
        } else {
          value = setting.setting_value;
        }
        
        // Type-safe assignment with proper type conversion
        if (key === 'claude_ai_enabled') {
          // Convert string boolean values to actual boolean
          if (typeof value === 'string') {
            settings.claude_ai_enabled = value === 'true';
          } else {
            settings.claude_ai_enabled = Boolean(value);
          }
        } else if (key === 'claude_api_key') {
          settings.claude_api_key = value;
        } else if (key === 'claude_model') {
          settings.claude_model = value;
        } else if (key === 'claude_system_prompt') {
          settings.claude_system_prompt = value;
        }
      });
      
      return settings;
    }
  });
};
