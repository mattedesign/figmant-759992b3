
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Star, Copy, Trash2 } from 'lucide-react';
import { useClaudePromptExamples, useUpdatePromptExample } from '@/hooks/useClaudePromptExamples';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { CATEGORY_OPTIONS } from '@/types/promptTypes';
import { EditPromptTemplateDialog } from './EditPromptTemplateDialog';
import { useToast } from '@/hooks/use-toast';

export const EnhancedPromptTemplateManager = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data: claudeExamples = [] } = useClaudePromptExamples();
  const { data: figmantTemplates = [] } = useFigmantPromptTemplates();
  const updatePromptMutation = useUpdatePromptExample();
  const { toast } = useToast();

  // Combine both data sources
  const allTemplates = [
    ...claudeExamples.map(example => ({
      id: example.id,
      title: example.title,
      displayName: example.display_name,
      description: example.description || 'No description available',
      category: example.category,
      prompt: example.original_prompt,
      rating: example.effectiveness_rating,
      isTemplate: example.is_template,
      isActive: example.is_active,
      metadata: example.metadata || {},
      creditCost: example.credit_cost || 3
    })),
    ...figmantTemplates.map(template => ({
      id: template.id,
      title: template.title,
      displayName: template.displayName,
      description: template.description || 'No description available',
      category: template.category,
      prompt: template.prompt,
      rating: undefined,
      isTemplate: true,
      isActive: template.isActive,
      metadata: template.metadata || {},
      creditCost: 3
    }))
  ];

  const getCategoryLabel = (category: string) => {
    const option = CATEGORY_OPTIONS.find(opt => opt.value === category);
    return option ? option.label : category;
  };

  const handleEditTemplate = (templateId: string) => {
    console.log('Edit button clicked for template:', templateId);
    setSelectedTemplateId(templateId);
    setIsEditDialogOpen(true);
    console.log('Dialog should now be open, selectedTemplateId:', templateId);
  };

  const handleCloseEditDialog = () => {
    console.log('Closing edit dialog');
    setIsEditDialogOpen(false);
    setSelectedTemplateId(null);
  };

  const handleSaveTemplate = async (updatedData: any) => {
    if (!selectedTemplateId) {
      console.error('No template ID selected for saving');
      return;
    }

    console.log('Saving template updates:', { selectedTemplateId, updatedData });
    
    try {
      await updatePromptMutation.mutateAsync({
        id: selectedTemplateId,
        updates: updatedData
      });
      
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
      
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      });
    }
  };

  const handleCopyTemplate = (template: any) => {
    navigator.clipboard.writeText(template.prompt);
    toast({
      title: "Copied",
      description: "Template prompt copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prompt Templates</h2>
          <p className="text-muted-foreground">
            Manage and edit analysis prompt templates
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {allTemplates.map((template) => (
          <Card key={template.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <CardTitle className="text-lg">{template.displayName}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{getCategoryLabel(template.category)}</Badge>
                      {template.isTemplate && <Badge>Template</Badge>}
                      {template.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">{template.rating}</span>
                        </div>
                      )}
                      <Badge variant="secondary">
                        {template.creditCost} {template.creditCost === 1 ? 'credit' : 'credits'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopyTemplate(template)}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditTemplate(template.id)}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{template.description}</p>
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-sm font-mono line-clamp-3">{template.prompt}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplateId && (
        <EditPromptTemplateDialog
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          templateId={selectedTemplateId}
          onSave={handleSaveTemplate}
          isLoading={updatePromptMutation.isPending}
        />
      )}
    </div>
  );
};
