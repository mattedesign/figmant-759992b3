
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { ContextualField } from '@/types/figmant';

interface ContextualFieldCardProps {
  field: ContextualField;
  index: number;
  onUpdate: (index: number, updatedField: Partial<ContextualField>) => void;
  onRemove: (index: number) => void;
}

export const ContextualFieldCard: React.FC<ContextualFieldCardProps> = ({
  field,
  index,
  onUpdate,
  onRemove
}) => {
  const updateFieldOptions = (optionsText: string) => {
    const options = optionsText.split('\n').filter(option => option.trim());
    onUpdate(index, { options: options.length > 0 ? options : undefined });
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {field.label || field.id} 
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Button
            onClick={() => onRemove(index)}
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor={`field-id-${index}`} className="text-xs">Field ID</Label>
            <Input
              id={`field-id-${index}`}
              value={field.id}
              onChange={(e) => onUpdate(index, { id: e.target.value })}
              placeholder="field_id"
              className="text-sm"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor={`field-label-${index}`} className="text-xs">Label</Label>
            <Input
              id={`field-label-${index}`}
              value={field.label}
              onChange={(e) => onUpdate(index, { label: e.target.value })}
              placeholder="Field Label"
              className="text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor={`field-type-${index}`} className="text-xs">Type</Label>
            <Select
              value={field.type}
              onValueChange={(value) => onUpdate(index, { type: value as any })}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="textarea">Textarea</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id={`field-required-${index}`}
              checked={field.required || false}
              onChange={(e) => onUpdate(index, { required: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor={`field-required-${index}`} className="text-xs">Required</Label>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor={`field-placeholder-${index}`} className="text-xs">Placeholder</Label>
          <Input
            id={`field-placeholder-${index}`}
            value={field.placeholder || ''}
            onChange={(e) => onUpdate(index, { placeholder: e.target.value })}
            placeholder="Placeholder text"
            className="text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor={`field-description-${index}`} className="text-xs">Description</Label>
          <Textarea
            id={`field-description-${index}`}
            value={field.description || ''}
            onChange={(e) => onUpdate(index, { description: e.target.value })}
            placeholder="Field description or help text"
            rows={2}
            className="text-sm"
          />
        </div>

        {field.type === 'select' && (
          <div className="space-y-1">
            <Label htmlFor={`field-options-${index}`} className="text-xs">
              Options (one per line)
            </Label>
            <Textarea
              id={`field-options-${index}`}
              value={field.options?.join('\n') || ''}
              onChange={(e) => updateFieldOptions(e.target.value)}
              placeholder="option1\noption2\noption3"
              rows={3}
              className="text-sm"
            />
          </div>
        )}

        {field.type === 'number' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor={`field-min-${index}`} className="text-xs">Min Value</Label>
              <Input
                id={`field-min-${index}`}
                type="number"
                value={field.validation?.min || ''}
                onChange={(e) => onUpdate(index, { 
                  validation: { 
                    ...field.validation, 
                    min: e.target.value ? parseInt(e.target.value) : undefined 
                  } 
                })}
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`field-max-${index}`} className="text-xs">Max Value</Label>
              <Input
                id={`field-max-${index}`}
                type="number"
                value={field.validation?.max || ''}
                onChange={(e) => onUpdate(index, { 
                  validation: { 
                    ...field.validation, 
                    max: e.target.value ? parseInt(e.target.value) : undefined 
                  } 
                })}
                className="text-sm"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
