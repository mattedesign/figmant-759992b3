
export interface StepData {
  selectedType: string;
  projectName: string;
  analysisGoals: string;
  contextualData: Record<string, any>;
  uploadedFiles: File[];
  customPrompt: string;
  stakeholders: Stakeholder[];
  referenceLinks: string[];
  templateData?: any; // Add templateData as optional property
  uploads?: {
    images: File[];
    urls: string[];
    files: File[];
    screenshots: any[];
  };
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
