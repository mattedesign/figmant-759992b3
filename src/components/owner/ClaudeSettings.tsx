
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bot } from 'lucide-react';
import { ClaudeFormData } from '@/types/claude';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_MODEL, validateApiKey } from '@/constants/claude';
import { useClaudeSettings } from '@/hooks/useClaudeSettings';
import { useClaudeUsageStats } from '@/hooks/useClaudeUsageStats';
import { useClaudeMutations } from '@/hooks/useClaudeMutations';
import { getConnectionStatus } from '@/utils/claudeStatus';
import { ClaudeConfigurationForm } from './claude/ClaudeConfigurationForm';
import { ClaudeActionButtons } from './claude/ClaudeActionButtons';
import { ClaudeUsageStatsCard } from './claude/ClaudeUsageStatsCard';

export const ClaudeSettings = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [formData, setFormData] = useState<ClaudeFormData>({
    enabled: false,
    apiKey: '',
    model: DEFAULT_MODEL,
    systemPrompt: DEFAULT_SYSTEM_PROMPT
  });

  const { data: claudeSettings, isLoading } = useClaudeSettings();
  const { data: usageStats } = useClaudeUsageStats(!!claudeSettings?.claude_ai_enabled);
  const { updateSettingMutation, testConnectionMutation } = useClaudeMutations();

  useEffect(() => {
    if (claudeSettings) {
      setFormData({
        enabled: claudeSettings.claude_ai_enabled === true,
        apiKey: claudeSettings.claude_api_key || '',
        model: claudeSettings.claude_model || DEFAULT_MODEL,
        systemPrompt: claudeSettings.claude_system_prompt || DEFAULT_SYSTEM_PROMPT
      });
    }
  }, [claudeSettings]);

  const handleSave = async () => {
    try {
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

  const handleCancel = () => {
    setIsEditing(false);
    if (claudeSettings) {
      setFormData({
        enabled: claudeSettings.claude_ai_enabled === true,
        apiKey: claudeSettings.claude_api_key || '',
        model: claudeSettings.claude_model || DEFAULT_MODEL,
        systemPrompt: claudeSettings.claude_system_prompt || DEFAULT_SYSTEM_PROMPT
      });
    }
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

  const connectionStatus = getConnectionStatus(formData.enabled, formData.apiKey);
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
          <ClaudeConfigurationForm
            formData={formData}
            isEditing={isEditing}
            onFormDataChange={setFormData}
          />
          
          <div className="mt-6">
            <ClaudeActionButtons
              isEditing={isEditing}
              formData={formData}
              isTestingConnection={isTestingConnection}
              isSaving={updateSettingMutation.isPending}
              onEditClick={() => setIsEditing(true)}
              onTestConnection={testConnection}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </CardContent>
      </Card>

      {usageStats && formData.enabled && (
        <ClaudeUsageStatsCard usageStats={usageStats} />
      )}
    </div>
  );
};
