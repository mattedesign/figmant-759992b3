
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

  return (
    <div className="w-full min-h-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Project Details</h2>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {/* If no template is selected, show a message */}
        {!selectedTemplate ? (
          <Card>
            <CardHeader>
              <CardTitle>No Template Selected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Please select an analysis template first to configure project details.
              </p>
            </CardContent>
          </Card>
        ) : !selectedTemplate.contextual_fields || selectedTemplate.contextual_fields.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Ready to Proceed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This template doesn't require additional configuration. You can proceed to upload your files for analysis.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Configure {selectedTemplate.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Please provide the following information to customize your analysis:
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
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
        )}
      </div>
    </div>
  );
};
