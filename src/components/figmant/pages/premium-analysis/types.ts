
export interface StepData {
  selectedType: string;
  selectedTemplate?: any; // Add template object
  projectName: string;
  analysisGoals: string;
  contextualData: Record<string, any>;
  uploadedFiles: File[];
  customPrompt: string;
  stakeholders: Stakeholder[];
  referenceLinks: string[];
  uploads?: {
    images: File[];
    urls: string[];
    files: File[];
    screenshots: any[];
  };
  attachments?: ChatAttachment[]; // Add attachments for the new Step2
}

export interface StepProps {
  stepData: StepData;
  setStepData: React.Dispatch<React.SetStateAction<StepData>>;
  currentStep: number;
  totalSteps: number;
  // Remove navigation props since WizardNavigation handles them
}

export interface Stakeholder {
  name: string;
  role: string;
  title?: string;
}

export interface AnalysisType {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
}

// Add ChatAttachment interface if not imported
export interface ChatAttachment {
  id: string;
  type: 'file' | 'url';
  name: string;
  file?: File;
  url?: string;
  status: 'uploading' | 'uploaded' | 'processing' | 'error';
  thumbnailUrl?: string;
  errorMessage?: string;
  metadata?: any;
}
