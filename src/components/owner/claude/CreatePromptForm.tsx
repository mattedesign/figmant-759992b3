
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreatePromptExample } from '@/hooks/useClaudePromptExamples';
import { CategoryType, CATEGORY_OPTIONS } from '@/types/promptTypes';
import { ContextualField } from '@/types/figmant';
import { ContextualFieldsSection } from './ContextualFieldsSection';
import { useToast } from '@/hooks/use-toast';

interface CreatePromptFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreatePromptForm: React.FC<CreatePromptFormProps> = ({
  onCancel,
  onSuccess
}) => {
  const { toast } = useToast();
  const createPromptMutation = useCreatePromptExample();
  
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    display_name: '',
    description: '',
    category: 'general' as CategoryType,
    original_prompt: '',
    claude_response: '',
    use_case_context: '',
    business_domain: '',
    effectiveness_rating: 5,
    is_template: true,
    is_active: true,
    credit_cost: 3
  });

  const [contextualFields, setContextualFields] = useState<ContextualField[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPrompt.title.trim() || !newPrompt.original_prompt.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and prompt template are required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Include contextual fields in metadata
      const promptData = {
        ...newPrompt,
        metadata: {
          contextual_fields: contextualFields
        }
      };

      await createPromptMutation.mutateAsync(promptData);
      
      toast({
        title: "Success",
        description: "Prompt template created successfully",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Failed to create template:', error);
      toast({
        title: "Error",
        description: "Failed to create prompt template",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Prompt Template</CardTitle>
        <CardDescription>
          Create a reusable prompt template with dynamic form fields
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Template title"
                value={newPrompt.title}
                onChange={(e) => setNewPrompt(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                placeholder="User-friendly display name"
                value={newPrompt.display_name}
                onChange={(e) => setNewPrompt(prev => ({ ...prev, display_name: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newPrompt.category}
                onValueChange={(value) => setNewPrompt(prev => ({ ...prev, category: value as CategoryType }))}
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
            
            <div>
              <Label htmlFor="credit_cost">Credit Cost per Analysis</Label>
              <Input
                id="credit_cost"
                type="number"
                min="1"
                max="100"
                placeholder="3"
                value={newPrompt.credit_cost}
                onChange={(e) => setNewPrompt(prev => ({ 
                  ...prev, 
                  credit_cost: parseInt(e.target.value) || 3 
                }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the template's purpose"
              value={newPrompt.description}
              onChange={(e) => setNewPrompt(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>

          {/* Prompt Content */}
          <div>
            <Label htmlFor="original_prompt">Prompt Template *</Label>
            <Textarea
              id="original_prompt"
              placeholder="Enter the prompt template text"
              value={newPrompt.original_prompt}
              onChange={(e) => setNewPrompt(prev => ({ ...prev, original_prompt: e.target.value }))}
              rows={6}
              className="font-mono"
            />
          </div>

          <div>
            <Label htmlFor="claude_response">Expected Response Format</Label>
            <Textarea
              id="claude_response"
              placeholder="Describe the expected response format or provide an example"
              value={newPrompt.claude_response}
              onChange={(e) => setNewPrompt(prev => ({ ...prev, claude_response: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Contextual Fields Section */}
          <div className="border-t pt-6">
            <ContextualFieldsSection
              contextualFields={contextualFields}
              onUpdateFields={setContextualFields}
            />
          </div>

          {/* Metadata Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="use_case_context">Use Case Context</Label>
              <Input
                id="use_case_context"
                placeholder="When to use this template"
                value={newPrompt.use_case_context}
                onChange={(e) => setNewPrompt(prev => ({ ...prev, use_case_context: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="business_domain">Business Domain</Label>
              <Input
                id="business_domain"
                placeholder="E.g., E-commerce, SaaS, Healthcare"
                value={newPrompt.business_domain}
                onChange={(e) => setNewPrompt(prev => ({ ...prev, business_domain: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="effectiveness_rating">Effectiveness Rating (1-10)</Label>
            <Input
              id="effectiveness_rating"
              type="number"
              min="1"
              max="10"
              placeholder="5"
              value={newPrompt.effectiveness_rating}
              onChange={(e) => setNewPrompt(prev => ({ 
                ...prev, 
                effectiveness_rating: parseInt(e.target.value) || 5 
              }))}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-2">
            <Button type="submit" disabled={createPromptMutation.isPending}>
              {createPromptMutation.isPending ? 'Creating...' : 'Create Template'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
