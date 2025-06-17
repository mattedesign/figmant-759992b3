
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Star, Calendar, User, Target, Building } from 'lucide-react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface PromptTemplateViewProps {
  template: ClaudePromptExample;
  onEdit: () => void;
}

export const PromptTemplateView: React.FC<PromptTemplateViewProps> = ({
  template,
  onEdit
}) => {
  const { isOwner, loading } = useAuth();

  console.log('👁️ PromptTemplateView rendering for template:', template.id);

  const getCategoryColor = (category: string) => {
    const colors = {
      master: 'bg-purple-100 text-purple-800',
      competitor: 'bg-blue-100 text-blue-800', 
      visual_hierarchy: 'bg-green-100 text-green-800',
      copy_messaging: 'bg-yellow-100 text-yellow-800',
      ecommerce_revenue: 'bg-orange-100 text-orange-800',
      ab_testing: 'bg-red-100 text-red-800',
      premium: 'bg-indigo-100 text-indigo-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1 min-w-0">
          <CardTitle className="text-lg font-semibold truncate">
            {template.display_name || template.title}
          </CardTitle>
          {template.title !== template.display_name && (
            <p className="text-sm text-muted-foreground truncate">
              {template.title}
            </p>
          )}
          {template.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {template.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Badge className={getCategoryColor(template.category)}>
            {template.category.replace('_', ' ')}
          </Badge>
          {!loading && isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="shrink-0"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {template.effectiveness_rating && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-muted-foreground">Rating:</span>
              <span className="font-medium">{template.effectiveness_rating}/5</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-muted-foreground">Created:</span>
            <span className="font-medium">
              {formatDistanceToNow(new Date(template.created_at), { addSuffix: true })}
            </span>
          </div>
          
          {template.use_case_context && (
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Use Case:</span>
              <span className="font-medium truncate">{template.use_case_context}</span>
            </div>
          )}
          
          {template.business_domain && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-purple-500" />
              <span className="text-muted-foreground">Domain:</span>
              <span className="font-medium truncate">{template.business_domain}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-2">Prompt Template</h4>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <p className="line-clamp-3">{template.original_prompt}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Expected Response Pattern</h4>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <p className="line-clamp-3">{template.claude_response}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Badge variant={template.is_active ? 'default' : 'secondary'}>
              {template.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant={template.is_template ? 'default' : 'outline'}>
              {template.is_template ? 'Template' : 'Example'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
