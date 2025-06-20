
import { useMutation } from '@tanstack/react-query';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { FigmantPromptTemplate as HookTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';

interface AnalyzeWithClaudeParams {
  message: string;
  attachments: ChatAttachment[];
  template?: HookTemplate;
}

interface AnalyzeWithClaudeResponse {
  analysis: string;
  template_used?: string;
  confidence_score: number;
}

export const useAnalyzeWithClaude = () => {
  return useMutation<AnalyzeWithClaudeResponse, Error, AnalyzeWithClaudeParams>({
    mutationFn: async ({ 
      message, 
      attachments, 
      template 
    }) => {
      // Use template prompt if provided, otherwise use general analysis
      const analysisPrompt = template?.prompt || `
        You are an expert UX designer and design analyst. Analyze the provided design and give actionable insights.
        
        Focus on:
        1. Visual hierarchy and layout effectiveness
        2. User experience and usability
        3. Design consistency and best practices
        4. Specific improvement recommendations
        
        User request: ${message}
      `;

      // Inject template context into the prompt
      const contextualPrompt = template 
        ? `${analysisPrompt}\n\nUser Request: ${message}`
        : analysisPrompt;

      console.log('🔥 CLAUDE ANALYSIS - Starting with template:', {
        templateId: template?.id,
        templateTitle: template?.title,
        messageLength: message.length,
        attachmentsCount: attachments.length
      });

      // TODO: Replace this with your actual Claude API call
      // For now, return a mock response
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResponse = `
        ## Analysis Results

        **Template Used**: ${template?.displayName || 'General Analysis'}

        ### Key Findings:
        1. **Visual Hierarchy**: The design shows good use of typography hierarchy
        2. **User Experience**: Navigation flow could be improved
        3. **Design Consistency**: Overall consistent with modern design patterns
        4. **Accessibility**: Consider improving color contrast ratios

        ### Recommendations:
        - Increase spacing between key elements
        - Consider adding more visual cues for important actions
        - Review mobile responsiveness
        - Test with actual users for validation

        *Analysis completed using ${template?.displayName || 'general analysis template'}*
      `;

      return {
        analysis: mockResponse,
        template_used: template?.id,
        confidence_score: 85
      };
    }
  });
};
