
import { StepData } from '@/components/figmant/pages/premium-analysis/types';

export function buildContextPrompt(stepData: StepData, selectedPrompt: any): string {
  console.log('🔍 Building context prompt...');
  
  let prompt = `Premium Analysis Request - ${selectedPrompt.title}\n\n`;
  
  prompt += `Project: ${stepData.projectName}\n`;
  
  if (stepData.analysisGoals) {
    prompt += `Analysis Goals: ${stepData.analysisGoals}\n`;
  }
  
  if (stepData.desiredOutcome) {
    prompt += `Desired Outcome: ${stepData.desiredOutcome}\n`;
  }
  
  if (stepData.improvementMetric) {
    prompt += `Target Improvement: ${stepData.improvementMetric}\n`;
  }
  
  if (stepData.deadline) {
    prompt += `Deadline: ${stepData.deadline}\n`;
  }
  
  if (stepData.stakeholders.length > 0) {
    prompt += `Stakeholders:\n`;
    stepData.stakeholders.forEach(stakeholder => {
      prompt += `- ${stakeholder.name} (${stakeholder.title || stakeholder.role})\n`;
    });
  }
  
  if (stepData.referenceLinks.filter(link => link.trim()).length > 0) {
    prompt += `Reference Links:\n`;
    stepData.referenceLinks.filter(link => link.trim()).forEach(link => {
      prompt += `- ${link}\n`;
    });
  }

  if (stepData.uploadedFiles && stepData.uploadedFiles.length > 0) {
    prompt += `Uploaded Files:\n`;
    stepData.uploadedFiles.forEach(file => {
      prompt += `- ${file.name} (${file.type}, ${Math.round(file.size / 1024)} KB)\n`;
    });
  }
  
  if (stepData.customPrompt) {
    prompt += `Additional Instructions: ${stepData.customPrompt}\n`;
  }
  
  prompt += `\nPlease provide a comprehensive ${selectedPrompt.category} analysis based on the above context and the following prompt template:\n\n`;
  prompt += selectedPrompt.original_prompt;
  
  console.log('🔍 Context prompt built successfully, length:', prompt.length);
  return prompt;
}
