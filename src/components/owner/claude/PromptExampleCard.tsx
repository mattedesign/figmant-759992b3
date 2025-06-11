
import React, { useState } from 'react';
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

  const handleSave = async () => {
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
      toast({
        title: "Error",
        description: "Failed to update prompt",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
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
  };

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
      onEdit={() => setIsEditing(true)}
    />
  );
};
