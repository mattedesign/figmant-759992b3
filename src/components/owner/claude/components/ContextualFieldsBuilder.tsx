
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { ContextualField } from '@/types/figmant';

interface ContextualFieldsBuilderProps {
  fields: ContextualField[];
  onChange: (fields: ContextualField[]) => void;
}

export const ContextualFieldsBuilder: React.FC<ContextualFieldsBuilderProps> = ({
  fields,
  onChange
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

  const addOption = (fieldIndex: number) => {
    const field = fields[fieldIndex];
    const newOptions = [...(field.options || []), ''];
    updateField(fieldIndex, { options: newOptions });
  };

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const field = fields[fieldIndex];
    const newOptions = (field.options || []).map((option, i) => 
      i === optionIndex ? value : option
    );
    updateField(fieldIndex, { options: newOptions });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = fields[fieldIndex];
    const newOptions = (field.options || []).filter((_, i) => i !== optionIndex);
    updateField(fieldIndex, { options: newOptions });
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id} className="border-dashed border-2 hover:border-blue-300 transition-colors">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <CardTitle className="text-base">Field {index + 1}</CardTitle>
                {field.required && (
                  <span className="text-red-500 text-sm font-medium">Required</span>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeField(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Field ID</Label>
                <Input
                  value={field.id}
                  onChange={(e) => updateField(index, { id: e.target.value })}
                  placeholder="field_id"
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Label *</Label>
                <Input
                  value={field.label}
                  onChange={(e) => updateField(index, { label: e.target.value })}
                  placeholder="Field Label"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Field Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(value) => updateField(index, { type: value as ContextualField['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Input</SelectItem>
                    <SelectItem value="textarea">Text Area</SelectItem>
                    <SelectItem value="select">Dropdown Select</SelectItem>
                    <SelectItem value="number">Number Input</SelectItem>
                    <SelectItem value="date">Date Picker</SelectItem>
                    <SelectItem value="url">URL Input</SelectItem>
                    <SelectItem value="email">Email Input</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Placeholder Text</Label>
                <Input
                  value={field.placeholder || ''}
                  onChange={(e) => updateField(index, { placeholder: e.target.value })}
                  placeholder="Enter placeholder text..."
                />
              </div>
              
              <div className="flex items-center justify-between pt-6">
                <Label>Required Field</Label>
                <Switch
                  checked={field.required || false}
                  onCheckedChange={(checked) => updateField(index, { required: checked })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description / Help Text</Label>
              <Textarea
                value={field.description || ''}
                onChange={(e) => updateField(index, { description: e.target.value })}
                placeholder="Provide helpful instructions for this field..."
                rows={2}
              />
            </div>
            
            {field.type === 'select' && (
              <div className="space-y-3">
                <Label>Dropdown Options</Label>
                <div className="space-y-2">
                  {(field.options || []).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index, optionIndex)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(index)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}
            
            {field.type === 'number' && (
              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="Min"
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
                    placeholder="Max"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={addNewField}
            className="w-full h-16 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Dynamic Field
          </Button>
        </CardContent>
      </Card>

      {fields.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <CardDescription className="text-sm">
            <strong>Template Features:</strong>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• Dynamic form fields for user customization</li>
              <li>• Context-aware analysis prompts</li>
              <li>• Performance tracking and optimization</li>
              <li>• Credit-based usage monitoring</li>
            </ul>
          </CardDescription>
        </div>
      )}
    </div>
  );
};
