
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Star, CreditCard } from 'lucide-react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { CreditCostEditor } from './components/CreditCostEditor';

interface PromptTemplateViewProps {
  template: ClaudePromptExample;
  onEdit: () => void;
}

export const PromptTemplateView: React.FC<PromptTemplateViewProps> = ({
  template,
  onEdit
}) => {
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

  // Extract contextual fields for display
  const contextualFields = template.metadata?.contextual_fields || [];

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{template.display_name || template.title}</CardTitle>
              <Badge className={getCategoryColor(template.category)}>
                {template.category}
              </Badge>
              {template.effectiveness_rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{template.effectiveness_rating}/10</span>
                </div>
              )}
            </div>
            <CardDescription className="line-clamp-2">
              {template.description || 'No description provided'}
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            className="flex items-center gap-1"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Prompt Preview */}
        <div className="bg-muted/30 p-3 rounded-md">
          <p className="text-sm font-mono whitespace-pre-wrap line-clamp-3">
            {template.original_prompt}
          </p>
        </div>
        
        {/* Credit Cost */}
        <CreditCostEditor
          templateId={template.id}
          currentCreditCost={template.credit_cost || 3}
          isCompact={true}
        />
        
        {/* Contextual Fields Info */}
        {contextualFields.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-md border">
            <p className="text-sm font-medium text-blue-800 mb-1">
              Dynamic Form Fields ({contextualFields.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {contextualFields.map((field: any, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {field.label || field.id}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Template Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {template.use_case_context && (
            <span>Use Case: {template.use_case_context}</span>
          )}
          {template.business_domain && (
            <span>Domain: {template.business_domain}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
