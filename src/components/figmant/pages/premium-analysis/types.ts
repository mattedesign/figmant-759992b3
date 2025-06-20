
export interface StepData {
  selectedType: string;
  projectName: string;
  analysisGoals: string;
  contextualData: Record<string, any>;
  uploadedFiles: File[];
  customPrompt: string;
  stakeholders: Stakeholder[];
  referenceLinks: string[];
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
