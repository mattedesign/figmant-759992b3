
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, X } from 'lucide-react';
import { useUpdatePromptExample, ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { CategoryType, CATEGORY_OPTIONS } from '@/types/promptTypes';
import { ContextualField } from '@/types/figmant';
import { ContextualFieldsBuilder } from './ContextualFieldsBuilder';
import { useToast } from '@/hooks/use-toast';

interface EditPromptTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  template: ClaudePromptExample;
}

export const EditPromptTemplateDialog: React.FC<EditPromptTemplateDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  template
}) => {
  const { toast } = useToast();
  const updatePromptMutation = useUpdatePromptExample();
  
  const [formData, setFormData] = useState({
    title: '',
    display_name: '',
    description: '',
    category: 'general' as CategoryType,
    original_prompt: '',
    claude_response: '',
    use_case_context: '',
    business_domain: '',
    effectiveness_rating: 5,
    credit_cost: 3,
    is_template: true,
    is_active: true
  });

  const [contextualFields, setContextualFields] = useState<ContextualField[]>([]);

  // Initialize form data when template changes
  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title,
        display_name: template.display_name || template.title,
        description: template.description || '',
        category: template.category,
        original_prompt: template.original_prompt,
        claude_response: template.claude_response,
        use_case_context: template.use_case_context || '',
        business_domain: template.business_domain || '',
        effectiveness_rating: template.effectiveness_rating || 5,
        credit_cost: template.credit_cost || 3,
        is_template: template.is_template,
        is_active: template.is_active
      });

      // Initialize contextual fields
      if (template.metadata && 
          typeof template.metadata === 'object' && 
          template.metadata !== null &&
          Array.isArray((template.metadata as any).contextual_fields)) {
        setContextualFields((template.metadata as any).contextual_fields);
      } else {
        setContextualFields([]);
      }
    }
  }, [template]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.original_prompt.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and prompt template are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const updateData = {
        ...formData,
        display_name: formData.display_name || formData.title,
        metadata: {
          ...template.metadata,
          contextual_fields: contextualFields
        }
      };

      await updatePromptMutation.mutateAsync({
        id: template.id,
        updates: updateData
      });
      
      toast({
        title: "Success",
        description: "Prompt template updated successfully",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Failed to update template:', error);
      toast({
        title: "Error",
        description: "Failed to update prompt template",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Prompt Template</DialogTitle>
          <DialogDescription>
            Update the template configuration and dynamic form fields
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto px-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Template title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="text-lg font-medium"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      placeholder="User-friendly display name"
                      value={formData.display_name}
                      onChange={(e) => handleInputChange('display_name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value as CategoryType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="credit_cost">Credit Cost per Analysis</Label>
                    <Input
                      id="credit_cost"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.credit_cost}
                      onChange={(e) => handleInputChange('credit_cost', parseInt(e.target.value) || 3)}
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the template's purpose and use case"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Prompt Content Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prompt Content</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="original_prompt">Prompt Template *</Label>
                    <Textarea
                      id="original_prompt"
                      placeholder="Enter the prompt template text. Use {variableName} for dynamic variables."
                      value={formData.original_prompt}
                      onChange={(e) => handleInputChange('original_prompt', e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500">
                      Use curly braces for variables: {"{industry}"}, {"{targetAudience}"}, etc.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="claude_response">Expected Response Format</Label>
                    <Textarea
                      id="claude_response"
                      placeholder="Describe the expected response format or provide an example response"
                      value={formData.claude_response}
                      onChange={(e) => handleInputChange('claude_response', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contextual Fields Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dynamic Form Fields</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Configure dynamic form fields that will be shown to users when they select this template
                </p>
                <ContextualFieldsBuilder
                  fields={contextualFields}
                  onChange={setContextualFields}
                />
              </div>
            </div>

            <Separator />

            {/* Template Metadata Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="use_case_context">Use Case Context</Label>
                    <Input
                      id="use_case_context"
                      placeholder="When to use this template"
                      value={formData.use_case_context}
                      onChange={(e) => handleInputChange('use_case_context', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business_domain">Business Domain</Label>
                    <Input
                      id="business_domain"
                      placeholder="E.g., E-commerce, SaaS, Healthcare"
                      value={formData.business_domain}
                      onChange={(e) => handleInputChange('business_domain', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="effectiveness_rating">Effectiveness Rating (1-10)</Label>
                    <Input
                      id="effectiveness_rating"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.effectiveness_rating}
                      onChange={(e) => handleInputChange('effectiveness_rating', parseInt(e.target.value) || 5)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_template">Reusable Template</Label>
                      <Switch
                        id="is_template"
                        checked={formData.is_template}
                        onCheckedChange={(checked) => handleInputChange('is_template', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_active">Active Status</Label>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={updatePromptMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {updatePromptMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
