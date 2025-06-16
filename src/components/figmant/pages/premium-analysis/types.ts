
import { LucideIcon } from 'lucide-react';

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
  date: string;
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

export interface AnalysisType {
  id: string;
  title: string;
  icon: LucideIcon;
}
