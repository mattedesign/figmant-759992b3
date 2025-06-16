
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
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Edit Prompt: {prompt.title}</span>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm"
              onClick={handleSave} 
              disabled={updatePromptMutation.isPending}
            >
              <Save className="h-4 w-4 mr-1" />
              {updatePromptMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              size="sm"
              variant="outline" 
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={editedPrompt.title}
              onChange={(e) => setEditedPrompt({ ...editedPrompt, title: e.target.value })}
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-prompt">Prompt</Label>
          <Textarea
            id="edit-prompt"
            value={editedPrompt.original_prompt}
            onChange={(e) => setEditedPrompt({ ...editedPrompt, original_prompt: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-response">Expected Response</Label>
          <Textarea
            id="edit-response"
            value={editedPrompt.claude_response}
            onChange={(e) => setEditedPrompt({ ...editedPrompt, claude_response: e.target.value })}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-rating">Effectiveness Rating (1-5)</Label>
            <Input
              id="edit-rating"
              type="number"
              min="1"
              max="5"
              value={editedPrompt.effectiveness_rating}
              onChange={(e) => setEditedPrompt({ ...editedPrompt, effectiveness_rating: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-domain">Business Domain</Label>
            <Input
              id="edit-domain"
              value={editedPrompt.business_domain}
              onChange={(e) => setEditedPrompt({ ...editedPrompt, business_domain: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-context">Use Case Context</Label>
          <Input
            id="edit-context"
            value={editedPrompt.use_case_context}
            onChange={(e) => setEditedPrompt({ ...editedPrompt, use_case_context: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
};
