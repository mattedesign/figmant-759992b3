
import { useState, useCallback } from 'react';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';

interface EditorState {
  formData: any;
  isDirty: boolean;
  isLoading: boolean;
}

export const useEditorState = (templateId: string) => {
  const { data: templates = [] } = useClaudePromptExamples();
  const [state, setState] = useState<EditorState>({
    formData: {},
    isDirty: false,
    isLoading: true
  });

  const loadTemplate = useCallback(() => {
    if (!templateId) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setState({
        formData: {
          title: template.title || '',
          display_name: template.display_name || template.title || '',
          description: template.description || '',
          category: template.category || 'general',
          original_prompt: template.original_prompt || '',
          claude_response: template.claude_response || '',
          effectiveness_rating: template.effectiveness_rating || 0,
          use_case_context: template.use_case_context || '',
          business_domain: template.business_domain || '',
          prompt_variables: template.prompt_variables || {},
          is_template: template.is_template || false,
          is_active: template.is_active !== false,
          credit_cost: template.credit_cost || 3,
          metadata: template.metadata || {}
        },
        isDirty: false,
        isLoading: false
      });
    } else {
      setState({
        formData: {
          title: '',
          display_name: '',
          description: '',
          category: 'general',
          original_prompt: '',
          claude_response: '',
          effectiveness_rating: 0,
          use_case_context: '',
          business_domain: '',
          prompt_variables: {},
          is_template: true,
          is_active: true,
          credit_cost: 3,
          metadata: {}
        },
        isDirty: false,
        isLoading: false
      });
    }
  }, [templateId, templates]);

  const setFormData = useCallback((updater: any) => {
    setState(prev => ({
      ...prev,
      formData: typeof updater === 'function' ? updater(prev.formData) : updater,
      isDirty: true
    }));
  }, []);

  return {
    formData: state.formData,
    setFormData,
    isDirty: state.isDirty,
    isLoading: state.isLoading,
    loadTemplate
  };
};
