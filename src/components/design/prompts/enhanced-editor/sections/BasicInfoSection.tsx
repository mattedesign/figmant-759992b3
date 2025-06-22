
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BasicInfoSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  onChange,
  validationErrors
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
        <p className="text-muted-foreground">
          Essential template information and metadata
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => onChange('title', e.target.value)}
                placeholder="Enter template title"
                className={validationErrors.title ? 'border-destructive' : ''}
              />
              {validationErrors.title && (
                <p className="text-sm text-destructive">{validationErrors.title}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name || ''}
                onChange={(e) => onChange('display_name', e.target.value)}
                placeholder="Human-readable name"
                className={validationErrors.display_name ? 'border-destructive' : ''}
              />
              {validationErrors.display_name && (
                <p className="text-sm text-destructive">{validationErrors.display_name}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Describe what this template does and when to use it"
              rows={3}
              className={validationErrors.description ? 'border-destructive' : ''}
            />
            {validationErrors.description && (
              <p className="text-sm text-destructive">{validationErrors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
