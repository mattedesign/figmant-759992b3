
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { useClaudePromptExamplesByCategory } from '@/hooks/useClaudePromptExamples';
import { Sparkles, Loader2 } from 'lucide-react';

export const Step1SelectAnalysisType: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const { data: premiumPrompts, isLoading, error } = useClaudePromptExamplesByCategory('premium');

  const handleTypeSelection = (promptId: string) => {
    setStepData({ ...stepData, selectedType: promptId });
  };

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Choose Your Premium Analysis"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading premium analysis options...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading premium analysis options</p>
        </div>
      ) : !premiumPrompts || premiumPrompts.length === 0 ? (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Premium Analysis Available</h3>
          <p className="text-gray-600">Premium analysis prompts will be available soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {premiumPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className={`cursor-pointer transition-all duration-200 ${
                stepData.selectedType === prompt.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
              }`}
              onClick={() => handleTypeSelection(prompt.id)}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center ${
                  stepData.selectedType === prompt.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-center mb-2">{prompt.title}</h3>
                {prompt.description && (
                  <p className="text-sm text-gray-600 text-center">{prompt.description}</p>
                )}
                {prompt.effectiveness_rating && (
                  <div className="mt-3 flex justify-center">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < prompt.effectiveness_rating! 
                              ? 'bg-yellow-400' 
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
