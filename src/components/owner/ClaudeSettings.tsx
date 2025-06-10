
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bot, Settings, Zap, CheckCircle, XCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const CLAUDE_MODELS = [
  { value: 'claude-opus-4-20250514', label: 'Claude 4 Opus (Most Capable)', recommended: true },
  { value: 'claude-sonnet-4-20250514', label: 'Claude 4 Sonnet (Balanced)', recommended: true },
  { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (Fast)', recommended: true },
  { value: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet (Extended)' },
  { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (Legacy)' },
  { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus (Legacy)' },
  { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Legacy)' }
];

export const ClaudeSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    enabled: false,
    apiKey: '',
    model: 'claude-3-5-haiku-20241022',
    systemPrompt: 'You are a UX analytics expert that provides insights on user behavior and experience patterns. Analyze data and provide actionable recommendations for improving user experience, conversion rates, and engagement.'
  });

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
        // Handle both old format (direct value) and new format (JSON with value property)
        if (setting.setting_value && typeof setting.setting_value === 'object' && setting.setting_value.value !== undefined) {
          settings[setting.setting_key] = setting.setting_value.value;
        } else {
          settings[setting.setting_key] = setting.setting_value;
        }
      });
      
      // Update form data when settings are loaded
      setFormData({
        enabled: settings.claude_ai_enabled === true,
        apiKey: settings.claude_api_key || '',
        model: settings.claude_model || 'claude-3-5-haiku-20241022',
        systemPrompt: settings.claude_system_prompt || 'You are a UX analytics expert that provides insights on user behavior and experience patterns. Analyze data and provide actionable recommendations for improving user experience, conversion rates, and engagement.'
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
        .select('tokens_used, cost_usd, created_at, success')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      
      const totalTokens = data.reduce((sum, log) => sum + (log.tokens_used || 0), 0);
      const totalCost = data.reduce((sum, log) => sum + (log.cost_usd || 0), 0);
      const requestCount = data.length;
      const successfulRequests = data.filter(log => log.success).length;
      const errorRate = requestCount > 0 ? ((requestCount - successfulRequests) / requestCount * 100).toFixed(1) : '0';
      
      return { totalTokens, totalCost, requestCount, successfulRequests, errorRate };
    },
    enabled: !!claudeSettings?.claude_ai_enabled
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

  const validateApiKey = (key: string): boolean => {
    return key.length >= 20 && key.startsWith('sk-ant-');
  };

  const handleSave = async () => {
    try {
      // Validate form data before saving
      if (formData.enabled && !validateApiKey(formData.apiKey)) {
        toast({
          variant: "destructive",
          title: "Invalid API Key",
          description: "API key must start with 'sk-ant-' and be at least 20 characters long.",
        });
        return;
      }

      if (formData.systemPrompt.length > 2000) {
        toast({
          variant: "destructive", 
          title: "System Prompt Too Long",
          description: "Please keep the system prompt under 2000 characters.",
        });
        return;
      }

      // Save all settings
      await Promise.all([
        updateSettingMutation.mutateAsync({ 
          key: 'claude_ai_enabled', 
          value: formData.enabled,
          description: 'Enable Claude AI integration features'
        }),
        updateSettingMutation.mutateAsync({ 
          key: 'claude_api_key', 
          value: formData.apiKey,
          description: 'Anthropic API key for Claude access'
        }),
        updateSettingMutation.mutateAsync({ 
          key: 'claude_model', 
          value: formData.model,
          description: 'Claude model version to use'
        }),
        updateSettingMutation.mutateAsync({ 
          key: 'claude_system_prompt', 
          value: formData.systemPrompt,
          description: 'System prompt for Claude AI interactions'
        })
      ]);

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const testConnection = async () => {
    if (!formData.enabled) {
      toast({
        variant: "destructive",
        title: "Claude AI Disabled",
        description: "Please enable Claude AI before testing the connection.",
      });
      return;
    }

    if (!validateApiKey(formData.apiKey)) {
      toast({
        variant: "destructive", 
        title: "Invalid API Key",
        description: "Please enter a valid API key before testing.",
      });
      return;
    }

    setIsTestingConnection(true);
    try {
      await testConnectionMutation.mutateAsync();
    } finally {
      setIsTestingConnection(false);
    }
  };

  const getConnectionStatus = () => {
    if (!formData.enabled) {
      return { status: 'disabled', icon: XCircle, color: 'text-gray-500', text: 'Disabled' };
    }
    if (!validateApiKey(formData.apiKey)) {
      return { status: 'error', icon: AlertTriangle, color: 'text-red-500', text: 'API Key Invalid' };
    }
    return { status: 'ready', icon: CheckCircle, color: 'text-green-500', text: 'Ready' };
  };

  const maskApiKey = (key: string) => {
    if (!key || key.length < 8) return key;
    return key.substring(0, 8) + '•'.repeat(Math.min(key.length - 8, 20));
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
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch 
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
                disabled={!isEditing}
              />
              <Label htmlFor="enabled">Enable Claude AI Integration</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">Anthropic API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  placeholder="sk-ant-..."
                  value={isEditing ? formData.apiKey : maskApiKey(formData.apiKey)}
                  onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                  disabled={!isEditing}
                  className={!validateApiKey(formData.apiKey) && formData.apiKey ? "border-red-500" : ""}
                />
                {isEditing && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Your Anthropic API key for Claude access. Get one at{' '}
                <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  console.anthropic.com
                </a>
              </p>
              {!validateApiKey(formData.apiKey) && formData.apiKey && (
                <p className="text-xs text-red-600">
                  API key must start with 'sk-ant-' and be at least 20 characters long
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Claude Model</Label>
              {isEditing ? (
                <Select
                  value={formData.model}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLAUDE_MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div className="flex items-center space-x-2">
                          <span>{model.label}</span>
                          {model.recommended && (
                            <Badge variant="secondary" className="text-xs">Recommended</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={CLAUDE_MODELS.find(m => m.value === formData.model)?.label || formData.model}
                  disabled
                />
              )}
              <p className="text-xs text-muted-foreground">
                Claude model to use. Claude 4 models offer the best performance and latest capabilities.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                placeholder="You are a UX analytics expert..."
                value={formData.systemPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                disabled={!isEditing}
                rows={4}
                className={formData.systemPrompt.length > 2000 ? "border-red-500" : ""}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>System prompt to guide Claude's responses and analysis style</span>
                <span className={formData.systemPrompt.length > 2000 ? "text-red-600" : ""}>
                  {formData.systemPrompt.length}/2000
                </span>
              </div>
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
                  {formData.enabled && validateApiKey(formData.apiKey) && (
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
                    type="button"
                    onClick={handleSave}
                    disabled={updateSettingMutation.isPending}
                    className="flex items-center space-x-2"
                  >
                    {updateSettingMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form data to current settings
                      setFormData({
                        enabled: claudeSettings?.claude_ai_enabled === true,
                        apiKey: claudeSettings?.claude_api_key || '',
                        model: claudeSettings?.claude_model || 'claude-3-5-haiku-20241022',
                        systemPrompt: claudeSettings?.claude_system_prompt || 'You are a UX analytics expert that provides insights on user behavior and experience patterns. Analyze data and provide actionable recommendations for improving user experience, conversion rates, and engagement.'
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

      {usageStats && formData.enabled && (
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics (Last 30 Days)</CardTitle>
            <CardDescription>
              Monitor your Claude AI usage, costs, and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{usageStats.requestCount}</div>
                <div className="text-sm text-muted-foreground">Total Requests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{usageStats.successfulRequests}</div>
                <div className="text-sm text-muted-foreground">Successful</div>
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
            {usageStats.requestCount > 0 && (
              <div className="mt-4 text-center">
                <Badge variant={parseFloat(usageStats.errorRate) < 5 ? "success" : "destructive"}>
                  {usageStats.errorRate}% Error Rate
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
