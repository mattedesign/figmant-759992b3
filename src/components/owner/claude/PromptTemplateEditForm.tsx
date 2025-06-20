
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { EditFormHeader } from './edit-form/EditFormHeader';
import { BasicInfoFields } from './edit-form/BasicInfoFields';
import { PromptContentFields } from './edit-form/PromptContentFields';
import { MetadataFields } from './edit-form/MetadataFields';
import { ContextualFieldsSection } from './ContextualFieldsSection';
import { useEditTemplateForm } from './edit-form/hooks/useEditTemplateForm';
import { useContextualFields } from './edit-form/hooks/useContextualFields';

interface PromptTemplateEditFormProps {
  template: ClaudePromptExample;
  onCancel: () => void;
  onSaveSuccess: () => void;
}

export const PromptTemplateEditForm: React.FC<PromptTemplateEditFormProps> = ({
  template,
  onCancel,
  onSaveSuccess
}) => {
  const {
    editedTemplate,
    setEditedTemplate,
    handleSave: formHandleSave,
    handleCancel,
    isSaving
  } = useEditTemplateForm({ template, onSaveSuccess, onCancel });

  const handleFieldsUpdate = (fields: any) => {
    setEditedTemplate(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        contextual_fields: fields
      }
    }));
  };

  const {
    contextualFields,
    handleContextualFieldsUpdate
  } = useContextualFields({
    templateMetadata: template.metadata,
    templateCategory: template.category,
    onFieldsUpdate: handleFieldsUpdate
  });

  const handleSave = () => {
    formHandleSave(contextualFields);
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <EditFormHeader
        promptTitle={template.title}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
      />
      
      <CardContent className="space-y-6">
        <BasicInfoFields
          editedPrompt={editedTemplate}
          setEditedPrompt={setEditedTemplate}
        />
        
        <PromptContentFields
          editedPrompt={editedTemplate}
          setEditedPrompt={setEditedTemplate}
        />
        
        <MetadataFields
          editedPrompt={editedTemplate}
          setEditedPrompt={setEditedTemplate}
        />

        <ContextualFieldsSection
          contextualFields={contextualFields}
          onUpdateFields={handleContextualFieldsUpdate}
        />
      </CardContent>
    </Card>
  );
};
