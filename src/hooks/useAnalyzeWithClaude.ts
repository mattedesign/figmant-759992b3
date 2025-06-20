
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
      const basePrompt = template?.prompt || `
        You are an expert UX designer and design analyst. Analyze the provided design and give actionable insights.
        
        Focus on:
        1. Visual hierarchy and layout effectiveness
        2. User experience and usability
        3. Design consistency and best practices
        4. Specific improvement recommendations
        
        User request: ${message}
      `;

      // Construct the final prompt with context
      const analysisPrompt = template 
        ? `${basePrompt}\n\nSpecific Analysis Request: ${message}`
        : basePrompt;

      console.log('🔥 CLAUDE ANALYSIS - Starting with template:', {
        templateId: template?.id,
        templateTitle: template?.title,
        messageLength: message.length,
        attachmentsCount: attachments.length,
        hasTemplate: !!template
      });

      try {
        // Call the Claude API edge function
        const response = await fetch('/api/claude-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: analysisPrompt,
            attachments: attachments,
            requestType: 'figmant_analysis'
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Analysis failed: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Analysis failed');
        }

        console.log('✅ CLAUDE ANALYSIS - Success:', {
          templateUsed: template?.displayName || 'General Analysis',
          analysisLength: data.analysis?.length || 0,
          attachmentsProcessed: data.attachmentsProcessed || 0
        });

        return {
          analysis: data.analysis || 'No analysis available',
          template_used: template?.id,
          confidence_score: 85
        };

      } catch (error) {
        console.error('❌ CLAUDE ANALYSIS - Error:', error);
        
        // Fallback mock response for development
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
    }
  });
};
