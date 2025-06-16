
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ClaudePromptExample, useUpdatePromptExample } from '@/hooks/useClaudePromptExamples';
import { CategoryType } from '@/types/promptTypes';
import { useToast } from '@/hooks/use-toast';
import { EditFormHeader } from './edit-form/EditFormHeader';
import { BasicInfoFields } from './edit-form/BasicInfoFields';
import { PromptContentFields } from './edit-form/PromptContentFields';
import { MetadataFields } from './edit-form/MetadataFields';

interface EditedPromptData {
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

interface PromptExampleEditFormProps {
  prompt: ClaudePromptExample;
  onCancel: () => void;
  onSaveSuccess: () => void;
}

export const PromptExampleEditForm: React.FC<PromptExampleEditFormProps> = ({
  prompt,
  onCancel,
  onSaveSuccess
}) => {
  const { toast } = useToast();
  const updatePromptMutation = useUpdatePromptExample();
  
  console.log('✏️ PromptExampleEditForm rendering for prompt:', prompt.id);
  
  const [editedPrompt, setEditedPrompt] = useState<EditedPromptData>({
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
    console.log('💾 Saving prompt changes for:', prompt.id);
    
    if (!editedPrompt.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!editedPrompt.original_prompt.trim()) {
      toast({
        title: "Validation Error", 
        description: "Prompt text is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await updatePromptMutation.mutateAsync({
        id: prompt.id,
        updates: editedPrompt
      });
      
      console.log('✅ Prompt saved successfully');
      toast({
        title: "Success",
        description: "Prompt updated successfully",
      });
      onSaveSuccess();
    } catch (error) {
      console.error('❌ Failed to update prompt:', error);
      toast({
        title: "Error",
        description: "Failed to update prompt",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    console.log('❌ Canceling edit for prompt:', prompt.id);
    onCancel();
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <EditFormHeader
        promptTitle={prompt.title}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={updatePromptMutation.isPending}
      />
      
      <CardContent className="space-y-4">
        <BasicInfoFields
          editedPrompt={editedPrompt}
          setEditedPrompt={setEditedPrompt}
        />
        
        <PromptContentFields
          editedPrompt={editedPrompt}
          setEditedPrompt={setEditedPrompt}
        />
        
        <MetadataFields
          editedPrompt={editedPrompt}
          setEditedPrompt={setEditedPrompt}
        />
      </CardContent>
    </Card>
  );
};
