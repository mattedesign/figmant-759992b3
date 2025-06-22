
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTemplateSelection } from '../hooks/useTemplateSelection';
import { ContextualFieldRenderer } from '../components/ContextualFieldRenderer';
import { StepProps } from '../types';

export const Step3ContextualFields: React.FC<StepProps> = ({
  stepData,
  setStepData,
  currentStep,
  totalSteps,
  onNextStep,
  onPreviousStep
}) => {
  const { selectedTemplate } = useTemplateSelection(stepData.selectedType);
  const [contextualData, setContextualData] = useState(stepData.contextualData || {});
  const [additionalContext, setAdditionalContext] = useState('');

  useEffect(() => {
    // Initialize additional context from stepData if available
    if (stepData.analysisGoals) {
      setAdditionalContext(stepData.analysisGoals);
    }
  }, [stepData.analysisGoals]);

  const handleFieldChange = (fieldId: string, value: any) => {
    const newData = { ...contextualData, [fieldId]: value };
    setContextualData(newData);
    setStepData(prev => ({ 
      ...prev, 
      contextualData: newData 
    }));
  };

  const handleAdditionalContextChange = (value: string) => {
    setAdditionalContext(value);
    setStepData(prev => ({ 
      ...prev, 
      analysisGoals: value 
    }));
  };

  const renderField = (field: any) => {
    const value = contextualData[field.id] || '';
    
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            required={field.required}
          />
        );
      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handleFieldChange(field.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            type={field.type || 'text'}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

  const hasRequiredFields = () => {
    if (!selectedTemplate?.contextual_fields) return true;
    
    return selectedTemplate.contextual_fields.every((field: any) => {
      if (!field.required) return true;
      const value = contextualData[field.id];
      return value && value.toString().trim() !== '';
    });
  };

  const canProceed = hasRequiredFields();

  return (
    <div className="w-full min-h-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Configure Your Analysis</h2>
        <p className="text-center text-gray-600 mb-8">
          Provide context specific to your {selectedTemplate?.title || 'analysis'}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Template-Specific Fields */}
        {selectedTemplate?.contextual_fields && selectedTemplate.contextual_fields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTemplate.contextual_fields.map((field: any) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="flex items-center gap-2">
                    {field.label}
                    {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </Label>
                  {field.description && (
                    <p className="text-sm text-gray-500">{field.description}</p>
                  )}
                  <ContextualFieldRenderer
                    field={field}
                    value={contextualData[field.id] || ''}
                    onChange={(value) => handleFieldChange(field.id, value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Additional Context */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Context</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={additionalContext}
              onChange={(e) => handleAdditionalContextChange(e.target.value)}
              placeholder="Add any additional context, specific requirements, or instructions for your analysis..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Content Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Template:</strong> {selectedTemplate?.title}</p>
              <p><strong>Credit Cost:</strong> {selectedTemplate?.credit_cost || 3} credits</p>
              <p><strong>Uploaded Files:</strong> {stepData.uploadedFiles?.length || 0} files</p>
              <p><strong>URLs:</strong> {stepData.referenceLinks?.filter(url => url.trim()).length || 0} URLs</p>
              <p><strong>Configuration Fields:</strong> {Object.keys(contextualData).length} filled</p>
            </div>
          </CardContent>
        </Card>

        {/* Required Fields Warning */}
        {!canProceed && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <p className="text-orange-800 text-sm">
                Please fill in all required fields before proceeding.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPreviousStep}>
            Previous
          </Button>
          <Button onClick={onNextStep} disabled={!canProceed}>
            Start Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};
