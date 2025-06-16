import React from 'react';
import { Upload, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { ActionButton } from '../components/ActionButton';

export const Step5UploadFiles: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const handleReferenceLinkAdd = () => {
    setStepData({
      ...stepData,
      referenceLinks: [...stepData.referenceLinks, '']
    });
  };

  const handleReferenceLinkChange = (index: number, value: string) => {
    const newLinks = [...stepData.referenceLinks];
    newLinks[index] = value;
    setStepData({ ...stepData, referenceLinks: newLinks });
  };

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Upload or share some links"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* File Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Drag and drop images, or <span className="text-blue-600 font-medium cursor-pointer">Browse</span></p>
        </div>

        {/* Reference Links Section */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Reference link</Label>
          {stepData.referenceLinks.map((link, index) => (
            <div key={index} className="space-y-2">
              <Input
                placeholder="Enter your URL"
                value={link}
                onChange={(e) => handleReferenceLinkChange(index, e.target.value)}
              />
            </div>
          ))}
          <ActionButton 
            icon={Plus}
            onClick={handleReferenceLinkAdd}
            className="mt-2"
          >
            Add link
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
