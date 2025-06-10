
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';
import { ClaudeFormData } from '@/types/claude';
import { CLAUDE_MODELS, validateApiKey, maskApiKey } from '@/constants/claude';

interface ClaudeConfigurationFormProps {
  formData: ClaudeFormData;
  isEditing: boolean;
  onFormDataChange: (data: ClaudeFormData) => void;
}

export const ClaudeConfigurationForm = ({ formData, isEditing, onFormDataChange }: ClaudeConfigurationFormProps) => {
  const [showApiKey, setShowApiKey] = useState(false);

  const handleFormChange = (field: keyof ClaudeFormData, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch 
          id="enabled"
          checked={formData.enabled}
          onCheckedChange={(checked) => handleFormChange('enabled', checked)}
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
            onChange={(e) => handleFormChange('apiKey', e.target.value)}
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
            onValueChange={(value) => handleFormChange('model', value)}
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
          onChange={(e) => handleFormChange('systemPrompt', e.target.value)}
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
    </div>
  );
};
