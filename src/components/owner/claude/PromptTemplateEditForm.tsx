
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ClaudePromptExample, useUpdatePromptExample } from '@/hooks/useClaudePromptExamples';
import { CategoryType } from '@/types/promptTypes';
import { useToast } from '@/hooks/use-toast';
import { EditFormHeader } from './edit-form/EditFormHeader';
import { BasicInfoFields } from './edit-form/BasicInfoFields';
import { PromptContentFields } from './edit-form/PromptContentFields';
import { MetadataFields } from './edit-form/MetadataFields';

interface EditedTemplateData {
  title: string;
  description: string;
  category: CategoryType;
  original_prompt: string;
  claude_response: string;
  effectiveness_rating: number;
  use_case_context: string;
  business_domain: string;
  is_template: boolean;
  is_active: boolean;
}

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
  const { toast } = useToast();
  const updateTemplateMutation = useUpdatePromptExample();
  
  console.log('✏️ PromptTemplateEditForm rendering for template:', template.id);
  
  const [editedTemplate, setEditedTemplate] = useState<EditedTemplateData>({
    title: template.title,
    description: template.description || '',
    category: template.category,
    original_prompt: template.original_prompt,
    claude_response: template.claude_response,
    effectiveness_rating: template.effectiveness_rating || 5,
    use_case_context: template.use_case_context || '',
    business_domain: template.business_domain || '',
    is_template: template.is_template,
    is_active: template.is_active
  });

  const handleSave = async () => {
    console.log('💾 Saving template changes for:', template.id);
    
    if (!editedTemplate.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
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
      await updateTemplateMutation.mutateAsync({
        id: template.id,
        updates: editedTemplate
      });
      
      console.log('✅ Template saved successfully');
      toast({
        title: "Success",
        description: "Prompt template updated successfully",
      });
      onSaveSuccess();
    } catch (error) {
      console.error('❌ Failed to update template:', error);
      toast({
        title: "Error",
        description: "Failed to update prompt template",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    console.log('❌ Canceling edit for template:', template.id);
    onCancel();
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <EditFormHeader
        promptTitle={template.title}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={updateTemplateMutation.isPending}
      />
      
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};
