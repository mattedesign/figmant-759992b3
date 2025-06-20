
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { ContextualField } from '@/types/figmant';

interface ContextualFieldsSectionProps {
  contextualFields: ContextualField[];
  onUpdateFields: (fields: ContextualField[]) => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' }
];

export const ContextualFieldsSection: React.FC<ContextualFieldsSectionProps> = ({
  contextualFields,
  onUpdateFields
}) => {
  const addField = () => {
    const newField: ContextualField = {
      id: `field_${Date.now()}`,
      label: '',
      type: 'text',
      required: false
    };
    onUpdateFields([...contextualFields, newField]);
  };

  const updateField = (index: number, updatedField: Partial<ContextualField>) => {
    const updatedFields = contextualFields.map((field, i) => 
      i === index ? { ...field, ...updatedField } : field
    );
    onUpdateFields(updatedFields);
  };

  const removeField = (index: number) => {
    const updatedFields = contextualFields.filter((_, i) => i !== index);
    onUpdateFields(updatedFields);
  };

  const updateFieldOptions = (index: number, optionsText: string) => {
    const options = optionsText.split('\n').filter(option => option.trim());
    updateField(index, { options: options.length > 0 ? options : undefined });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Contextual Fields</CardTitle>
          <Button onClick={addField} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Field
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {contextualFields.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No contextual fields defined. Add fields to collect specific context for this prompt template.
          </p>
        ) : (
          contextualFields.map((field, index) => (
            <Card key={field.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Field #{index + 1}</Label>
                  <Button
                    onClick={() => removeField(index)}
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
                      onChange={(e) => updateField(index, { id: e.target.value })}
                      placeholder="field_id"
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`field-label-${index}`} className="text-xs">Label</Label>
                    <Input
                      id={`field-label-${index}`}
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
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
                      onValueChange={(value) => updateField(index, { type: value as any })}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id={`field-required-${index}`}
                      checked={field.required || false}
                      onChange={(e) => updateField(index, { required: e.target.checked })}
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
                    onChange={(e) => updateField(index, { placeholder: e.target.value })}
                    placeholder="Placeholder text"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`field-description-${index}`} className="text-xs">Description</Label>
                  <Textarea
                    id={`field-description-${index}`}
                    value={field.description || ''}
                    onChange={(e) => updateField(index, { description: e.target.value })}
                    placeholder="Field description or help text"
                    rows={2}
                    className="text-sm"
                  />
                </div>

                {field.type === 'select' && (
                  <div className="space-y-1">
                    <Label htmlFor={`field-options-${index}`} className="text-xs">Options (one per line)</Label>
                    <Textarea
                      id={`field-options-${index}`}
                      value={field.options?.join('\n') || ''}
                      onChange={(e) => updateFieldOptions(index, e.target.value)}
                      placeholder="Option 1\nOption 2\nOption 3"
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
                        onChange={(e) => updateField(index, { 
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
                        onChange={(e) => updateField(index, { 
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
          ))
        )}
      </CardContent>
    </Card>
  );
};
