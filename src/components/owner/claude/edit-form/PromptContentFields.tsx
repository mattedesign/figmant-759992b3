
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CategoryType } from '@/types/promptTypes';

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

interface PromptContentFieldsProps {
  editedPrompt: EditedPromptData;
  setEditedPrompt: (prompt: EditedPromptData) => void;
}

export const PromptContentFields: React.FC<PromptContentFieldsProps> = ({
  editedPrompt,
  setEditedPrompt
}) => {
  return (
    <>
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
    </>
  );
};
