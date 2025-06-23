
export interface StepData {
  selectedType: string;
  selectedTemplate?: any;
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
  attachments?: WizardChatAttachment[];
}

export interface StepProps {
  stepData: StepData;
  setStepData: React.Dispatch<React.SetStateAction<StepData>>;
  currentStep: number;
  totalSteps: number;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
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

// Unified ChatAttachment interface for the wizard
export interface WizardChatAttachment {
  id: string;
  type: 'file' | 'url';
  name: string;
  file?: File;
  url?: string;
  uploadPath?: string;
  status: 'pending' | 'processing' | 'uploading' | 'uploaded' | 'error';
  errorMessage?: string;
  processingInfo?: any;
  metadata?: {
    screenshots?: {
      desktop?: {
        success: boolean;
        url: string;
        screenshotUrl?: string;
        thumbnailUrl?: string;
        error?: string;
      };
      mobile?: {
        success: boolean;
        url: string;
        screenshotUrl?: string;
        thumbnailUrl?: string;
        error?: string;
      };
    };
    fileSize?: number;
    thumbnailUrl?: string;
  };
  thumbnailUrl?: string;
}
