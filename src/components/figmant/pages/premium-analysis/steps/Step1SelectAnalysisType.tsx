
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StepProps } from '../types';
import { analysisTypes } from '../analysisTypes';

export const Step1SelectAnalysisType: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Analyze this...</h2>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          {currentStep} / {totalSteps}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analysisTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all duration-200 ${
              stepData.selectedType === type.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
            }`}
            onClick={() => setStepData({ ...stepData, selectedType: type.id })}
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
