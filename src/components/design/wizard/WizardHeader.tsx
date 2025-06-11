
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface WizardHeaderProps {
  currentStep: number;
  isComplete: boolean;
  onReset: () => void;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({
  currentStep,
  isComplete,
  onReset
}) => {
  const progressPercentage = (currentStep / 7) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {isComplete ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Upload Complete
              </>
            ) : (
              `Design Analysis Wizard`
            )}
          </h1>
          <p className="text-muted-foreground">
            {isComplete 
              ? 'Your designs have been uploaded and analysis is starting'
              : `Step ${currentStep} of 7 - Follow the guided process to upload and analyze your designs`
            }
          </p>
        </div>
        
        {(currentStep > 1 || isComplete) && (
          <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Start Over
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </div>
  );
};
