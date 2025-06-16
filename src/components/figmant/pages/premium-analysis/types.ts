
export interface StepData {
  selectedType: string;
  projectName: string;
  analysisGoals: string;
  desiredOutcome: string;
  improvementMetric: string;
  deadline: string;
  date: string;
  stakeholders: Array<{
    name: string;
    title: string;
  }>;
  referenceLinks: string[];
  customPrompt: string;
}

export interface AnalysisType {
  id: string;
  title: string;
  icon: any;
}

export interface StepProps {
  stepData: StepData;
  setStepData: (data: StepData) => void;
  currentStep: number;
  totalSteps: number;
}
