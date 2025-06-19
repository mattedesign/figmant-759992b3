
import React, { useCallback } from 'react';
import { Upload, Plus, X, FileImage } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { ActionButton } from '../components/ActionButton';

export const Step5UploadFiles: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const updateStepData = (updates: Partial<typeof stepData>) => {
    if (typeof setStepData === 'function') {
      const funcStr = setStepData.toString();
      if (funcStr.includes('key') || setStepData.length === 2) {
        // For key-value interface, we need to update each field individually
        Object.entries(updates).forEach(([key, value]) => {
          (setStepData as (key: string, value: any) => void)(key, value);
        });
      } else {
        (setStepData as (newData: typeof stepData) => void)({ ...stepData, ...updates });
      }
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    updateStepData({
      uploadedFiles: [...(stepData.uploadedFiles || []), ...acceptedFiles]
    });
  }, [stepData, updateStepData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const handleReferenceLinkAdd = () => {
    updateStepData({
      referenceLinks: [...stepData.referenceLinks, '']
    });
  };

  const handleReferenceLinkChange = (index: number, value: string) => {
    const newLinks = [...stepData.referenceLinks];
    newLinks[index] = value;
    updateStepData({ referenceLinks: newLinks });
  };

  const removeReferenceLinkAt = (index: number) => {
    const newLinks = stepData.referenceLinks.filter((_, i) => i !== index);
    updateStepData({ referenceLinks: newLinks });
  };

  const removeFile = (index: number) => {
    const newFiles = (stepData.uploadedFiles || []).filter((_, i) => i !== index);
    updateStepData({ uploadedFiles: newFiles });
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
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {isDragActive 
              ? 'Drop your files here' 
              : 'Drag and drop images or PDFs, or click to browse'
            }
          </p>
          <p className="text-sm text-gray-500">
            Supports: PNG, JPG, PDF (max 50MB each)
          </p>
        </div>

        {/* Uploaded Files Display */}
        {stepData.uploadedFiles && stepData.uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <Label className="text-base font-medium">Uploaded Files ({stepData.uploadedFiles.length})</Label>
            <div className="space-y-2">
              {stepData.uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({Math.round(file.size / 1024)} KB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reference Links Section */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Reference links</Label>
          {stepData.referenceLinks.map((link, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Enter your URL"
                value={link}
                onChange={(e) => handleReferenceLinkChange(index, e.target.value)}
                className="flex-1"
              />
              {stepData.referenceLinks.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeReferenceLinkAt(index)}
                  className="px-3 text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
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
