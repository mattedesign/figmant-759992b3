
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Upload, CheckCircle } from 'lucide-react';
import { validateImageDimensions } from '@/utils/imageValidation';
import { validateImageFile } from '@/utils/imageProcessing';

interface ValidationStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
}

interface PreUploadValidatorProps {
  files: File[];
  onValidationComplete: (validFiles: File[], errors: string[]) => void;
}

export const PreUploadValidator: React.FC<PreUploadValidatorProps> = ({
  files,
  onValidationComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationSteps, setValidationSteps] = useState<ValidationStep[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateFiles = async () => {
    setIsValidating(true);
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    const steps: ValidationStep[] = files.map((file, index) => ({
      id: `file-${index}`,
      name: file.name,
      status: 'pending'
    }));
    
    setValidationSteps(steps);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentStep(i);
      
      // Update step status to running
      setValidationSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: 'running' } : step
      ));
      
      try {
        // Basic file validation
        const basicValidation = validateImageFile(file);
        if (!basicValidation.isValid) {
          errors.push(`${file.name}: ${basicValidation.error}`);
          setValidationSteps(prev => prev.map((step, idx) => 
            idx === i ? { ...step, status: 'error', message: basicValidation.error } : step
          ));
          continue;
        }
        
        // Dimension validation for images
        if (file.type.startsWith('image/')) {
          const dimensionValidation = await validateImageDimensions(file);
          if (!dimensionValidation.isValid) {
            errors.push(`${file.name}: ${dimensionValidation.error}`);
            setValidationSteps(prev => prev.map((step, idx) => 
              idx === i ? { ...step, status: 'error', message: dimensionValidation.error } : step
            ));
            continue;
          }
        }
        
        // File passed all validations
        validFiles.push(file);
        setValidationSteps(prev => prev.map((step, idx) => 
          idx === i ? { ...step, status: 'success', message: 'Ready for upload' } : step
        ));
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Validation failed';
        errors.push(`${file.name}: ${errorMessage}`);
        setValidationSteps(prev => prev.map((step, idx) => 
          idx === i ? { ...step, status: 'error', message: errorMessage } : step
        ));
      }
    }
    
    setIsValidating(false);
    setCurrentStep(files.length);
    onValidationComplete(validFiles, errors);
  };

  const progress = files.length > 0 ? (currentStep / files.length) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Pre-Upload Validation</h3>
        {!isValidating && validationSteps.length === 0 && (
          <Button onClick={validateFiles} size="sm" className="flex items-center gap-2">
            <Upload className="h-3 w-3" />
            Validate Files
          </Button>
        )}
      </div>
      
      {isValidating && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Validating files... ({currentStep + 1} of {files.length})
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      {validationSteps.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {validationSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-2 p-2 rounded border text-sm ${
                step.status === 'success' ? 'bg-green-50 border-green-200' :
                step.status === 'error' ? 'bg-red-50 border-red-200' :
                step.status === 'running' ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}
            >
              {step.status === 'success' && <CheckCircle className="h-3 w-3 text-green-600" />}
              {step.status === 'error' && <AlertTriangle className="h-3 w-3 text-red-600" />}
              {step.status === 'running' && (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
              {step.status === 'pending' && <div className="h-3 w-3 rounded-full bg-gray-300" />}
              
              <div className="flex-1">
                <div className="font-medium">{step.name}</div>
                {step.message && (
                  <div className={`text-xs ${
                    step.status === 'error' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {step.message}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
