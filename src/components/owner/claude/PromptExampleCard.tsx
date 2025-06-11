
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Save, X } from 'lucide-react';
import { ClaudePromptExample, useUpdatePromptExample } from '@/hooks/useClaudePromptExamples';
import { useToast } from '@/hooks/use-toast';

interface PromptExampleCardProps {
  prompt: ClaudePromptExample;
}

type CategoryType = 'master' | 'competitor' | 'visual_hierarchy' | 'copy_messaging' | 'ecommerce_revenue' | 'ab_testing' | 'general';

const CATEGORY_OPTIONS = [
  { value: 'master', label: 'Master UX Analysis' },
  { value: 'competitor', label: 'Competitor Analysis' },
  { value: 'visual_hierarchy', label: 'Visual Hierarchy' },
  { value: 'copy_messaging', label: 'Copy & Messaging' },
  { value: 'ecommerce_revenue', label: 'E-commerce Revenue' },
  { value: 'ab_testing', label: 'A/B Testing' },
  { value: 'general', label: 'General' }
] as const;

export const PromptExampleCard: React.FC<PromptExampleCardProps> = ({ prompt }) => {
  const { toast } = useToast();
  const updatePromptMutation = useUpdatePromptExample();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState({
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
    try {
      await updatePromptMutation.mutateAsync({
        id: prompt.id,
        updates: editedPrompt
      });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Prompt updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update prompt",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
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
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Edit Prompt</CardTitle>
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={handleSave} disabled={updatePromptMutation.isPending}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
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
  }

  return (
    <div className="border rounded p-3 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{prompt.title}</h4>
        <div className="flex items-center space-x-2">
          {prompt.effectiveness_rating && (
            <Badge variant="outline">
              ⭐ {prompt.effectiveness_rating}/5
            </Badge>
          )}
          {prompt.is_template && (
            <Badge variant="secondary">Template</Badge>
          )}
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {prompt.description && (
        <p className="text-sm text-muted-foreground">{prompt.description}</p>
      )}
      <div className="text-xs text-muted-foreground">
        {prompt.use_case_context && `Use Case: ${prompt.use_case_context}`}
        {prompt.business_domain && ` | Domain: ${prompt.business_domain}`}
      </div>
      <div className="text-xs text-muted-foreground truncate">
        Prompt: {prompt.original_prompt.substring(0, 100)}...
      </div>
    </div>
  );
};
