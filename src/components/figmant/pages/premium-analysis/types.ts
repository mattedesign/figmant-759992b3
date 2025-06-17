
export interface StepData {
  selectedType: string;
  projectName: string;
  analysisGoals: string;
  desiredOutcome: string;
  improvementMetric: string;
  deadline: string;
  date: string;
  stakeholders: string[];
  referenceLinks: string[];
  customPrompt: string;
}

export interface StepProps {
  stepData: StepData;
  setStepData: (data: StepData) => void;
  currentStep: number;
  totalSteps: number;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
}
