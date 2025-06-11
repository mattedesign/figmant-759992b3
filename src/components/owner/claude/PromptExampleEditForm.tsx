
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { CategoryType, CATEGORY_OPTIONS } from '@/types/promptTypes';

interface EditedPromptData {
  title: string;
  description: string;
  category: string;
  original_prompt: string;
  claude_response: string;
  effectiveness_rating: number;
  use_case_context: string;
  business_domain: string;
  is_template: boolean;
  is_active: boolean;
}

interface PromptExampleEditFormProps {
  editedPrompt: EditedPromptData;
  setEditedPrompt: (prompt: EditedPromptData) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const PromptExampleEditForm: React.FC<PromptExampleEditFormProps> = ({
  editedPrompt,
  setEditedPrompt,
  onSave,
  onCancel,
  isSaving
}) => {
  return (
    <Card className="border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Edit Prompt</CardTitle>
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={onSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
            onValueChange={(value: string) => setEditedPrompt({ ...editedPrompt, category: value as CategoryType })}
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
      </CardContent>
    </Card>
  );
};
