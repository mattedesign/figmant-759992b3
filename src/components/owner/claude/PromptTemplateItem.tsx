
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { PromptTemplateEditForm } from './PromptTemplateEditForm';

interface PromptTemplateItemProps {
  template: ClaudePromptExample;
  onView: (template: ClaudePromptExample) => void;
  onDelete: (template: ClaudePromptExample) => void;
  onEditSuccess: () => void;
}

export const PromptTemplateItem: React.FC<PromptTemplateItemProps> = ({
  template,
  onView,
  onDelete,
  onEditSuccess
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // STEP 1 DEBUG: Check if component is being rendered
  console.log('🔍 RENDER CHECK:', {
    isEditing,
    willRenderEditForm: isEditing,
    templateId: template.id
  });

  const handleEdit = () => {
    console.log('🔍 Starting edit for template:', template.id);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    console.log('🔍 Canceling edit for template:', template.id);
    setIsEditing(false);
  };

  const handleSaveSuccess = () => {
    console.log('🔍 Edit saved successfully for template:', template.id);
    setIsEditing(false);
    onEditSuccess();
  };

  if (isEditing) {
    console.log('🔍 RENDERING EDIT FORM for template:', template.id);
    return (
      <PromptTemplateEditForm
        template={template}
        onCancel={handleCancelEdit}
        onSaveSuccess={handleSaveSuccess}
      />
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'master': return 'bg-purple-100 text-purple-800';
      case 'competitor': return 'bg-blue-100 text-blue-800';
      case 'visual_hierarchy': return 'bg-green-100 text-green-800';
      case 'copy_messaging': return 'bg-orange-100 text-orange-800';
      case 'ecommerce_revenue': return 'bg-red-100 text-red-800';
      case 'ab_testing': return 'bg-yellow-100 text-yellow-800';
      case 'premium': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{template.display_name || template.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getCategoryColor(template.category)}>
                {template.category}
              </Badge>
              {template.is_template && (
                <Badge variant="secondary">Template</Badge>
              )}
              {!template.is_active && (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(template)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(template)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {template.description && (
          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
        )}
        
        <div className="space-y-2 text-xs text-gray-500">
          {template.effectiveness_rating && (
            <div>Rating: {template.effectiveness_rating}/10</div>
          )}
          {template.use_case_context && (
            <div>Use Case: {template.use_case_context}</div>
          )}
          {template.business_domain && (
            <div>Domain: {template.business_domain}</div>
          )}
          {template.credit_cost && (
            <div>Credit Cost: {template.credit_cost}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
