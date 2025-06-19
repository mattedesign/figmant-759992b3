
import React from 'react';
import { StepHeader } from '../components/StepHeader';
import { FormField } from '../components/FormField';
import { analysisTypes } from '../analysisTypes';
import { StepData } from '../types';

interface Step1SelectAnalysisTypeProps {
  stepData: StepData;
  setStepData: (data: StepData | ((prev: StepData) => StepData)) => void;
}

export const Step1SelectAnalysisType: React.FC<Step1SelectAnalysisTypeProps> = ({
  stepData,
  setStepData
}) => {
  const handleSelectionChange = (value: string) => {
    setStepData(prev => ({
      ...prev,
      selectedType: value
    }));
  };

  return (
    <div className="space-y-8">
      <StepHeader
        title="Wizard Analysis"
        description="Select the type of analysis that best fits your needs"
      />
      
      <FormField label="Analysis Type" required>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleSelectionChange(type.id)}
              className={`
                p-6 border-2 rounded-lg cursor-pointer transition-all duration-200
                ${stepData.selectedType === type.id 
                  ? 'border-gray-900 bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{type.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                  <div className="text-xs text-gray-500">
                    <div>• {type.features[0]}</div>
                    <div>• {type.features[1]}</div>
                    <div>• {type.features[2]}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FormField>
    </div>
  );
};
