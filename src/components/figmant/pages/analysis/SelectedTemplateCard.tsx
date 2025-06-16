
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';

interface SelectedTemplateCardProps {
  currentTemplate: any;
  showTemplateDetails: boolean;
  onToggleDetails: () => void;
  onClearSelection: () => void;
  getCategoryColor: (category: string) => string;
}

export const SelectedTemplateCard: React.FC<SelectedTemplateCardProps> = ({
  currentTemplate,
  showTemplateDetails,
  onToggleDetails,
  onClearSelection,
  getCategoryColor
}) => {
  if (!currentTemplate) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
            <CardTitle className="text-sm truncate">
              {currentTemplate.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onToggleDetails}
              className="h-6 w-6 p-0"
            >
              {showTemplateDetails ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClearSelection}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {showTemplateDetails && (
        <CardContent className="pt-0">
          {currentTemplate.description && (
            <CardDescription className="text-xs mb-2">
              {currentTemplate.description}
            </CardDescription>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${getCategoryColor(currentTemplate.category)} text-xs`}>
              {currentTemplate.category.replace('_', ' ')}
            </Badge>
            {currentTemplate.effectiveness_rating && (
              <Badge variant="secondary" className="text-xs">
                Rating: {currentTemplate.effectiveness_rating}/10
              </Badge>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
