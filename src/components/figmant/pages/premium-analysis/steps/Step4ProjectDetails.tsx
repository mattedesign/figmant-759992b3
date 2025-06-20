
import React from 'react';
import { StepProps } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTemplateSelection } from '../hooks/useTemplateSelection';
import { ContextualFieldRenderer } from '../components/ContextualFieldRenderer';

export const Step4ProjectDetails: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const { selectedTemplate } = useTemplateSelection(stepData.selectedType);

  const handleContextualFieldChange = (fieldId: string, value: any) => {
    setStepData(prev => ({ 
      ...prev, 
      contextualData: {
        ...prev.contextualData,
        [fieldId]: value
      }
    }));
  };

  // If no template is selected or no contextual fields, show a message
  if (!selectedTemplate) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center p-0">
            <p className="text-muted-foreground">
              Please select an analysis template first to configure project details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedTemplate.contextual_fields || selectedTemplate.contextual_fields.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="p-0">
            <CardTitle>{selectedTemplate.displayName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              This template doesn't require additional configuration details.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-muted-foreground">
              You can proceed to the next step to upload your files for analysis.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="p-0">
          <CardTitle>{selectedTemplate.displayName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {selectedTemplate.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          {selectedTemplate.contextual_fields.map((field) => (
            <ContextualFieldRenderer
              key={field.id}
              field={field}
              value={stepData.contextualData?.[field.id] || ''}
              onChange={(value) => handleContextualFieldChange(field.id, value)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
