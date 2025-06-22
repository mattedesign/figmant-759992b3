
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CATEGORY_OPTIONS } from '@/types/promptTypes';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';
import { ContextualFieldsBuilder, ContextualField } from './ContextualFieldsBuilder';
import { Loader2, Save } from 'lucide-react';

interface EditPromptTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  onSave: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export const EditPromptTemplateDialog: React.FC<EditPromptTemplateDialogProps> = ({
  isOpen,
  onClose,
  templateId,
  onSave,
  isLoading = false
}) => {
  const { data: templates = [] } = useClaudePromptExamples();
  const [formData, setFormData] = useState({
    title: '',
    display_name: '',
    description: '',
    category: 'general' as any,
    original_prompt: '',
    effectiveness_rating: 0,
    is_template: false,
    is_active: true,
    credit_cost: 3,
    metadata: {}
  });
  const [contextualFields, setContextualFields] = useState<ContextualField[]>([]);
  const [isFormLoading, setIsFormLoading] = useState(true);

  // Load template data when dialog opens
  useEffect(() => {
    console.log('Dialog effect triggered:', { isOpen, templateId, templatesLength: templates.length });
    
    if (isOpen && templateId) {
      setIsFormLoading(true);
      const template = templates.find(t => t.id === templateId);
      
      console.log('Found template for editing:', template);
      
      if (template) {
        setFormData({
          title: template.title || '',
          display_name: template.display_name || template.title || '',
          description: template.description || '',
          category: template.category || 'general',
          original_prompt: template.original_prompt || '',
          effectiveness_rating: template.effectiveness_rating || 0,
          is_template: template.is_template || false,
          is_active: template.is_active !== false,
          credit_cost: template.credit_cost || 3,
          metadata: template.metadata || {}
        });

        // Initialize contextual fields
        if (template.metadata && 
            typeof template.metadata === 'object' && 
            template.metadata !== null &&
            Array.isArray((template.metadata as any).contextual_fields)) {
          const fields = (template.metadata as any).contextual_fields;
          console.log('Loading contextual fields:', fields);
          setContextualFields(fields);
        } else {
          console.log('No contextual fields found, using defaults for category:', template.category);
          const defaultFields = getDefaultFieldsForCategory(template.category);
          setContextualFields(defaultFields);
        }
        
        console.log('Form data loaded:', formData);
      } else {
        console.warn('Template not found in data:', templateId);
      }
      setIsFormLoading(false);
    }
  }, [isOpen, templateId, templates]);

  const getDefaultFieldsForCategory = (category: string): ContextualField[] => {
    console.log('Getting default fields for category:', category);
    
    switch (category) {
      case 'competitor':
        return [
          {
            id: 'competitor_urls',
            label: 'Competitor URLs',
            type: 'textarea',
            placeholder: 'Enter competitor website URLs (one per line)',
            required: true,
            description: 'Provide URLs of competitor websites to analyze'
          }
        ];
      case 'ecommerce_revenue':
        return [
          {
            id: 'current_metrics',
            label: 'Current Conversion Rate',
            type: 'number',
            placeholder: '2.5',
            required: false,
            description: 'Current conversion rate percentage'
          },
          {
            id: 'revenue_goals',
            label: 'Revenue Goals',
            type: 'textarea',
            placeholder: 'Describe your revenue goals and targets',
            required: false,
            description: 'What revenue improvements are you targeting?'
          }
        ];
      case 'ab_testing':
        return [
          {
            id: 'test_hypothesis',
            label: 'Test Hypothesis',
            type: 'textarea',
            placeholder: 'Describe what you want to test and expected outcome',
            required: true,
            description: 'Clear hypothesis for your A/B test'
          }
        ];
      default:
        return [];
    }
  };

  const handleInputChange = (field: string, value: any) => {
    console.log('Form field changed:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    console.log('Save button clicked, form data:', formData);
    console.log('Contextual fields:', contextualFields);
    
    try {
      // Merge contextual fields into metadata
      const updatedMetadata = {
        ...formData.metadata,
        contextual_fields: contextualFields
      };

      const dataToSave = {
        ...formData,
        metadata: updatedMetadata
      };

      console.log('Saving template with data:', dataToSave);
      await onSave(dataToSave);
      console.log('Template saved successfully');
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleClose = () => {
    console.log('Dialog closing');
    onClose();
    // Reset form data
    setFormData({
      title: '',
      display_name: '',
      description: '',
      category: 'general',
      original_prompt: '',
      effectiveness_rating: 0,
      is_template: false,
      is_active: true,
      credit_cost: 3,
      metadata: {}
    });
    setContextualFields([]);
  };

  console.log('Dialog render state:', { isOpen, isFormLoading, templateId });

  if (isFormLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading template...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Edit Prompt Template</span>
            <Badge variant="secondary">Edit Mode</Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto px-1 max-h-[70vh]">
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter template title"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  placeholder="Enter display name"
                  className="w-full"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter template description"
                rows={3}
                className="w-full resize-none"
              />
            </div>

            {/* Category and Settings */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    handleInputChange('category', value);
                    // Reset contextual fields when category changes
                    const defaultFields = getDefaultFieldsForCategory(value);
                    setContextualFields(defaultFields);
                  }}
                >
                  <SelectTrigger className="w-full">
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
                <Label htmlFor="effectiveness_rating">Effectiveness Rating</Label>
                <Input
                  id="effectiveness_rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.effectiveness_rating}
                  onChange={(e) => handleInputChange('effectiveness_rating', parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit_cost">Credit Cost</Label>
                <Input
                  id="credit_cost"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.credit_cost}
                  onChange={(e) => handleInputChange('credit_cost', parseInt(e.target.value) || 3)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Prompt Content */}
            <div className="space-y-2">
              <Label htmlFor="original_prompt">Prompt Template</Label>
              <Textarea
                id="original_prompt"
                value={formData.original_prompt}
                onChange={(e) => handleInputChange('original_prompt', e.target.value)}
                placeholder="Enter the prompt template content"
                rows={8}
                className="font-mono w-full resize-none"
              />
            </div>

            {/* Dynamic Form Fields Section */}
            <div className="space-y-4">
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

            {/* Toggle Settings */}
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_template"
                  checked={formData.is_template}
                  onCheckedChange={(checked) => handleInputChange('is_template', checked)}
                />
                <Label htmlFor="is_template" className="cursor-pointer">Is Template</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
