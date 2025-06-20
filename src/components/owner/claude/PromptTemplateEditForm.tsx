
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

  // Extract contextual fields from metadata with proper type checking and defaults
  const getContextualFieldsFromMetadata = (metadata: any): ContextualField[] => {
    if (!metadata || typeof metadata !== 'object') {
      return getDefaultContextualFields(template.category);
    }
    if (!Array.isArray(metadata.contextual_fields)) {
      return getDefaultContextualFields(template.category);
    }
    
    const fields = metadata.contextual_fields as ContextualField[];
    return fields.length > 0 ? fields : getDefaultContextualFields(template.category);
  };

  // Determine if a template should have contextual fields based on category
  const shouldHaveContextualFields = (category: string): boolean => {
    return ['competitor', 'ecommerce_revenue', 'ab_testing', 'copy_messaging', 'visual_hierarchy'].includes(category);
  };

  // Provide default contextual fields for categories that should have them
  const getDefaultContextualFields = (category: string): ContextualField[] => {
    if (!shouldHaveContextualFields(category)) {
      return [];
    }

    switch (category) {
      case 'competitor':
        return [
          {
            id: 'competitor_urls',
            label: 'Competitor URLs',
            type: 'textarea',
            placeholder: 'Enter competitor website URLs (one per line)',
            required: true,
            description: 'List of competitor websites to analyze'
          },
          {
            id: 'industry_focus',
            label: 'Industry Focus',
            type: 'text',
            placeholder: 'e.g., SaaS, E-commerce, Healthcare',
            required: false,
            description: 'Specific industry context for analysis'
          }
        ];
      case 'ecommerce_revenue':
        return [
          {
            id: 'current_conversion_rate',
            label: 'Current Conversion Rate (%)',
            type: 'number',
            placeholder: '2.5',
            required: false,
            description: 'Current website conversion rate for baseline comparison'
          },
          {
            id: 'target_audience',
            label: 'Target Audience',
            type: 'text',
            placeholder: 'Demographics and psychographics',
            required: false,
            description: 'Description of target customer segment'
          }
        ];
      case 'ab_testing':
        return [
          {
            id: 'test_hypothesis',
            label: 'Test Hypothesis',
            type: 'textarea',
            placeholder: 'We believe that changing X will improve Y because...',
            required: true,
            description: 'Clear hypothesis for the A/B test'
          },
          {
            id: 'success_metric',
            label: 'Primary Success Metric',
            type: 'select',
            placeholder: 'Select metric',
            required: true,
            options: ['Conversion Rate', 'Click-through Rate', 'Time on Page', 'Bounce Rate', 'Revenue per Visitor'],
            description: 'Main metric to measure test success'
          }
        ];
      case 'copy_messaging':
        return [
          {
            id: 'brand_voice',
            label: 'Brand Voice',
            type: 'select',
            placeholder: 'Select tone',
            required: false,
            options: ['Professional', 'Friendly', 'Casual', 'Authoritative', 'Playful', 'Urgent'],
            description: 'Desired tone and voice for messaging'
          },
          {
            id: 'key_benefits',
            label: 'Key Benefits to Highlight',
            type: 'textarea',
            placeholder: 'List main value propositions',
            required: false,
            description: 'Primary benefits or features to emphasize'
          }
        ];
      case 'visual_hierarchy':
        return [
          {
            id: 'primary_action',
            label: 'Primary Call-to-Action',
            type: 'text',
            placeholder: 'Sign Up, Buy Now, Learn More, etc.',
            required: false,
            description: 'Main action you want users to take'
          },
          {
            id: 'content_priority',
            label: 'Content Priority Order',
            type: 'textarea',
            placeholder: 'List content elements in order of importance',
            required: false,
            description: 'Hierarchy of information importance'
          }
        ];
      default:
        return [];
    }
  };

  const [contextualFields, setContextualFields] = useState<ContextualField[]>(
    getContextualFieldsFromMetadata(template.metadata)
  );

  // Update contextual fields when template changes
  useEffect(() => {
    const fields = getContextualFieldsFromMetadata(template.metadata);
    setContextualFields(fields);
  }, [template.metadata, template.category]);

  const handleContextualFieldsUpdate = (fields: ContextualField[]) => {
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
      
      toast({
        title: "Success",
        description: "Prompt template updated successfully",
      });
      onSaveSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update prompt template",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
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
