
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminSettingsFormData {
  stripeWebhook: boolean;
  maxSubscribers: number;
  claudeEnabled: boolean;
}

export const useAdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AdminSettingsFormData>({
    stripeWebhook: false,
    maxSubscribers: 1000,
    claudeEnabled: false
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .in('setting_key', ['stripe_webhook_enabled', 'max_subscribers_limit', 'claude_ai_enabled'])
        .order('setting_key');
      
      if (error) throw error;
      
      const settingsMap: Record<string, any> = {};
      data.forEach(setting => {
        // Handle both old format (direct value) and new format (JSON with value property)
        if (setting.setting_value && typeof setting.setting_value === 'object' && 'value' in setting.setting_value) {
          settingsMap[setting.setting_key] = (setting.setting_value as any).value;
        } else {
          settingsMap[setting.setting_key] = setting.setting_value;
        }
      });
      
      // Update form data when settings are loaded
      setFormData({
        stripeWebhook: settingsMap.stripe_webhook_enabled === true,
        maxSubscribers: parseInt(settingsMap.max_subscribers_limit) || 1000,
        claudeEnabled: settingsMap.claude_ai_enabled === true
      });
      
      return settingsMap;
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value, description }: { key: string; value: any; description?: string }) => {
      const { data, error } = await supabase.rpc('upsert_admin_setting', {
        p_setting_key: key,
        p_setting_value: String(value),
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
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast({
        title: "Settings Updated",
        description: `${variables.key.replace('_', ' ')} updated successfully.`,
      });
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      
      let errorMessage = 'Failed to update admin settings.';
      if (error.message.includes('Only owners can modify')) {
        errorMessage = 'You do not have permission to modify these settings.';
      }
      
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: errorMessage,
      });
    }
  });

  const handleSave = async () => {
    try {
      // Validate max subscribers
      if (formData.maxSubscribers < 1) {
        toast({
          variant: "destructive",
          title: "Invalid Value",
          description: "Maximum subscribers must be at least 1.",
        });
        return;
      }

      await Promise.all([
        updateSettingMutation.mutateAsync({ 
          key: 'stripe_webhook_enabled', 
          value: formData.stripeWebhook,
          description: 'Enable Stripe webhook processing'
        }),
        updateSettingMutation.mutateAsync({ 
          key: 'max_subscribers_limit', 
          value: formData.maxSubscribers,
          description: 'Maximum number of subscribers allowed'
        }),
        updateSettingMutation.mutateAsync({ 
          key: 'claude_ai_enabled', 
          value: formData.claudeEnabled,
          description: 'Enable Claude AI integration features'
        })
      ]);

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const resetFormData = () => {
    setFormData({
      stripeWebhook: settings?.stripe_webhook_enabled === true,
      maxSubscribers: parseInt(settings?.max_subscribers_limit) || 1000,
      claudeEnabled: settings?.claude_ai_enabled === true
    });
  };

  return {
    settings,
    isLoading,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    handleSave,
    resetFormData,
    isPending: updateSettingMutation.isPending
  };
};
