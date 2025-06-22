
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

export interface ContextualField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'url' | 'email';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface ContextualFieldsBuilderProps {
  fields: ContextualField[];
  onChange: (fields: ContextualField[]) => void;
}

export const ContextualFieldsBuilder: React.FC<ContextualFieldsBuilderProps> = ({
  fields,
  onChange,
}) => {
  const addField = () => {
    const newField: ContextualField = {
      id: `field_${Date.now()}`,
      label: '',
      type: 'text',
      placeholder: '',
      required: false,
    };
    onChange([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<ContextualField>) => {
    const updatedFields = fields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    );
    onChange(updatedFields);
  };

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    onChange(updatedFields);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Configure dynamic form fields for this template
        </p>
        <Button onClick={addField} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No contextual fields configured. Click "Add Field" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Field {index + 1}</CardTitle>
                  <Button
                    onClick={() => removeField(index)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`label_${index}`}>Label</Label>
                    <Input
                      id={`label_${index}`}
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                      placeholder="Field label"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`type_${index}`}>Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(index, { type: value as ContextualField['type'] })}
                    >
                      <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`placeholder_${index}`}>Placeholder</Label>
                  <Input
                    id={`placeholder_${index}`}
                    value={field.placeholder || ''}
                    onChange={(e) => updateField(index, { placeholder: e.target.value })}
                    placeholder="Field placeholder text"
                  />
                </div>

                {field.type === 'select' && (
                  <div className="space-y-2">
                    <Label htmlFor={`options_${index}`}>Options (one per line)</Label>
                    <Textarea
                      id={`options_${index}`}
                      value={field.options?.join('\n') || ''}
                      onChange={(e) => updateField(index, { 
                        options: e.target.value.split('\n').filter(option => option.trim()) 
                      })}
                      placeholder="Option 1\nOption 2\nOption 3"
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor={`description_${index}`}>Description (optional)</Label>
                  <Textarea
                    id={`description_${index}`}
                    value={field.description || ''}
                    onChange={(e) => updateField(index, { description: e.target.value })}
                    placeholder="Additional help text for this field"
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`required_${index}`}
                    checked={field.required || false}
                    onCheckedChange={(checked) => updateField(index, { required: checked })}
                  />
                  <Label htmlFor={`required_${index}`} className="cursor-pointer">
                    Required field
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
