
import React from 'react';
import { StepProps, StepData, Stakeholder } from '../types';
import { StepHeader } from '../components/StepHeader';
import { FormField } from '../components/FormField';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Step4ProjectDetails: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const handleFieldChange = (field: string, value: any) => {
    if (typeof setStepData === 'function') {
      const funcStr = setStepData.toString();
      if (funcStr.includes('key') || setStepData.length === 2) {
        (setStepData as (key: string, value: any) => void)(field, value);
      } else {
        (setStepData as (newData: StepData) => void)({ ...stepData, [field]: value });
      }
    }
  };

  const addStakeholder = () => {
    const newStakeholder: Stakeholder = {
      name: '',
      role: '',
      title: ''
    };
    const updatedStakeholders = [...(stepData.stakeholders || []), newStakeholder];
    handleFieldChange('stakeholders', updatedStakeholders);
  };

  const removeStakeholder = (index: number) => {
    const updatedStakeholders = (stepData.stakeholders || []).filter((_, i) => i !== index);
    handleFieldChange('stakeholders', updatedStakeholders);
  };

  const updateStakeholder = (index: number, field: keyof Stakeholder, value: string) => {
    const updatedStakeholders = [...(stepData.stakeholders || [])];
    updatedStakeholders[index] = { ...updatedStakeholders[index], [field]: value };
    handleFieldChange('stakeholders', updatedStakeholders);
  };

  const addReferenceLink = () => {
    const updatedLinks = [...(stepData.referenceLinks || []), ''];
    handleFieldChange('referenceLinks', updatedLinks);
  };

  const removeReferenceLink = (index: number) => {
    const updatedLinks = (stepData.referenceLinks || []).filter((_, i) => i !== index);
    handleFieldChange('referenceLinks', updatedLinks);
  };

  const updateReferenceLink = (index: number, value: string) => {
    const updatedLinks = [...(stepData.referenceLinks || [])];
    updatedLinks[index] = value;
    handleFieldChange('referenceLinks', updatedLinks);
  };

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Project Details"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Desired Outcome */}
        <FormField
          id="desiredOutcome"
          type="textarea"
          label="Desired Outcome"
          placeholder="What specific outcome are you hoping to achieve?"
          value={stepData.desiredOutcome || ''}
          onChange={(value) => handleFieldChange('desiredOutcome', value)}
        />

        {/* Improvement Metric */}
        <FormField
          id="improvementMetric"
          type="input"
          label="Key Improvement Metric"
          placeholder="e.g. Increase conversion rate by 15%"
          value={stepData.improvementMetric || ''}
          onChange={(value) => handleFieldChange('improvementMetric', value)}
        />

        {/* Deadline */}
        <FormField
          id="deadline"
          type="input"
          label="Deadline (Optional)"
          placeholder="e.g. End of Q1 2024"
          value={stepData.deadline || ''}
          onChange={(value) => handleFieldChange('deadline', value)}
        />

        {/* Stakeholders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Stakeholders
              <Button onClick={addStakeholder} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Stakeholder
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(stepData.stakeholders || []).map((stakeholder, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <FormField
                  id={`stakeholder-name-${index}`}
                  type="input"
                  label="Name"
                  placeholder="John Doe"
                  value={stakeholder.name}
                  onChange={(value) => updateStakeholder(index, 'name', value)}
                />
                <FormField
                  id={`stakeholder-role-${index}`}
                  type="input"
                  label="Role"
                  placeholder="Product Manager"
                  value={stakeholder.role}
                  onChange={(value) => updateStakeholder(index, 'role', value)}
                />
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removeStakeholder(index)}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Reference Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Reference Links
              <Button onClick={addReferenceLink} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Link
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(stepData.referenceLinks || []).map((link, index) => (
              <div key={index} className="flex gap-2">
                <FormField
                  id={`reference-link-${index}`}
                  type="input"
                  label=""
                  placeholder="https://example.com"
                  value={link}
                  onChange={(value) => updateReferenceLink(index, value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => removeReferenceLink(index)}
                  className="mt-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
