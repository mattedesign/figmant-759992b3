
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Save, X, Trash2, Star, Brain, CreditCard } from 'lucide-react';
import { ClaudePromptExample, useUpdatePromptExample } from '@/hooks/useClaudePromptExamples';
import { CreditCostEditor } from './CreditCostEditor';
import { CATEGORY_OPTIONS } from '@/types/promptTypes';

interface PromptTemplateCardProps {
  template: ClaudePromptExample;
  onDelete?: (id: string) => void;
}

export const PromptTemplateCard: React.FC<PromptTemplateCardProps> = ({
  template,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState({
    title: template.title,
    display_name: template.display_name,
    description: template.description || '',
    category: template.category,
    original_prompt: template.original_prompt,
    effectiveness_rating: template.effectiveness_rating || 5,
    use_case_context: template.use_case_context || '',
    business_domain: template.business_domain || ''
  });

  const updatePromptMutation = useUpdatePromptExample();

  const handleSave = async () => {
    try {
      await updatePromptMutation.mutateAsync({
        id: template.id,
        updates: editedTemplate
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update template:', error);
    }
  };

  const handleCancel = () => {
    setEditedTemplate({
      title: template.title,
      display_name: template.display_name,
      description: template.description || '',
      category: template.category,
      original_prompt: template.original_prompt,
      effectiveness_rating: template.effectiveness_rating || 5,
      use_case_context: template.use_case_context || '',
      business_domain: template.business_domain || ''
    });
    setIsEditing(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'master': return 'bg-purple-100 text-purple-800';
      case 'competitor': return 'bg-blue-100 text-blue-800';
      case 'visual_hierarchy': return 'bg-green-100 text-green-800';
      case 'copy_messaging': return 'bg-orange-100 text-orange-800';
      case 'ecommerce_revenue': return 'bg-emerald-100 text-emerald-800';
      case 'ab_testing': return 'bg-pink-100 text-pink-800';
      case 'premium': return 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editedTemplate.title}
                    onChange={(e) => setEditedTemplate(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={editedTemplate.display_name}
                    onChange={(e) => setEditedTemplate(prev => ({ ...prev, display_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editedTemplate.category}
                    onValueChange={(value) => setEditedTemplate(prev => ({ ...prev, category: value as any }))}
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
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg">{template.display_name}</CardTitle>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoryColor(template.category)}>
                    {template.category.replace('_', ' ')}
                  </Badge>
                  {template.effectiveness_rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">
                        {template.effectiveness_rating}/10
                      </span>
                    </div>
                  )}
                  <CreditCostEditor
                    templateId={template.id}
                    currentCreditCost={template.credit_cost || 3}
                    isCompact={true}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={updatePromptMutation.isPending}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                {onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(template.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        {isEditing && (
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedTemplate.description}
              onChange={(e) => setEditedTemplate(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>
        )}
        <CardDescription>
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <Label htmlFor="use_case_context">Use Case Context</Label>
                <Input
                  id="use_case_context"
                  value={editedTemplate.use_case_context}
                  onChange={(e) => setEditedTemplate(prev => ({ ...prev, use_case_context: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="business_domain">Business Domain</Label>
                <Input
                  id="business_domain"
                  value={editedTemplate.business_domain}
                  onChange={(e) => setEditedTemplate(prev => ({ ...prev, business_domain: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="effectiveness_rating">Effectiveness Rating (1-10)</Label>
                <Input
                  id="effectiveness_rating"
                  type="number"
                  min="1"
                  max="10"
                  value={editedTemplate.effectiveness_rating}
                  onChange={(e) => setEditedTemplate(prev => ({ ...prev, effectiveness_rating: parseInt(e.target.value) || 5 }))}
                />
              </div>
            </div>
          ) : (
            template.description
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <Label htmlFor="original_prompt">Prompt Template</Label>
              <Textarea
                id="original_prompt"
                value={editedTemplate.original_prompt}
                onChange={(e) => setEditedTemplate(prev => ({ ...prev, original_prompt: e.target.value }))}
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted/30 p-3 rounded-md">
              <p className="text-sm font-mono whitespace-pre-wrap">
                {template.original_prompt}
              </p>
            </div>
            
            {!isEditing && (
              <CreditCostEditor
                templateId={template.id}
                currentCreditCost={template.credit_cost || 3}
                isCompact={false}
              />
            )}
            
            {template.use_case_context && (
              <div>
                <p className="text-sm font-medium mb-1">Use Case:</p>
                <p className="text-sm text-muted-foreground">{template.use_case_context}</p>
              </div>
            )}
            
            {template.business_domain && (
              <div>
                <p className="text-sm font-medium mb-1">Business Domain:</p>
                <p className="text-sm text-muted-foreground">{template.business_domain}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
