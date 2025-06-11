
import { AnalysisPreferences, FigmantPromptVariables } from '@/types/design';

export interface WizardData {
  // Step 1: Analysis Type
  selectedUseCase: string;
  
  // Step 2: Upload Files
  selectedFiles: File[];
  urls: string[];
  activeTab: 'files' | 'urls';
  
  // Step 3: Context Files
  contextFiles: File[];
  
  // Step 4: Goals & Instructions
  batchName: string;
  analysisGoals: string;
  customInstructions: string;
  promptVariables: FigmantPromptVariables;
  
  // Step 5: Configure Analysis
  analysisPreferences: AnalysisPreferences;
  
  // Step 6: Review data is computed from above
  
  // Step 7: Submission status
  isSubmitting: boolean;
  submitError: string | null;
}

export const createInitialWizardData = (): WizardData => ({
  selectedUseCase: '',
  selectedFiles: [],
  urls: [''],
  activeTab: 'files',
  contextFiles: [],
  batchName: '',
  analysisGoals: '',
  customInstructions: '',
  promptVariables: {},
  analysisPreferences: {
    auto_comparative: true,
    context_integration: true,
    analysis_depth: 'detailed'
  },
  isSubmitting: false,
  submitError: null
});
