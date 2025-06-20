
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

const PREDEFINED_FIELDS = [
  {
    id: 'project_type',
    label: 'Project Type',
    type: 'select' as const,
    options: ['landing_page', 'product_page', 'ecommerce_site', 'saas_homepage', 'mobile_app', 'other'],
    required: true
  },
  {
    id: 'business_goal',
    label: 'Business Goal',
    type: 'select' as const,
    options: ['increase_conversions', 'improve_engagement', 'generate_leads', 'boost_sales', 'reduce_bounce', 'other'],
    required: true
  },
  {
    id: 'target_metric',
    label: 'Target Metric',
    type: 'text' as const,
    placeholder: 'e.g., "Increase demo requests by 25%"',
    description: 'Describe your specific target metric',
    required: false
  },
  {
    id: 'industry',
    label: 'Industry',
    type: 'select' as const,
    options: ['saas', 'ecommerce', 'finance', 'healthcare', 'education', 'real_estate', 'other'],
    required: true
  },
  {
    id: 'target_audience',
    label: 'Target Audience',
    type: 'select' as const,
    options: ['b2b_decision_makers', 'consumers', 'small_business', 'enterprise', 'creative_professionals', 'other'],
    required: true
  },
  {
    id: 'competitor_urls',
    label: 'Competitor URLs',
    type: 'textarea' as const,
    placeholder: 'Enter 3-5 URLs with reasons (one per line)',
    description: 'List competitor URLs with brief explanations',
    required: false
  },
  {
    id: 'design_challenge',
    label: 'Design Challenge',
    type: 'textarea' as const,
    placeholder: 'What specific aspect needs improvement?',
    description: 'Describe the main design challenge you want to address',
    required: false
  },
  {
    id: 'design_upload',
    label: 'Design Upload Type',
    type: 'select' as const,
    options: ['figma_link', 'image_upload', 'live_url', 'sketch_file'],
    required: false
  },
  {
    id: 'focus_elements',
    label: 'Focus Elements',
    type: 'select' as const,
    options: ['header', 'hero', 'cta_buttons', 'trust_signals', 'mobile', 'forms', 'pricing', 'all'],
    description: 'Which elements should we focus on?',
    required: false
  },
  {
    id: 'success_measurement',
    label: 'Success Measurement',
    type: 'select' as const,
    options: ['conversion_rate', 'engagement', 'ab_test', 'stakeholder_approval', 'implementation'],
    required: false
  },
  {
    id: 'implementation_timeline',
    label: 'Implementation Timeline',
    type: 'select' as const,
    options: ['this_week', 'two_weeks', 'month', 'planning_only'],
    required: false
  }
];

export const ContextualFieldsSection: React.FC<ContextualFieldsSectionProps> = ({
  contextualFields,
  onUpdateFields
}) => {
  const addPredefinedField = (predefinedField: typeof PREDEFINED_FIELDS[0]) => {
    // Check if field already exists
    if (contextualFields.some(field => field.id === predefinedField.id)) {
      return;
    }

    const newField: ContextualField = {
      ...predefinedField
    };
    onUpdateFields([...contextualFields, newField]);
  };

  const addCustomField = () => {
    const newField: ContextualField = {
      id: `custom_field_${Date.now()}`,
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

  const availablePredefinedFields = PREDEFINED_FIELDS.filter(
    predefined => !contextualFields.some(field => field.id === predefined.id)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Contextual Fields</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Add fields to collect specific context for this prompt template
            </p>
          </div>
          <div className="flex gap-2">
            {availablePredefinedFields.length > 0 && (
              <Select onValueChange={(value) => {
                const predefined = PREDEFINED_FIELDS.find(f => f.id === value);
                if (predefined) addPredefinedField(predefined);
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Add predefined field" />
                </SelectTrigger>
                <SelectContent>
                  {availablePredefinedFields.map(field => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button onClick={addCustomField} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Custom Field
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {contextualFields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No contextual fields defined.</p>
            <p className="text-sm">Use the buttons above to add predefined or custom fields.</p>
          </div>
        ) : (
          contextualFields.map((field, index) => (
            <Card key={field.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    {field.label || field.id} 
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
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
                    <Label htmlFor={`field-options-${index}`} className="text-xs">
                      Options (one per line)
                    </Label>
                    <Textarea
                      id={`field-options-${index}`}
                      value={field.options?.join('\n') || ''}
                      onChange={(e) => updateFieldOptions(index, e.target.value)}
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
