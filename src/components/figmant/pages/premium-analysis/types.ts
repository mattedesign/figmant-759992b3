
import { LucideIcon } from 'lucide-react';

export interface Stakeholder {
  name: string;
  role: string;
  title: string;
  email?: string;
}

export interface AnalysisType {
  id: string;
  title: string;
  icon: LucideIcon;
}

export interface StepData {
  selectedType: string;
  projectName: string;
  analysisGoals: string;
  desiredOutcome: string;
  improvementMetric: string;
  deadline: string;
  date: string;
  stakeholders: Stakeholder[];
  referenceLinks: string[];
  customPrompt: string;
  uploadedFiles?: File[];
  [key: string]: any;
}

export interface StepProps {
  stepData: StepData;
  setStepData: ((newData: StepData) => void) | ((key: string, value: any) => void);
  currentStep: number;
  totalSteps: number;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
}
