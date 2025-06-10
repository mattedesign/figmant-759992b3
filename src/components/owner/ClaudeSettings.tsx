
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bot, Settings, Zap, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const ClaudeSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const { data: claudeSettings, isLoading } = useQuery({
    queryKey: ['claude-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .in('setting_key', ['claude_ai_enabled', 'claude_api_key', 'claude_model', 'claude_system_prompt']);
      
      if (error) throw error;
      
      const settings: Record<string, any> = {};
      data.forEach(setting => {
        settings[setting.setting_key] = setting.setting_value;
      });
      
      return settings;
    }
  });

  // Query for usage statistics
  const { data: usageStats } = useQuery({
    queryKey: ['claude-usage-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('claude_usage_logs')
        .select('tokens_used, cost_usd, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      
      const totalTokens = data.reduce((sum, log) => sum + (log.tokens_used || 0), 0);
      const totalCost = data.reduce((sum, log) => sum + (log.cost_usd || 0), 0);
      const requestCount = data.length;
      
      return { totalTokens, totalCost, requestCount };
    },
    enabled: !!claudeSettings?.claude_ai_enabled
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          description: getSettingDescription(key)
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claude-settings'] });
      toast({
        title: "Settings Updated",
        description: "Claude AI settings have been saved successfully.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update Claude AI settings.",
      });
    }
  });

  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('claude-ai', {
        body: {
          prompt: 'Hello, Claude! Please respond with "Connection successful" if you can receive this message.',
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
        description: "Claude AI is responding correctly.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "Failed to connect to Claude AI.",
      });
    }
  });

  const getSettingDescription = (key: string) => {
    const descriptions: Record<string, string> = {
      'claude_ai_enabled': 'Enable Claude AI integration features',
      'claude_api_key': 'Anthropic API key for Claude access',
      'claude_model': 'Claude model version to use',
      'claude_system_prompt': 'System prompt for Claude AI interactions'
    };
    return descriptions[key] || '';
  };

  const handleSave = async (formData: FormData) => {
    const enabled = formData.get('enabled') === 'on';
    const apiKey = formData.get('apiKey') as string;
    const model = formData.get('model') as string;
    const systemPrompt = formData.get('systemPrompt') as string;

    try {
      await Promise.all([
        updateSettingMutation.mutateAsync({ key: 'claude_ai_enabled', value: enabled }),
        updateSettingMutation.mutateAsync({ key: 'claude_api_key', value: apiKey }),
        updateSettingMutation.mutateAsync({ key: 'claude_model', value: model }),
        updateSettingMutation.mutateAsync({ key: 'claude_system_prompt', value: systemPrompt })
      ]);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      await testConnectionMutation.mutateAsync();
    } finally {
      setIsTestingConnection(false);
    }
  };

  const getConnectionStatus = () => {
    if (!claudeSettings?.claude_ai_enabled) {
      return { status: 'disabled', icon: XCircle, color: 'text-gray-500', text: 'Disabled' };
    }
    if (!claudeSettings?.claude_api_key) {
      return { status: 'error', icon: AlertTriangle, color: 'text-red-500', text: 'API Key Missing' };
    }
    return { status: 'ready', icon: CheckCircle, color: 'text-green-500', text: 'Ready' };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Claude AI Settings</CardTitle>
          <CardDescription>Loading settings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const connectionStatus = getConnectionStatus();
  const StatusIcon = connectionStatus.icon;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>Claude AI Configuration</span>
            <Badge variant="outline" className={`ml-auto ${connectionStatus.color}`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {connectionStatus.text}
            </Badge>
          </CardTitle>
          <CardDescription>
            Configure Claude AI integration for enhanced UX analytics insights
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
                  id="enabled"
                  name="enabled"
                  defaultChecked={claudeSettings?.claude_ai_enabled === true}
                  disabled={!isEditing}
                />
                <Label htmlFor="enabled">Enable Claude AI Integration</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">Anthropic API Key</Label>
                <Input
                  id="apiKey"
                  name="apiKey"
                  type="password"
                  placeholder="sk-ant-..."
                  defaultValue={claudeSettings?.claude_api_key || ''}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  Your Anthropic API key for Claude access. Get one at{' '}
                  <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    console.anthropic.com
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Claude Model</Label>
                <Input
                  id="model"
                  name="model"
                  placeholder="claude-3-haiku-20240307"
                  defaultValue={claudeSettings?.claude_model || 'claude-3-haiku-20240307'}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  Claude model version to use. Recommended: claude-3-haiku-20240307 (fast), claude-3-sonnet-20240229 (balanced), claude-3-opus-20240229 (most capable)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  name="systemPrompt"
                  placeholder="You are a UX analytics expert..."
                  defaultValue={claudeSettings?.claude_system_prompt || 'You are a UX analytics expert that provides insights on user behavior and experience patterns. Analyze data and provide actionable recommendations for improving user experience, conversion rates, and engagement.'}
                  disabled={!isEditing}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  System prompt to guide Claude's responses and analysis style
                </p>
              </div>

              <div className="flex space-x-4">
                {!isEditing ? (
                  <>
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Edit Settings</span>
                    </Button>
                    {claudeSettings?.claude_ai_enabled && claudeSettings?.claude_api_key && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={testConnection}
                        disabled={isTestingConnection}
                        className="flex items-center space-x-2"
                      >
                        {isTestingConnection ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span>Testing...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4" />
                            <span>Test Connection</span>
                          </>
                        )}
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      type="submit"
                      disabled={updateSettingMutation.isPending}
                      className="flex items-center space-x-2"
                    >
                      <Zap className="h-4 w-4" />
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

      {usageStats && claudeSettings?.claude_ai_enabled && (
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics (Last 30 Days)</CardTitle>
            <CardDescription>
              Monitor your Claude AI usage and costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{usageStats.requestCount}</div>
                <div className="text-sm text-muted-foreground">API Requests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{usageStats.totalTokens.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Tokens Used</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">${usageStats.totalCost.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Estimated Cost</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
