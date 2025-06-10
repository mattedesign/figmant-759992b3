
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, RefreshCw } from 'lucide-react';

export const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
          <CardDescription>Loading settings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>System Configuration</span>
        </CardTitle>
        <CardDescription>
          Manage global system settings and configurations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch 
              id="stripeWebhook"
              checked={formData.stripeWebhook}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, stripeWebhook: checked }))}
              disabled={!isEditing}
            />
            <Label htmlFor="stripeWebhook">Enable Stripe Webhook Processing</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxSubscribers">Maximum Subscribers Limit</Label>
            <Input
              id="maxSubscribers"
              type="number"
              min="1"
              value={formData.maxSubscribers}
              onChange={(e) => setFormData(prev => ({ ...prev, maxSubscribers: parseInt(e.target.value) || 1000 }))}
              disabled={!isEditing}
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of subscribers allowed on the platform
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="claudeEnabled"
              checked={formData.claudeEnabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, claudeEnabled: checked }))}
              disabled={!isEditing}
            />
            <Label htmlFor="claudeEnabled">Enable Claude AI Features</Label>
          </div>

          <div className="flex space-x-4">
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Edit Settings</span>
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={updateSettingMutation.isPending}
                  className="flex items-center space-x-2"
                >
                  {updateSettingMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>
                    {updateSettingMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data to current settings
                    setFormData({
                      stripeWebhook: settings?.stripe_webhook_enabled === true,
                      maxSubscribers: parseInt(settings?.max_subscribers_limit) || 1000,
                      claudeEnabled: settings?.claude_ai_enabled === true
                    });
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
