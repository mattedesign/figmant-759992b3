
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { StepProps } from '../types';

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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Give us the deets... Please</h2>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          {currentStep} / {totalSteps}
        </Badge>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="desiredOutcome" className="text-base font-medium">
              Desired Outcome
            </Label>
            <Input
              id="desiredOutcome"
              value={stepData.desiredOutcome}
              onChange={(e) => setStepData({ ...stepData, desiredOutcome: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="improvementMetric" className="text-base font-medium">
              Improvement Metric
            </Label>
            <Input
              id="improvementMetric"
              placeholder="$ 5,000"
              value={stepData.improvementMetric}
              onChange={(e) => setStepData({ ...stepData, improvementMetric: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="deadline" className="text-base font-medium">
              Deadline
            </Label>
            <Input
              id="deadline"
              placeholder="e.g Landing page design"
              value={stepData.deadline}
              onChange={(e) => setStepData({ ...stepData, deadline: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="date" className="text-base font-medium">
              Date
            </Label>
            <Input
              id="date"
              placeholder="$ 0"
              value={stepData.date}
              onChange={(e) => setStepData({ ...stepData, date: e.target.value })}
              className="mt-2"
            />
          </div>
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStakeholderRemove(index)}
                className="px-2"
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ))}

          <Button 
            variant="outline" 
            onClick={handleStakeholderAdd}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Stakeholder
          </Button>
        </div>
      </div>
    </div>
  );
};
