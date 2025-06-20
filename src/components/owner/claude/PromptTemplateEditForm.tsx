
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ClaudePromptExample, useUpdatePromptExample } from '@/hooks/useClaudePromptExamples';
import { CategoryType } from '@/types/promptTypes';
import { useToast } from '@/hooks/use-toast';
import { ContextualField } from '@/types/figmant';
import { EditFormHeader } from './edit-form/EditFormHeader';
import { BasicInfoFields } from './edit-form/BasicInfoFields';
import { PromptContentFields } from './edit-form/PromptContentFields';
import { MetadataFields } from './edit-form/MetadataFields';
import { ContextualFieldsSection } from './ContextualFieldsSection';

interface EditedTemplateData {
  title: string;
  display_name: string;
  description: string;
  category: CategoryType;
  original_prompt: string;
  claude_response: string;
  effectiveness_rating: number;
  use_case_context: string;
  business_domain: string;
  is_template: boolean;
  is_active: boolean;
  metadata?: Record<string, any>;
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
    display_name: template.display_name || template.title,
    description: template.description || '',
    category: template.category,
    original_prompt: template.original_prompt,
    claude_response: template.claude_response,
    effectiveness_rating: template.effectiveness_rating || 5,
    use_case_context: template.use_case_context || '',
    business_domain: template.business_domain || '',
    is_template: template.is_template,
    is_active: template.is_active,
    metadata: template.metadata || {}
  });

  // Extract contextual fields from metadata with proper type checking
  const getContextualFieldsFromMetadata = (metadata: any): ContextualField[] => {
    console.log('🔍 STEP 1 DEBUG - getContextualFieldsFromMetadata called with:', metadata);
    
    if (!metadata || typeof metadata !== 'object') {
      console.log('🔍 STEP 1 DEBUG - No metadata or invalid metadata type');
      return [];
    }
    if (!Array.isArray(metadata.contextual_fields)) {
      console.log('🔍 STEP 1 DEBUG - contextual_fields is not an array:', metadata.contextual_fields);
      return [];
    }
    
    console.log('🔍 STEP 1 DEBUG - Found contextual_fields array:', metadata.contextual_fields);
    return metadata.contextual_fields as ContextualField[];
  };

  const [contextualFields, setContextualFields] = useState<ContextualField[]>(
    getContextualFieldsFromMetadata(template.metadata)
  );

  // STEP 1 DEBUG: Add debug logging
  useEffect(() => {
    console.log('🔍 STEP 1 DEBUG - ContextualFields State:', contextualFields);
    console.log('🔍 STEP 1 DEBUG - Template Metadata:', template.metadata);
    console.log('🔍 STEP 1 DEBUG - Component Rendering:', {
      templateId: template.id,
      hasContextualFields: contextualFields.length > 0,
      metadataExists: !!template.metadata
    });

    // STEP 2 DEBUG: Metadata analysis
    const debugMetadata = () => {
      console.log('🔍 METADATA ANALYSIS:');
      console.log('Raw metadata:', template.metadata);
      
      if (template.metadata && typeof template.metadata === 'object') {
        const metadata = template.metadata as Record<string, any>;
        console.log('Metadata keys:', Object.keys(metadata));
        console.log('contextual_fields exists:', 'contextual_fields' in metadata);
        console.log('contextual_fields value:', metadata.contextual_fields);
        console.log('contextual_fields is array:', Array.isArray(metadata.contextual_fields));
      }
    };

    debugMetadata();
  }, [template, contextualFields]);

  const handleContextualFieldsUpdate = (fields: ContextualField[]) => {
    console.log('🔍 STEP 1 DEBUG - handleContextualFieldsUpdate called with:', fields);
    setContextualFields(fields);
    setEditedTemplate(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        contextual_fields: fields
      }
    }));
  };

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

    if (!editedTemplate.display_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Display name is required",
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
      const updateData = {
        ...editedTemplate,
        metadata: {
          ...editedTemplate.metadata,
          contextual_fields: contextualFields
        }
      };

      await updateTemplateMutation.mutateAsync({
        id: template.id,
        updates: updateData
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

  // STEP 1 DEBUG: Add render logging
  console.log('🔍 EDIT FORM RENDERING:', template.id);

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <EditFormHeader
        promptTitle={template.title}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={updateTemplateMutation.isPending}
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

        {/* STEP 1 DEBUG: Make contextual fields visible */}
        <div className="border-8 border-red-500 bg-yellow-100 p-6 m-4">
          <div className="bg-red-600 text-white p-2 mb-4 rounded">
            🚨 DEBUG: CONTEXTUAL FIELDS SECTION - THIS SHOULD BE VISIBLE
          </div>
          <ContextualFieldsSection
            contextualFields={contextualFields}
            onUpdateFields={handleContextualFieldsUpdate}
          />
          
          {/* Debug data display */}
          <div className="mt-4 bg-white p-3 rounded border-2 border-blue-500">
            <h4 className="font-bold text-blue-700">Debug Data:</h4>
            <p><strong>Fields Count:</strong> {contextualFields.length}</p>
            <p><strong>Template ID:</strong> {template.id}</p>
            <p><strong>Has Metadata:</strong> {template.metadata ? 'Yes' : 'No'}</p>
            <pre className="text-xs mt-2 bg-gray-100 p-2 rounded max-h-32 overflow-auto">
              {JSON.stringify(contextualFields, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
