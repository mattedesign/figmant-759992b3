
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';

const CATEGORIES = [
  { value: 'master', label: 'Master Analysis' },
  { value: 'competitor', label: 'Competitor Analysis' },
  { value: 'visual_hierarchy', label: 'Visual Hierarchy' },
  { value: 'copy_messaging', label: 'Copy & Messaging' },
  { value: 'ecommerce_revenue', label: 'E-commerce Revenue' },
  { value: 'ab_testing', label: 'A/B Testing' },
  { value: 'general', label: 'General Analysis' }
] as const;

interface CreatePromptFormProps {
  newPrompt: Partial<ClaudePromptExample>;
  setNewPrompt: (prompt: Partial<ClaudePromptExample>) => void;
  onSave: () => void;
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
        <CardTitle>Create New Prompt Example</CardTitle>
        <CardDescription>
          Add a new prompt template for improved Claude responses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={newPrompt.title}
              onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
              placeholder="e.g., Master UX Analysis Template"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={newPrompt.category}
              onValueChange={(value) => setNewPrompt({ ...newPrompt, category: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="use_case_context">Use Case Context</Label>
            <Input
              id="use_case_context"
              value={newPrompt.use_case_context}
              onChange={(e) => setNewPrompt({ ...newPrompt, use_case_context: e.target.value })}
              placeholder="e.g., E-commerce landing page analysis"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="business_domain">Business Domain</Label>
            <Input
              id="business_domain"
              value={newPrompt.business_domain}
              onChange={(e) => setNewPrompt({ ...newPrompt, business_domain: e.target.value })}
              placeholder="e.g., E-commerce, SaaS, Healthcare"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newPrompt.description}
            onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
            placeholder="Brief description of what this prompt is used for..."
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="original_prompt">Prompt Template *</Label>
          <Textarea
            id="original_prompt"
            value={newPrompt.original_prompt}
            onChange={(e) => setNewPrompt({ ...newPrompt, original_prompt: e.target.value })}
            placeholder="Enter the optimized prompt template here..."
            rows={6}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="claude_response">Expected Response Pattern *</Label>
          <Textarea
            id="claude_response"
            value={newPrompt.claude_response}
            onChange={(e) => setNewPrompt({ ...newPrompt, claude_response: e.target.value })}
            placeholder="Example of the type of response this prompt should generate..."
            rows={4}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Creating...' : 'Create Prompt'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
