
import React, { useState, useEffect } from 'react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { PromptTemplateView } from './PromptTemplateView';
import { PromptTemplateEditForm } from './PromptTemplateEditForm';
import { useAuth } from '@/contexts/AuthContext';

interface PromptTemplateItemProps {
  template: ClaudePromptExample;
}

export const PromptTemplateItem: React.FC<PromptTemplateItemProps> = ({ template }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { isOwner, loading } = useAuth();
  
  console.log('🔄 PromptTemplateItem render - ID:', template.id, 'isEditing:', isEditing, 'isOwner:', isOwner, 'loading:', loading);
  
  // Debug effect to track state changes
  useEffect(() => {
    console.log('📊 PromptTemplateItem state change:', {
      templateId: template.id,
      isEditing,
      isOwner,
      loading,
      authReady: !loading
    });
  }, [isEditing, isOwner, loading, template.id]);
  
  const handleEdit = () => {
    console.log('🖱️ PromptTemplateItem handleEdit called for template:', template.id);
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
    console.log('❌ Canceling edit for template:', template.id);
    setIsEditing(false);
  };

  const handleSaveSuccess = () => {
    console.log('✅ Save successful for template:', template.id);
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

  console.log('🎨 PromptTemplateItem rendering decision:', {
    templateId: template.id,
    isEditing,
    willShowEditForm: isEditing,
    willShowViewForm: !isEditing
  });

  if (isEditing) {
    console.log('📝 Rendering edit form for template:', template.id);
    return (
      <div className="w-full">
        <PromptTemplateEditForm
          template={template}
          onCancel={handleCancelEdit}
          onSaveSuccess={handleSaveSuccess}
        />
      </div>
    );
  }

  console.log('👁️ Rendering view form for template:', template.id);
  return (
    <div className="w-full">
      <PromptTemplateView
        template={template}
        onEdit={handleEdit}
      />
    </div>
  );
};
