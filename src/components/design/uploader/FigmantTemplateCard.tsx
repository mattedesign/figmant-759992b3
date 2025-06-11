
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Target, BarChart3, Users, ShoppingCart, FlaskConical } from 'lucide-react';
import { FigmantPromptTemplate } from '@/types/figmant';

interface FigmantTemplateCardProps {
  template: FigmantPromptTemplate;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'master': return <Sparkles className="h-4 w-4" />;
    case 'competitor': return <Target className="h-4 w-4" />;
    case 'visual_hierarchy': return <BarChart3 className="h-4 w-4" />;
    case 'copy_messaging': return <Users className="h-4 w-4" />;
    case 'ecommerce_revenue': return <ShoppingCart className="h-4 w-4" />;
    case 'ab_testing': return <FlaskConical className="h-4 w-4" />;
    default: return <Sparkles className="h-4 w-4" />;
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
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const FigmantTemplateCard = ({ template, isSelected, onSelect }: FigmantTemplateCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onSelect(template.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {getCategoryIcon(template.category)}
          <Badge className={getCategoryColor(template.category)}>
            {template.category.replace('_', ' ')}
          </Badge>
        </div>
        <CardTitle className="text-sm">{template.name}</CardTitle>
        <CardDescription className="text-xs">{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {template.best_for && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Best for:</p>
              <p className="text-xs">{template.best_for.slice(0, 2).join(', ')}</p>
            </div>
          )}
          {template.requires_context && (
            <Badge variant="outline" className="text-xs">
              Context Enhanced
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
