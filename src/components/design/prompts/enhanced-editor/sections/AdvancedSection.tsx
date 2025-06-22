
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContextualFieldsBuilder } from '../../ContextualFieldsBuilder';

interface AdvancedSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export const AdvancedSection: React.FC<AdvancedSectionProps> = ({
  formData,
  onChange,
  validationErrors
}) => {
  const contextualFields = formData.metadata?.contextual_fields || [];

  const handleContextualFieldsChange = (fields: any) => {
    onChange('metadata', {
      ...formData.metadata,
      contextual_fields: fields
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Advanced Options</h2>
        <p className="text-muted-foreground">
          Advanced template settings and dynamic form configuration
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="is_template">Template Status</Label>
              <p className="text-sm text-muted-foreground">
                Mark this as a reusable template
              </p>
            </div>
            <Switch
              id="is_template"
              checked={formData.is_template || false}
              onCheckedChange={(checked) => onChange('is_template', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="is_active">Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Make this template available to users
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active !== false}
              onCheckedChange={(checked) => onChange('is_active', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dynamic Form Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <ContextualFieldsBuilder
            fields={contextualFields}
            onChange={handleContextualFieldsChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
