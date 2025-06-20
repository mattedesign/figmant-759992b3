
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { PromptTemplateEditForm } from './PromptTemplateEditForm';
import { PromptTemplateView } from './PromptTemplateView';

interface PromptTemplateItemProps {
  template: ClaudePromptExample;
  onView: (template: ClaudePromptExample) => void;
  onDelete: (template: ClaudePromptExample) => void;
  onEditSuccess: () => void;
}

export const PromptTemplateItem: React.FC<PromptTemplateItemProps> = ({
  template,
  onView,
  onDelete,
  onEditSuccess
}) => {
  const [isEditing, setIsEditing] = useState(false);

  console.log('🔍 RENDER CHECK:', {
    isEditing,
    willRenderEditForm: isEditing,
    templateId: template.id
  });

  const handleEdit = () => {
    console.log('🔍 Starting edit for template:', template.id);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    console.log('🔍 Canceling edit for template:', template.id);
    setIsEditing(false);
  };

  const handleSaveSuccess = () => {
    console.log('🔍 Edit saved successfully for template:', template.id);
    setIsEditing(false);
    onEditSuccess();
  };

  if (isEditing) {
    console.log('🔍 RENDERING EDIT FORM for template:', template.id);
    return (
      <PromptTemplateEditForm
        template={template}
        onCancel={handleCancelEdit}
        onSaveSuccess={handleSaveSuccess}
      />
    );
  }

  return (
    <PromptTemplateView
      template={template}
      onEdit={handleEdit}
    />
  );
};
