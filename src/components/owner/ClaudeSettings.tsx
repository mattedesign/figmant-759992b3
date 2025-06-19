
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, TestTube } from 'lucide-react';
import { useClaudeSettings } from '@/hooks/useClaudeSettings';
import { useClaudeMutations } from '@/hooks/useClaudeMutations';
import { useState } from 'react';
import { CLAUDE_MODELS } from '@/constants/claude';

export const ClaudeSettings = () => {
  const { data: settings, isLoading } = useClaudeSettings();
  const { updateSettingMutation, testConnectionMutation } = useClaudeMutations();
  const [formData, setFormData] = useState({
    enabled: settings?.claude_ai_enabled || false,
    apiKey: settings?.claude_api_key || '',
    model: settings?.claude_model || CLAUDE_MODELS[0].id,
    systemPrompt: settings?.claude_system_prompt || ''
  });

  // Update form data when settings change
  React.useEffect(() => {
    if (settings) {
      setFormData({
        enabled: settings.claude_ai_enabled || false,
        apiKey: settings.claude_api_key || '',
        model: settings.claude_model || CLAUDE_MODELS[0].id,
        systemPrompt: settings.claude_system_prompt || ''
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettingMutation.mutateAsync({
        key: 'claude_ai_enabled',
        value: formData.enabled,
        description: 'Enable or disable Claude AI integration'
      });

      if (formData.apiKey) {
        await updateSettingMutation.mutateAsync({
          key: 'claude_api_key',
          value: formData.apiKey,
          description: 'Claude API key for authentication'
        });
      }

      await updateSettingMutation.mutateAsync({
        key: 'claude_model',
        value: formData.model,
        description: 'Claude model to use for analysis'
      });

      if (formData.systemPrompt) {
        await updateSettingMutation.mutateAsync({
          key: 'claude_system_prompt',
          value: formData.systemPrompt,
          description: 'System prompt for Claude AI'
        });
      }
    } catch (error) {
      console.error('Failed to save Claude settings:', error);
    }
  };

  const handleTestConnection = () => {
    testConnectionMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>Claude AI Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure Claude AI integration for design analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="claude-enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
            />
            <Label htmlFor="claude-enabled">Enable Claude AI</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-ant-..."
              value={formData.apiKey}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={formData.model}
              onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Claude model" />
              </SelectTrigger>
              <SelectContent>
                {CLAUDE_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              placeholder="Enter system prompt for Claude AI..."
              value={formData.systemPrompt}
              onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleSave}
              disabled={updateSettingMutation.isPending}
            >
              {updateSettingMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={testConnectionMutation.isPending || !formData.enabled}
            >
              <TestTube className="h-4 w-4 mr-2" />
              {testConnectionMutation.isPending ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
