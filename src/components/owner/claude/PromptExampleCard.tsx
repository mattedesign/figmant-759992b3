
import React, { useState } from 'react';
import { ClaudePromptExample, useUpdatePromptExample } from '@/hooks/useClaudePromptExamples';
import { useToast } from '@/hooks/use-toast';
import { PromptExampleView } from './PromptExampleView';
import { PromptExampleEditForm } from './PromptExampleEditForm';

interface PromptExampleCardProps {
  prompt: ClaudePromptExample;
}

export const PromptExampleCard: React.FC<PromptExampleCardProps> = ({ prompt }) => {
  console.log('🔄 PromptExampleCard rendering - prompt ID:', prompt.id, 'title:', prompt.title);
  
  const { toast } = useToast();
  const updatePromptMutation = useUpdatePromptExample();
  const [isEditing, setIsEditing] = useState(false);
  
  console.log('📝 Current editing state for prompt', prompt.id, ':', isEditing);
  
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

  const handleEdit = () => {
    console.log('🖱️ handleEdit called for prompt:', prompt.id);
    console.log('🔄 Setting isEditing from', isEditing, 'to true');
    setIsEditing(true);
    console.log('✅ handleEdit completed - state should update');
  };

  const handleSave = async () => {
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
  };

  const handleCancel = () => {
    console.log('❌ Canceling edit mode for prompt:', prompt.id);
    // Reset to original values
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

  // Update editedPrompt when prompt prop changes
  React.useEffect(() => {
    console.log('📋 Updating editedPrompt for prompt:', prompt.id);
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

  console.log('🎨 About to render - isEditing:', isEditing, 'for prompt:', prompt.id);

  if (isEditing) {
    console.log('✏️ Rendering edit form for prompt:', prompt.id);
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

  console.log('👁️ Rendering view mode for prompt:', prompt.id);
  return (
    <PromptExampleView
      prompt={prompt}
      onEdit={handleEdit}
    />
  );
};
