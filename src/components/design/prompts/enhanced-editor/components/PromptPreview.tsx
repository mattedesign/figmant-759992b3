
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PromptPreviewProps {
  template: any;
}

export const PromptPreview: React.FC<PromptPreviewProps> = ({ template }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Live Preview</h3>
        <p className="text-sm text-muted-foreground mb-4">
          How this template will appear to users
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">
                {template.display_name || template.title || 'Untitled Template'}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{template.category || 'general'}</Badge>
                {template.effectiveness_rating && (
                  <Badge variant="secondary">
                    {template.effectiveness_rating}★
                  </Badge>
                )}
                <Badge>
                  {template.credit_cost || 3} credits
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {template.description || 'No description provided'}
          </p>
          
          <div className="bg-muted/30 p-3 rounded-md">
            <p className="text-sm font-mono whitespace-pre-wrap">
              {template.original_prompt || 'No prompt content yet...'}
            </p>
          </div>

          {template.use_case_context && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Use Case Context</h4>
              <p className="text-sm text-muted-foreground">
                {template.use_case_context}
              </p>
            </div>
          )}

          {template.prompt_variables && Object.keys(template.prompt_variables).length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Variables</h4>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(template.prompt_variables).map(variable => (
                  <Badge key={variable} variant="outline">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
