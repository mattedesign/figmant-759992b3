
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useClaudeMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value, description }: { key: string; value: any; description?: string }) => {
      // Convert boolean values to string for storage in the database
      let processedValue = value;
      if (typeof value === 'boolean') {
        processedValue = value.toString();
      }
      
      const { data, error } = await supabase.rpc('upsert_admin_setting', {
        p_setting_key: key,
        p_setting_value: processedValue,
        p_description: description
      });
      
      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message || 'Failed to update setting');
      }
      
      return data;
    },
    onSuccess: (data, variables) => {
      console.log('Setting updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['claude-settings'] });
      
      if (variables.key === 'claude_api_key') {
        toast({
          title: "API Key Updated",
          description: "Claude API key has been saved securely.",
        });
      } else {
        toast({
          title: "Settings Updated", 
          description: `${variables.key.replace('claude_', '').replace('_', ' ')} updated successfully.`,
        });
      }
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      
      let errorMessage = 'Failed to update Claude AI settings.';
      if (error.message.includes('Invalid Claude API key')) {
        errorMessage = 'Invalid API key format. Please check that your key starts with "sk-ant-" and is complete.';
      } else if (error.message.includes('Invalid Claude model')) {
        errorMessage = 'Selected model is not supported. Please choose a different model.';
      } else if (error.message.includes('Only owners can modify')) {
        errorMessage = 'You do not have permission to modify these settings.';
      } else if (error.message.includes('System prompt too long')) {
        errorMessage = 'System prompt is too long. Please keep it under 2000 characters.';
      }
      
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: errorMessage,
      });
    }
  });

  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('claude-ai', {
        body: {
          prompt: 'Hello! Please respond with "Connection successful" if you can receive this message.',
          userId: user.id,
          requestType: 'test'
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Connection Successful",
        description: "Claude AI is responding correctly with the current settings.",
      });
    },
    onError: (error: any) => {
      console.error('Connection test error:', error);
      let errorMessage = "Failed to connect to Claude AI.";
      
      if (error.message.includes('Claude AI is disabled')) {
        errorMessage = "Claude AI is currently disabled.";
      } else if (error.message.includes('Claude API key not configured')) {
        errorMessage = "API key is not configured or invalid.";
      } else if (error.message.includes('Failed to get response')) {
        errorMessage = "API key may be invalid or expired.";
      }
      
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: errorMessage,
      });
    }
  });

  return { updateSettingMutation, testConnectionMutation };
};
