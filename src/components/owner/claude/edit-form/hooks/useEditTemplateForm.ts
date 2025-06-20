
import { useState } from 'react';
import { useUpdatePromptExample, ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { useToast } from '@/hooks/use-toast';
import { ContextualField } from '@/types/figmant';
import { EditedTemplateData } from '../types';

interface UseEditTemplateFormProps {
  template: ClaudePromptExample;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

export const useEditTemplateForm = ({ template, onSaveSuccess, onCancel }: UseEditTemplateFormProps) => {
  const { toast } = useToast();
  const updateTemplateMutation = useUpdatePromptExample();
  
  const [editedTemplate, setEditedTemplate] = useState<EditedTemplateData>({
    title: template.title,
    display_name: template.display_name || template.title,
    description: template.description || '',
    category: template.category,
    original_prompt: template.original_prompt,
    claude_response: template.claude_response,
    effectiveness_rating: template.effectiveness_rating || 5,
    use_case_context: template.use_case_context || '',
    business_domain: template.business_domain || '',
    is_template: template.is_template,
    is_active: template.is_active,
    metadata: template.metadata || {}
  });

  const handleSave = async (contextualFields: ContextualField[]) => {
    if (!editedTemplate.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!editedTemplate.display_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Display name is required",
        variant: "destructive",
      });
      return;
    }

    if (!editedTemplate.original_prompt.trim()) {
      toast({
        title: "Validation Error", 
        description: "Prompt text is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const updateData = {
        ...editedTemplate,
        metadata: {
          ...editedTemplate.metadata,
          contextual_fields: contextualFields
        }
      };

      await updateTemplateMutation.mutateAsync({
        id: template.id,
        updates: updateData
      });
      
      toast({
        title: "Success",
        description: "Prompt template updated successfully",
      });
      onSaveSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update prompt template",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const updateEditedTemplate = (updater: (prev: EditedTemplateData) => EditedTemplateData) => {
    setEditedTemplate(updater);
  };

  return {
    editedTemplate,
    setEditedTemplate: updateEditedTemplate,
    handleSave,
    handleCancel,
    isSaving: updateTemplateMutation.isPending
  };
};
