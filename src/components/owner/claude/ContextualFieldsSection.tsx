
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { ContextualField } from '@/types/figmant';

interface ContextualFieldsSectionProps {
  contextualFields: ContextualField[];
  onUpdateFields: (fields: ContextualField[]) => void;
}

export const ContextualFieldsSection: React.FC<ContextualFieldsSectionProps> = ({
  contextualFields,
  onUpdateFields
}) => {
  const addNewField = () => {
    const newField: ContextualField = {
      id: `field_${Date.now()}`,
      label: '',
      type: 'text',
      placeholder: '',
      required: false,
      description: ''
    };
    onUpdateFields([...contextualFields, newField]);
  };

  const updateField = (index: number, updates: Partial<ContextualField>) => {
    const updatedFields = contextualFields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    );
    onUpdateFields(updatedFields);
  };

  const removeField = (index: number) => {
    const updatedFields = contextualFields.filter((_, i) => i !== index);
    onUpdateFields(updatedFields);
  };

  const addOption = (fieldIndex: number) => {
    const field = contextualFields[fieldIndex];
    const newOptions = [...(field.options || []), ''];
    updateField(fieldIndex, { options: newOptions });
  };

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const field = contextualFields[fieldIndex];
    const newOptions = (field.options || []).map((option, i) => 
      i === optionIndex ? value : option
    );
    updateField(fieldIndex, { options: newOptions });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = contextualFields[fieldIndex];
    const newOptions = (field.options || []).filter((_, i) => i !== optionIndex);
    updateField(fieldIndex, { options: newOptions });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contextual Fields</CardTitle>
        <CardDescription>
          Configure dynamic form fields that will be shown to users when they select this template
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {contextualFields.map((field, index) => (
          <Card key={field.id} className="border-dashed">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Field {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Field ID</Label>
                  <Input
                    value={field.id}
                    onChange={(e) => updateField(index, { id: e.target.value })}
                    placeholder="field_id"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => updateField(index, { label: e.target.value })}
                    placeholder="Field Label"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Type</Label>
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
                
                <div className="space-y-2">
                  <Label>Placeholder</Label>
                  <Input
                    value={field.placeholder || ''}
                    onChange={(e) => updateField(index, { placeholder: e.target.value })}
                    placeholder="Placeholder text"
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={field.description || ''}
                  onChange={(e) => updateField(index, { description: e.target.value })}
                  placeholder="Field description or help text"
                  rows={2}
                />
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) => updateField(index, { required: e.target.checked })}
                  className="rounded"
                />
                <Label>Required field</Label>
              </div>
              
              {field.type === 'select' && (
                <div className="mt-4">
                  <Label>Options</Label>
                  <div className="space-y-2 mt-2">
                    {(field.options || []).map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index, optionIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(index)}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}
              
              {field.type === 'number' && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Value</Label>
                    <Input
                      type="number"
                      value={field.validation?.min || ''}
                      onChange={(e) => updateField(index, { 
                        validation: { 
                          ...field.validation, 
                          min: e.target.value ? parseInt(e.target.value) : undefined 
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Value</Label>
                    <Input
                      type="number"
                      value={field.validation?.max || ''}
                      onChange={(e) => updateField(index, { 
                        validation: { 
                          ...field.validation, 
                          max: e.target.value ? parseInt(e.target.value) : undefined 
                        }
                      })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        <Button
          variant="outline"
          onClick={addNewField}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contextual Field
        </Button>
      </CardContent>
    </Card>
  );
};
