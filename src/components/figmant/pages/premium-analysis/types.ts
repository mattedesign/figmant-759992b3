
export interface Stakeholder {
  name: string;
  title: string;
}

export interface StepData {
  projectName: string;
  selectedType: string;
  analysisGoals: string;
  desiredOutcome: string;
  improvementMetric: string;
  deadline: string;
  stakeholders: Stakeholder[];
  referenceLinks: string[];
  uploadedFiles?: File[];
  customPrompt: string;
}

export interface StepProps {
  stepData: StepData;
  setStepData: (data: StepData) => void;
  currentStep: number;
  totalSteps: number;
}
