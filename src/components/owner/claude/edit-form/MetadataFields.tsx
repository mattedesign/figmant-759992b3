
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface MetadataFieldsProps {
  editedPrompt: EditedPromptData;
  setEditedPrompt: (prompt: EditedPromptData) => void;
}

export const MetadataFields: React.FC<MetadataFieldsProps> = ({
  editedPrompt,
  setEditedPrompt
}) => {
  return (
    <>
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
    </>
  );
};
