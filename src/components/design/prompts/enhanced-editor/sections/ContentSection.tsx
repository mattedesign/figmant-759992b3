
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PromptContentEditor } from '../components/PromptContentEditor';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PROMPT_LIMITS } from '@/constants/promptLimits';

interface ContentSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  formData,
  onChange,
  validationErrors
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Prompt Content</h2>
        <p className="text-muted-foreground">
          Define the main prompt content and example responses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prompt Template</CardTitle>
        </CardHeader>
        <CardContent>
          <PromptContentEditor
            value={formData.original_prompt || ''}
            onChange={(value) => onChange('original_prompt', value)}
            placeholder="Enter your prompt template here. Use {variableName} for dynamic variables."
            maxLength={PROMPT_LIMITS.PROMPT_CONTENT_MAX}
            validationError={validationErrors.original_prompt}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="claude_response">Claude Response Example</Label>
            <Textarea
              id="claude_response"
              value={formData.claude_response || ''}
              onChange={(e) => onChange('claude_response', e.target.value)}
              placeholder="Provide an example of what a good Claude response looks like for this prompt"
              rows={8}
              maxLength={PROMPT_LIMITS.RESPONSE_MAX}
              className={validationErrors.claude_response ? 'border-destructive' : ''}
            />
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                {formData.claude_response?.length || 0} / {PROMPT_LIMITS.RESPONSE_MAX} characters
              </span>
            </div>
            {validationErrors.claude_response && (
              <p className="text-sm text-destructive">{validationErrors.claude_response}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
