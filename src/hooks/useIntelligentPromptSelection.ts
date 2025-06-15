
import { useState } from 'react';
import { ClaudePromptOptimizer, IntelligentPromptSelection } from '@/utils/claudePromptOptimizer';
import { UserInput } from '@/utils/contentAnalyzer';

export const useIntelligentPromptSelection = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastSelection, setLastSelection] = useState<IntelligentPromptSelection | null>(null);

  const selectOptimalPrompt = async (input: UserInput): Promise<IntelligentPromptSelection> => {
    setIsAnalyzing(true);
    
    try {
      const selection = await ClaudePromptOptimizer.getOptimalPromptForUserInput(input);
      setLastSelection(selection);
      return selection;
    } catch (error) {
      console.error('Error selecting optimal prompt:', error);
      
      // Return safe fallback
      const fallbackSelection: IntelligentPromptSelection = {
        selectedPrompt: null,
        category: 'general',
        analysisType: 'usability',
        confidence: 0.1,
        reasoning: 'Error occurred during analysis',
        fallbackUsed: true
      };
      
      setLastSelection(fallbackSelection);
      return fallbackSelection;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    selectOptimalPrompt,
    isAnalyzing,
    lastSelection,
    clearSelection: () => setLastSelection(null)
  };
};
