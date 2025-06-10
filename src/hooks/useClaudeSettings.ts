
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
        if (setting.setting_value && typeof setting.setting_value === 'object' && 'value' in setting.setting_value) {
          const value = (setting.setting_value as any).value;
          // Type-safe assignment based on key
          if (key === 'claude_ai_enabled') {
            settings.claude_ai_enabled = value;
          } else if (key === 'claude_api_key') {
            settings.claude_api_key = value;
          } else if (key === 'claude_model') {
            settings.claude_model = value;
          } else if (key === 'claude_system_prompt') {
            settings.claude_system_prompt = value;
          }
        } else {
          // Type-safe assignment for direct values
          if (key === 'claude_ai_enabled') {
            settings.claude_ai_enabled = setting.setting_value as any;
          } else if (key === 'claude_api_key') {
            settings.claude_api_key = setting.setting_value as any;
          } else if (key === 'claude_model') {
            settings.claude_model = setting.setting_value as any;
          } else if (key === 'claude_system_prompt') {
            settings.claude_system_prompt = setting.setting_value as any;
          }
        }
      });
      
      return settings;
    }
  });
};
