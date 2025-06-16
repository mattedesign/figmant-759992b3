
import React, { useState, useEffect } from 'react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { PromptExampleView } from './PromptExampleView';
import { PromptExampleEditForm } from './PromptExampleEditForm';
import { useAuth } from '@/contexts/AuthContext';

interface PromptExampleCardProps {
  prompt: ClaudePromptExample;
}

export const PromptExampleCard: React.FC<PromptExampleCardProps> = ({ prompt }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { isOwner, loading } = useAuth();
  
  console.log('🔄 PromptExampleCard render - ID:', prompt.id, 'isEditing:', isEditing, 'isOwner:', isOwner, 'loading:', loading);
  
  // Debug effect to track state changes
  useEffect(() => {
    console.log('📊 PromptExampleCard state change:', {
      promptId: prompt.id,
      isEditing,
      isOwner,
      loading,
      authReady: !loading
    });
  }, [isEditing, isOwner, loading, prompt.id]);
  
  const handleEdit = () => {
    console.log('🖱️ PromptExampleCard handleEdit called for prompt:', prompt.id);
    console.log('🔐 Auth state check:', { isOwner, loading });
    
    if (loading) {
      console.log('⏳ Auth still loading, cannot edit yet');
      return;
    }
    
    if (!isOwner) {
      console.log('❌ User is not owner, edit blocked');
      return;
    }
    
    console.log('✅ Setting editing state to true');
    setIsEditing(true);
    
    // Force a re-render after a short delay to ensure state is set
    setTimeout(() => {
      console.log('🔄 Forced state check after edit click:', { isEditing: true });
    }, 100);
  };

  const handleCancelEdit = () => {
    console.log('❌ Canceling edit for prompt:', prompt.id);
    setIsEditing(false);
  };

  const handleSaveSuccess = () => {
    console.log('✅ Save successful for prompt:', prompt.id);
    setIsEditing(false);
  };

  // Show loading state if auth is still loading
  if (loading) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  console.log('🎨 PromptExampleCard rendering decision:', {
    promptId: prompt.id,
    isEditing,
    willShowEditForm: isEditing,
    willShowViewForm: !isEditing
  });

  if (isEditing) {
    console.log('📝 Rendering edit form for prompt:', prompt.id);
    return (
      <div className="w-full">
        <PromptExampleEditForm
          prompt={prompt}
          onCancel={handleCancelEdit}
          onSaveSuccess={handleSaveSuccess}
        />
      </div>
    );
  }

  console.log('👁️ Rendering view form for prompt:', prompt.id);
  return (
    <div className="w-full">
      <PromptExampleView
        prompt={prompt}
        onEdit={handleEdit}
      />
    </div>
  );
};
