
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { CATEGORY_OPTIONS } from '@/types/promptTypes';
import { CreditCard } from 'lucide-react';

interface CreatePromptFormProps {
  newPrompt: Partial<ClaudePromptExample>;
  setNewPrompt: React.Dispatch<React.SetStateAction<Partial<ClaudePromptExample>>>;
  onSave: () => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export const CreatePromptForm: React.FC<CreatePromptFormProps> = ({
  newPrompt,
  setNewPrompt,
  onSave,
  onCancel,
  isSaving
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Prompt Template</CardTitle>
        <CardDescription>
          Add a new AI prompt template that users can select for their analyses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Template Title"
              value={newPrompt.title || ''}
              onChange={(e) => setNewPrompt(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              placeholder="User-friendly display name"
              value={newPrompt.display_name || ''}
              onChange={(e) => setNewPrompt(prev => ({ ...prev, display_name: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={newPrompt.category || ''}
              onValueChange={(value) => setNewPrompt(prev => ({ ...prev, category: value as any }))}
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
            <Label htmlFor="credit_cost" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Credit Cost per Analysis
            </Label>
            <Input
              id="credit_cost"
              type="number"
              min="1"
              max="100"
              placeholder="3"
              value={newPrompt.credit_cost || 3}
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
            placeholder="Brief description of what this template analyzes"
            value={newPrompt.description || ''}
            onChange={(e) => setNewPrompt(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="use_case_context">Use Case Context</Label>
            <Input
              id="use_case_context"
              placeholder="e.g., E-commerce checkout optimization"
              value={newPrompt.use_case_context || ''}
              onChange={(e) => setNewPrompt(prev => ({ ...prev, use_case_context: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="business_domain">Business Domain</Label>
            <Input
              id="business_domain"
              placeholder="e.g., E-commerce, SaaS, Healthcare"
              value={newPrompt.business_domain || ''}
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
            value={newPrompt.effectiveness_rating || 5}
            onChange={(e) => setNewPrompt(prev => ({ 
              ...prev, 
              effectiveness_rating: parseInt(e.target.value) || 5 
            }))}
          />
        </div>

        <div>
          <Label htmlFor="original_prompt">Prompt Template</Label>
          <Textarea
            id="original_prompt"
            placeholder="Enter the AI prompt template. Use variables like {projectName} for dynamic content."
            value={newPrompt.original_prompt || ''}
            onChange={(e) => setNewPrompt(prev => ({ ...prev, original_prompt: e.target.value }))}
            rows={6}
            className="font-mono"
          />
        </div>

        <div>
          <Label htmlFor="claude_response">Expected Response Format</Label>
          <Textarea
            id="claude_response"
            placeholder="Describe the expected response format or provide an example response"
            value={newPrompt.claude_response || ''}
            onChange={(e) => setNewPrompt(prev => ({ ...prev, claude_response: e.target.value }))}
            rows={4}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Creating...' : 'Create Template'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
