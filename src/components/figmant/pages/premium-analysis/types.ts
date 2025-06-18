import { LucideIcon } from 'lucide-react';

export interface Stakeholder {
  name: string;
  title: string;
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
  uploadedFiles?: File[];
  customPrompt: string;
  
  // Dynamic fields based on prompt type
  targetMarket?: string;
  competitorUrls?: string;
  marketPosition?: string;
  competitiveAdvantage?: string;
  currentConversionRate?: string;
  averageOrderValue?: string;
  revenueGoal?: string;
  customerSegments?: string;
  testHypothesis?: string;
  successMetrics?: string;
  testDuration?: string;
  trafficVolume?: string;
  primaryGoal?: string;
  keyElements?: string;
  userFlow?: string;
  brandGuidelines?: string;
  targetAudience?: string;
  keyMessage?: string;
  toneOfVoice?: string;
  callToAction?: string;
  complianceLevel?: string;
  userNeeds?: string;
  assistiveTech?: string;
  currentIssues?: string;
  timeline?: string;
  constraints?: string;
  
  // Keep legacy fields for backward compatibility
  [key: string]: any;
}

export interface StepProps {
  stepData: StepData;
  setStepData: (data: StepData) => void;
  currentStep: number;
  totalSteps: number;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
}

export interface AnalysisType {
  id: string;
  title: string;
  icon: LucideIcon;
}
