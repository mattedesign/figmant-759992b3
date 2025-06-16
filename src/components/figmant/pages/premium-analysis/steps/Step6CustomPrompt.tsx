
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { StepProps } from '../types';

export const Step6CustomPrompt: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Prompts us...</h2>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          {currentStep} / {totalSteps}
        </Badge>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Label htmlFor="customPrompt" className="text-base font-medium">
            Add Your Custom Prompt
          </Label>
          <Textarea
            id="customPrompt"
            placeholder="e.g. Create a user-friendly mobile app to help people track their daily water intake"
            value={stepData.customPrompt}
            onChange={(e) => setStepData({ ...stepData, customPrompt: e.target.value })}
            className="mt-2 min-h-[200px]"
          />
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Another
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Use Template
          </Button>
        </div>
      </div>
    </div>
  );
};
