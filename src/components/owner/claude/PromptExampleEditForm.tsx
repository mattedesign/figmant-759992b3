
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X } from 'lucide-react';
import { ClaudePromptExample, useUpdatePromptExample } from '@/hooks/useClaudePromptExamples';
import { CategoryType, CATEGORY_OPTIONS } from '@/types/promptTypes';
import { useToast } from '@/hooks/use-toast';

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
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">Edit Prompt: {prompt.title}</span>
          <div className="flex items-center gap-2">
            <Button 
              size="sm"
              onClick={handleSave} 
              disabled={updatePromptMutation.isPending}
              className="h-8"
            >
              <Save className="h-4 w-4 mr-1" />
              {updatePromptMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              size="sm"
              variant="outline" 
              onClick={handleCancel}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={editedPrompt.title}
              onChange={(e) => setEditedPrompt({ ...editedPrompt, title: e.target.value })}
              placeholder="Enter prompt title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select
              value={editedPrompt.category}
              onValueChange={(value: CategoryType) => setEditedPrompt({ ...editedPrompt, category: value })}
            >
              <SelectTrigger id="edit-category">
                <SelectValue />
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-description">Description</Label>
          <Input
            id="edit-description"
            value={editedPrompt.description}
            onChange={(e) => setEditedPrompt({ ...editedPrompt, description: e.target.value })}
            placeholder="Brief description of the prompt"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-prompt">Prompt Text *</Label>
          <Textarea
            id="edit-prompt"
            value={editedPrompt.original_prompt}
            onChange={(e) => setEditedPrompt({ ...editedPrompt, original_prompt: e.target.value })}
            rows={6}
            placeholder="Enter the prompt text"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-response">Expected Response</Label>
          <Textarea
            id="edit-response"
            value={editedPrompt.claude_response}
            onChange={(e) => setEditedPrompt({ ...editedPrompt, claude_response: e.target.value })}
            rows={4}
            placeholder="Describe the expected response format"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-rating">Effectiveness Rating (1-5)</Label>
            <Input
              id="edit-rating"
              type="number"
              min="1"
              max="5"
              value={editedPrompt.effectiveness_rating}
              onChange={(e) => setEditedPrompt({ ...editedPrompt, effectiveness_rating: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-domain">Business Domain</Label>
            <Input
              id="edit-domain"
              value={editedPrompt.business_domain}
              onChange={(e) => setEditedPrompt({ ...editedPrompt, business_domain: e.target.value })}
              placeholder="e.g., E-commerce, SaaS, Healthcare"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-context">Use Case Context</Label>
          <Input
            id="edit-context"
            value={editedPrompt.use_case_context}
            onChange={(e) => setEditedPrompt({ ...editedPrompt, use_case_context: e.target.value })}
            placeholder="When and how this prompt should be used"
          />
        </div>
      </CardContent>
    </Card>
  );
};
