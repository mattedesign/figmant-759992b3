
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
        const key = setting.setting_key as keyof ClaudeSettings;
        // Handle both old format (direct value) and new format (JSON with value property)
        if (setting.setting_value && typeof setting.setting_value === 'object' && 'value' in setting.setting_value) {
          settings[key] = (setting.setting_value as any).value;
        } else {
          settings[key] = setting.setting_value as any;
        }
      });
      
      return settings;
    }
  });
};
