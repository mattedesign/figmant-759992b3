
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryType, CATEGORY_OPTIONS } from '@/types/promptTypes';

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

interface BasicInfoFieldsProps {
  editedPrompt: EditedPromptData;
  setEditedPrompt: (prompt: EditedPromptData) => void;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  editedPrompt,
  setEditedPrompt
}) => {
  return (
    <>
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
    </>
  );
};
