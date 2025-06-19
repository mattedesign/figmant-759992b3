
import React from 'react';
import { useWizardState } from '../analysis/WizardStateManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, History, FileText } from 'lucide-react';

export const PremiumAnalysisTabController: React.FC = () => {
  const { currentStep, setCurrentStep, wizardData, historicalContext, resetWizard } = useWizardState();

  const steps = [
    { id: 0, title: 'Analysis Type', description: 'Choose your analysis focus' },
    { id: 1, title: 'Upload Files', description: 'Add your design files' },
    { id: 2, title: 'Configuration', description: 'Set analysis parameters' },
    { id: 3, title: 'Review & Run', description: 'Confirm and start analysis' },
    { id: 4, title: 'Results', description: 'View your analysis results' }
  ];

  return (
    <div className="h-full flex flex-col p-6">
      {/* Historical Context Banner */}
      {historicalContext && (
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Continuing Previous Analysis</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={resetWizard}>
                Start Fresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-semibold">{historicalContext.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {historicalContext.analysisType} • Score: {historicalContext.score}/10
                </p>
              </div>
              <Badge variant="secondary">Historical Context Loaded</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id + 1}
              </div>
              <div className="ml-2 flex-1">
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs text-muted-foreground">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-400 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{steps[currentStep]?.title}</CardTitle>
          </CardHeader>
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">
                {steps[currentStep]?.title} Content
              </div>
              <p className="text-muted-foreground mb-4">
                {steps[currentStep]?.description}
              </p>
              
              {historicalContext && currentStep === 0 && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    This wizard will build upon your previous {historicalContext.analysisType} analysis.
                    You can modify the settings or continue with similar parameters.
                  </p>
                </div>
              )}
              
              <div className="flex gap-2 justify-center">
                {currentStep > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button onClick={() => setCurrentStep(currentStep + 1)}>
                    Next
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button>
                    Complete Analysis
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
