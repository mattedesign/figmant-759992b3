
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, FileImage, Settings, Target, Upload, BarChart3, Sparkles, Play } from 'lucide-react';

interface WizardStepsProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: 'Choose Analysis Type', icon: Target },
  { number: 2, title: 'Upload Files', icon: Upload },
  { number: 3, title: 'Add Context Files', icon: FileImage },
  { number: 4, title: 'Set Goals & Instructions', icon: Sparkles },
  { number: 5, title: 'Configure Analysis', icon: Settings },
  { number: 6, title: 'Review & Confirm', icon: BarChart3 },
  { number: 7, title: 'Start Analysis', icon: Play }
];

export const WizardSteps: React.FC<WizardStepsProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        const Icon = step.icon;
        
        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center space-y-2">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${isCompleted 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : isActive 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-background border-muted-foreground/30 text-muted-foreground'
                }
              `}>
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              
              <div className="text-center max-w-20">
                <Badge 
                  variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
                  className="text-xs px-2 py-1"
                >
                  {step.number}
                </Badge>
                <p className={`text-xs mt-1 ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
                  {step.title}
                </p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4 transition-colors
                ${currentStep > step.number ? 'bg-green-600' : 'bg-muted-foreground/20'}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
};
