import React from 'react';
import { Plus, X } from 'lucide-react';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { FormField } from '../components/FormField';
import { ActionButton } from '../components/ActionButton';

export const Step4ProjectDetails: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const handleStakeholderAdd = () => {
    setStepData({
      ...stepData,
      stakeholders: [...stepData.stakeholders, { name: '', title: '' }]
    });
  };

  const handleStakeholderRemove = (index: number) => {
    const newStakeholders = stepData.stakeholders.filter((_, i) => i !== index);
    setStepData({ ...stepData, stakeholders: newStakeholders });
  };

  const handleStakeholderChange = (index: number, field: 'name' | 'title', value: string) => {
    const newStakeholders = [...stepData.stakeholders];
    newStakeholders[index][field] = value;
    setStepData({ ...stepData, stakeholders: newStakeholders });
  };

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Give us the deets... Please"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="desiredOutcome"
            type="input"
            label="Desired Outcome"
            value={stepData.desiredOutcome}
            onChange={(value) => setStepData({ ...stepData, desiredOutcome: value })}
          />
          <FormField
            id="improvementMetric"
            type="input"
            label="Improvement Metric"
            placeholder="$ 5,000"
            value={stepData.improvementMetric}
            onChange={(value) => setStepData({ ...stepData, improvementMetric: value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="deadline"
            type="input"
            label="Deadline"
            placeholder="e.g Landing page design"
            value={stepData.deadline}
            onChange={(value) => setStepData({ ...stepData, deadline: value })}
          />
          <FormField
            id="date"
            type="input"
            label="Date"
            placeholder="$ 0"
            value={stepData.date}
            onChange={(value) => setStepData({ ...stepData, date: value })}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">Stakeholders</Label>
            <Label className="text-base font-medium">Title & Role</Label>
          </div>
          
          {stepData.stakeholders.map((stakeholder, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <Input
                placeholder="e.g Landing page design"
                value={stakeholder.name}
                onChange={(e) => handleStakeholderChange(index, 'name', e.target.value)}
              />
              <Input
                placeholder="$ 0"
                value={stakeholder.title}
                onChange={(e) => handleStakeholderChange(index, 'title', e.target.value)}
              />
              <ActionButton 
                variant="outline"
                icon={X}
                onClick={() => handleStakeholderRemove(index)}
                className="px-2"
              >
                Remove
              </ActionButton>
            </div>
          ))}

          <ActionButton 
            icon={Plus}
            onClick={handleStakeholderAdd}
            className="mt-2"
          >
            Add Another Stakeholder
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
