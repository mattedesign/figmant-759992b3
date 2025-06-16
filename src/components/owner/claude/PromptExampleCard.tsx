
import React, { useState, useCallback } from 'react';
import { ClaudePromptExample, useUpdatePromptExample } from '@/hooks/useClaudePromptExamples';
import { useToast } from '@/hooks/use-toast';
import { PromptExampleView } from './PromptExampleView';
import { PromptExampleEditForm } from './PromptExampleEditForm';

interface PromptExampleCardProps {
  prompt: ClaudePromptExample;
}

export const PromptExampleCard: React.FC<PromptExampleCardProps> = ({ prompt }) => {
  const { toast } = useToast();
  const updatePromptMutation = useUpdatePromptExample();
  const [isEditing, setIsEditing] = useState(false);
  
  console.log('🔄 PromptExampleCard render - ID:', prompt.id, 'isEditing:', isEditing);
  
  const [editedPrompt, setEditedPrompt] = useState({
    title: prompt.title,
    description: prompt.description || '',
    category: prompt.category,
    original_prompt: prompt.original_prompt,
    claude_response: prompt.claude_response,
    effectiveness_rating: prompt.effectiveness_rating || 5,
    use_case_context: prompt.use_case_context || '',
    business_domain: prompt.business_domain || '',
    is_template: prompt.is_template,
    is_active: prompt.is_active
  });

  const handleEdit = useCallback(() => {
    console.log('🖱️ handleEdit called for prompt:', prompt.id);
    setIsEditing(true);
    console.log('✅ Edit mode activated for prompt:', prompt.id);
  }, [prompt.id]);

  const handleSave = useCallback(async () => {
    console.log('💾 Saving prompt changes for:', prompt.id);
    try {
      await updatePromptMutation.mutateAsync({
        id: prompt.id,
        updates: editedPrompt
      });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Prompt updated successfully",
      });
    } catch (error) {
      console.error('Failed to update prompt:', error);
      toast({
        title: "Error",
        description: "Failed to update prompt",
        variant: "destructive",
      });
    }
  }, [prompt.id, editedPrompt, updatePromptMutation, toast]);

  const handleCancel = useCallback(() => {
    console.log('❌ Canceling edit for prompt:', prompt.id);
    setEditedPrompt({
      title: prompt.title,
      description: prompt.description || '',
      category: prompt.category,
      original_prompt: prompt.original_prompt,
      claude_response: prompt.claude_response,
      effectiveness_rating: prompt.effectiveness_rating || 5,
      use_case_context: prompt.use_case_context || '',
      business_domain: prompt.business_domain || '',
      is_template: prompt.is_template,
      is_active: prompt.is_active
    });
    setIsEditing(false);
  }, [prompt]);

  // Update editedPrompt when prompt prop changes
  React.useEffect(() => {
    setEditedPrompt({
      title: prompt.title,
      description: prompt.description || '',
      category: prompt.category,
      original_prompt: prompt.original_prompt,
      claude_response: prompt.claude_response,
      effectiveness_rating: prompt.effectiveness_rating || 5,
      use_case_context: prompt.use_case_context || '',
      business_domain: prompt.business_domain || '',
      is_template: prompt.is_template,
      is_active: prompt.is_active
    });
  }, [prompt]);

  console.log('🎨 Rendering mode for prompt:', prompt.id, '- isEditing:', isEditing);

  if (isEditing) {
    return (
      <PromptExampleEditForm
        editedPrompt={editedPrompt}
        setEditedPrompt={setEditedPrompt}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={updatePromptMutation.isPending}
      />
    );
  }

  return (
    <PromptExampleView
      prompt={prompt}
      onEdit={handleEdit}
    />
  );
};
