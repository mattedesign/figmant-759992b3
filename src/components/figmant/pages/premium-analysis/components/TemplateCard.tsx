
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp, Zap, Crown, Star, Eye } from 'lucide-react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';

interface TemplateCardProps {
  template: ClaudePromptExample;
  isSelected: boolean;
  onSelect: (templateId: string, event?: React.MouseEvent) => void;
  onPreview: (template: ClaudePromptExample, event?: React.MouseEvent) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'master': return Brain;
    case 'competitor': return Target;
    case 'visual_hierarchy': return TrendingUp;
    case 'copy_messaging': return Zap;
    case 'ecommerce_revenue': return TrendingUp;
    case 'ab_testing': return Target;
    case 'premium': return Crown;
    default: return Brain;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'master': return 'bg-purple-100 text-purple-800';
    case 'competitor': return 'bg-blue-100 text-blue-800';
    case 'visual_hierarchy': return 'bg-green-100 text-green-800';
    case 'copy_messaging': return 'bg-orange-100 text-orange-800';
    case 'ecommerce_revenue': return 'bg-emerald-100 text-emerald-800';
    case 'ab_testing': return 'bg-pink-100 text-pink-800';
    case 'premium': return 'bg-amber-100 text-amber-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const renderStarRating = (rating: number) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
    </div>
  );
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  onPreview
}) => {
  const IconComponent = getCategoryIcon(template.category);
  const isPopular = template.effectiveness_rating > 8;

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] min-h-0 relative group ${
        isSelected ? 'border-2 border-blue-500 bg-blue-50' : 'hover:border-gray-300'
      }`}
      onClick={(e) => onSelect(template.id, e)}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <IconComponent className="h-5 w-5 text-primary" />
            <Badge className={getCategoryColor(template.category)}>
              {template.category.replace('_', ' ')}
            </Badge>
            {isPopular && (
              <Badge className="bg-yellow-100 text-yellow-800">
                Most Popular
              </Badge>
            )}
          </div>
          
          {/* Preview Button */}
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => onPreview(template, e)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        
        <CardTitle className="text-base">{template.title}</CardTitle>
        {template.description && (
          <CardDescription className="text-sm">
            {template.description}
          </CardDescription>
        )}
        
        {/* Star Rating */}
        {template.effectiveness_rating && (
          <div className="mt-2">
            {renderStarRating(template.effectiveness_rating)}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {template.use_case_context && (
          <div className="text-xs text-gray-600 mb-2">
            <span className="font-medium">Best for:</span> {template.use_case_context}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Credit Cost: {template.credit_cost || 3}</span>
          {template.effectiveness_rating && (
            <span>Rating: {template.effectiveness_rating}/10</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
