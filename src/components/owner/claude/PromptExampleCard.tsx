
import React, { useState } from 'react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { PromptExampleView } from './PromptExampleView';
import { PromptExampleEditForm } from './PromptExampleEditForm';

interface PromptExampleCardProps {
  prompt: ClaudePromptExample;
}

export const PromptExampleCard: React.FC<PromptExampleCardProps> = ({ prompt }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  console.log('🔄 PromptExampleCard render - ID:', prompt.id, 'isEditing:', isEditing);
  
  const handleEdit = () => {
    console.log('🖱️ PromptExampleCard handleEdit called for prompt:', prompt.id);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    console.log('❌ Canceling edit for prompt:', prompt.id);
    setIsEditing(false);
  };

  const handleSaveSuccess = () => {
    console.log('✅ Save successful for prompt:', prompt.id);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <PromptExampleEditForm
        prompt={prompt}
        onCancel={handleCancelEdit}
        onSaveSuccess={handleSaveSuccess}
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
