
import { StepData } from '@/components/figmant/pages/premium-analysis/types';

export function buildContextPrompt(stepData: StepData, selectedPrompt: any): string {
  console.log('🔍 Building context prompt...');
  
  let prompt = `Premium Analysis Request - ${selectedPrompt.title}\n\n`;
  
  // Add basic project information
  prompt += `Project: ${stepData.projectName}\n`;
  
  if (stepData.analysisGoals) {
    prompt += `Analysis Goals: ${stepData.analysisGoals}\n`;
  }
  
  // Add contextual field data if available
  if (stepData.contextualData && Object.keys(stepData.contextualData).length > 0) {
    prompt += `\nContextual Information:\n`;
    Object.entries(stepData.contextualData).forEach(([fieldId, value]) => {
      if (value && value.toString().trim()) {
        // Find the field definition to get the label
        const field = selectedPrompt.contextual_fields?.find((f: any) => f.id === fieldId);
        const fieldLabel = field?.label || fieldId;
        prompt += `${fieldLabel}: ${value}\n`;
      }
    });
  }

  if (stepData.uploadedFiles && stepData.uploadedFiles.length > 0) {
    prompt += `\nUploaded Files:\n`;
    stepData.uploadedFiles.forEach(file => {
      prompt += `- ${file.name} (${file.type}, ${Math.round(file.size / 1024)} KB)\n`;
    });
  }
  
  if (stepData.customPrompt) {
    prompt += `\nAdditional Instructions: ${stepData.customPrompt}\n`;
  }
  
  prompt += `\nPlease provide a comprehensive ${selectedPrompt.category} analysis based on the above context and the following prompt template:\n\n`;
  prompt += selectedPrompt.original_prompt;
  
  console.log('🔍 Context prompt built successfully, length:', prompt.length);
  return prompt;
}
