
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

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('setting_key');
      
      if (error) throw error;
      
      const settingsMap: Record<string, any> = {};
      data.forEach(setting => {
        settingsMap[setting.setting_key] = setting.setting_value;
      });
      
      return settingsMap;
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value, description }: { key: string; value: any; description?: string }) => {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          description: description || ''
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast({
        title: "Settings Updated",
        description: "Admin settings have been saved successfully.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update admin settings.",
      });
    }
  });

  const handleSave = async (formData: FormData) => {
    const stripeWebhook = formData.get('stripeWebhook') === 'on';
    const maxSubscribers = parseInt(formData.get('maxSubscribers') as string) || 1000;
    const claudeEnabled = formData.get('claudeEnabled') === 'on';

    try {
      await Promise.all([
        updateSettingMutation.mutateAsync({ 
          key: 'stripe_webhook_enabled', 
          value: stripeWebhook,
          description: 'Enable Stripe webhook processing'
        }),
        updateSettingMutation.mutateAsync({ 
          key: 'max_subscribers_limit', 
          value: maxSubscribers,
          description: 'Maximum number of subscribers allowed'
        }),
        updateSettingMutation.mutateAsync({ 
          key: 'claude_ai_enabled', 
          value: claudeEnabled,
          description: 'Enable Claude AI integration features'
        })
      ]);
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
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleSave(formData);
        }}>
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch 
                id="stripeWebhook"
                name="stripeWebhook"
                defaultChecked={settings?.stripe_webhook_enabled === true}
                disabled={!isEditing}
              />
              <Label htmlFor="stripeWebhook">Enable Stripe Webhook Processing</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSubscribers">Maximum Subscribers Limit</Label>
              <Input
                id="maxSubscribers"
                name="maxSubscribers"
                type="number"
                min="1"
                defaultValue={settings?.max_subscribers_limit || 1000}
                disabled={!isEditing}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of subscribers allowed on the platform
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="claudeEnabled"
                name="claudeEnabled"
                defaultChecked={settings?.claude_ai_enabled === true}
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
                    type="submit"
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
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
