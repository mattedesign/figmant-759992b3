
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface PromptEditDrawerProps {
  prompt: ClaudePromptExample;
  isOpen: boolean;
  onClose: () => void;
}

export const PromptEditDrawer: React.FC<PromptEditDrawerProps> = ({
  prompt,
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const updatePromptMutation = useUpdatePromptExample();
  
  console.log('🎨 PromptEditDrawer rendering:', { 
    promptId: prompt.id, 
    isOpen, 
    promptTitle: prompt.title 
  });
  
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

  // Reset form when prompt changes or drawer opens
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 Resetting form data for prompt:', prompt.id);
      setEditedPrompt({
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
    }
  }, [prompt, isOpen]);

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
      onClose();
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
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    console.log('🔄 Drawer open state changing:', open);
    if (!open) {
      onClose();
    }
  };

  console.log('🎨 Drawer component will render with isOpen:', isOpen);

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Edit Prompt: {prompt.title}</DrawerTitle>
          <DrawerDescription>
            Make changes to your prompt template below.
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-4 space-y-4 overflow-y-auto">
          <div className="flex justify-end space-x-2 mb-4">
            <Button onClick={handleSave} disabled={updatePromptMutation.isPending}>
              <Save className="h-4 w-4 mr-1" />
              {updatePromptMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedPrompt.title}
              onChange={(e) => setEditedPrompt({ ...editedPrompt, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={editedPrompt.description}
              onChange={(e) => setEditedPrompt({ ...editedPrompt, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={editedPrompt.category}
              onValueChange={(value: CategoryType) => setEditedPrompt({ ...editedPrompt, category: value })}
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={editedPrompt.original_prompt}
              onChange={(e) => setEditedPrompt({ ...editedPrompt, original_prompt: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="response">Expected Response</Label>
            <Textarea
              id="response"
              value={editedPrompt.claude_response}
              onChange={(e) => setEditedPrompt({ ...editedPrompt, claude_response: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Effectiveness Rating (1-5)</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={editedPrompt.effectiveness_rating}
                onChange={(e) => setEditedPrompt({ ...editedPrompt, effectiveness_rating: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Business Domain</Label>
              <Input
                id="domain"
                value={editedPrompt.business_domain}
                onChange={(e) => setEditedPrompt({ ...editedPrompt, business_domain: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Use Case Context</Label>
            <Input
              id="context"
              value={editedPrompt.use_case_context}
              onChange={(e) => setEditedPrompt({ ...editedPrompt, use_case_context: e.target.value })}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
