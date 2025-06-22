import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContextSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export const ContextSection: React.FC<ContextSectionProps> = ({
  formData,
  onChange,
  validationErrors
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Context & Usage</h2>
        <p className="text-muted-foreground">
          Define when and how this template should be used
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="use_case_context">Use Case Context</Label>
            <Textarea
              id="use_case_context"
              value={formData.use_case_context || ''}
              onChange={(e) => onChange('use_case_context', e.target.value)}
              placeholder="Describe specific scenarios where this template is most effective"
              rows={4}
              className={validationErrors.use_case_context ? 'border-destructive' : ''}
            />
            {validationErrors.use_case_context && (
              <p className="text-sm text-destructive">{validationErrors.use_case_context}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="prompt_variables">Variable Definitions (JSON)</Label>
            <Textarea
              id="prompt_variables"
              value={formData.prompt_variables ? JSON.stringify(formData.prompt_variables, null, 2) : '{}'}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  onChange('prompt_variables', parsed);
                } catch {
                  // Keep the raw value for now
                }
              }}
              placeholder='{\n  "INDUSTRY": "Target industry or vertical",\n  "TARGET_AUDIENCE": "Primary user demographic"\n}'
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Define variables that can be used in the prompt template. Use JSON format with variable names as keys and descriptions as values.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
