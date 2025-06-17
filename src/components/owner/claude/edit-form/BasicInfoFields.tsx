
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CategoryType } from '@/types/promptTypes';

const CATEGORIES = [
  { value: 'master', label: 'Master Analysis' },
  { value: 'competitor', label: 'Competitor Analysis' },
  { value: 'visual_hierarchy', label: 'Visual Hierarchy' },
  { value: 'copy_messaging', label: 'Copy & Messaging' },
  { value: 'ecommerce_revenue', label: 'E-commerce Revenue' },
  { value: 'ab_testing', label: 'A/B Testing' },
  { value: 'premium', label: 'Premium Analysis' },
  { value: 'general', label: 'General Analysis' }
] as const;

interface BasicInfoFieldsProps {
  editedPrompt: {
    title: string;
    display_name: string;
    description: string;
    category: CategoryType;
    original_prompt: string;
    claude_response: string;
    use_case_context: string;
    business_domain: string;
    effectiveness_rating: number;
    is_template: boolean;
    is_active: boolean;
  };
  setEditedPrompt: React.Dispatch<React.SetStateAction<any>>;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  editedPrompt,
  setEditedPrompt
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="edit-title">Title *</Label>
        <Input
          id="edit-title"
          value={editedPrompt.title}
          onChange={(e) => setEditedPrompt(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Template title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="edit-display-name">Display Name *</Label>
        <Input
          id="edit-display-name"
          value={editedPrompt.display_name}
          onChange={(e) => setEditedPrompt(prev => ({ ...prev, display_name: e.target.value }))}
          placeholder="Display name for template"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="edit-category">Category</Label>
        <Select
          value={editedPrompt.category}
          onValueChange={(value) => setEditedPrompt(prev => ({ ...prev, category: value as CategoryType }))}
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
        <Label htmlFor="edit-effectiveness">Effectiveness Rating</Label>
        <Select
          value={editedPrompt.effectiveness_rating.toString()}
          onValueChange={(value) => setEditedPrompt(prev => ({ ...prev, effectiveness_rating: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map(rating => (
              <SelectItem key={rating} value={rating.toString()}>
                {rating} Star{rating !== 1 ? 's' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={editedPrompt.description}
          onChange={(e) => setEditedPrompt(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of the template..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-use-case">Use Case Context</Label>
        <Input
          id="edit-use-case"
          value={editedPrompt.use_case_context}
          onChange={(e) => setEditedPrompt(prev => ({ ...prev, use_case_context: e.target.value }))}
          placeholder="When to use this template"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-business-domain">Business Domain</Label>
        <Input
          id="edit-business-domain"
          value={editedPrompt.business_domain}
          onChange={(e) => setEditedPrompt(prev => ({ ...prev, business_domain: e.target.value }))}
          placeholder="Target business domain"
        />
      </div>
    </div>
  );
};
