
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { analysisTypes } from '../analysisTypes';

export const Step1SelectAnalysisType: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const handleTypeSelection = (typeId: string) => {
    setStepData({ ...stepData, selectedType: typeId });
  };

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Analyze this..."
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analysisTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all duration-200 ${
              stepData.selectedType === type.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
            }`}
            onClick={() => handleTypeSelection(type.id)}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center ${
                stepData.selectedType === type.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <type.icon className="h-6 w-6" />
              </div>
              <h3 className="font-medium">{type.title}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
