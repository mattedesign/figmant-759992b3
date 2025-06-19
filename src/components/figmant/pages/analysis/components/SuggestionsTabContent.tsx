import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Target, Users, Zap, TrendingUp, Eye, ArrowRight } from 'lucide-react';
import { ExtractedSuggestion } from '@/utils/suggestionExtractor';
interface SuggestionsTabContentProps {
  suggestions?: ExtractedSuggestion[];
}
export const SuggestionsTabContent: React.FC<SuggestionsTabContentProps> = ({
  suggestions = []
}) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'default';
      case 'Low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Conversion':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Usability':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Accessibility':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Performance':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Conversion':
        return Target;
      case 'Usability':
        return Users;
      case 'Accessibility':
        return Eye;
      case 'Performance':
        return TrendingUp;
      default:
        return Zap;
    }
  };
  if (suggestions.length === 0) {
    return <div className="space-y-4 px-[8px] py-[12px]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium text-gray-700">UX Improvement Suggestions</span>
        </div>

        {/* Empty State */}
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">No suggestions yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Start an analysis to see AI-generated suggestions
          </p>
        </div>
      </div>;
  }
  return <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-4 w-4 text-yellow-600" />
        <span className="text-sm font-medium text-gray-700">UX Improvement Suggestions</span>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {suggestions.map(suggestion => {
        const IconComponent = getCategoryIcon(suggestion.category);
        return <Card key={suggestion.id} className="p-3 hover:shadow-sm transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {suggestion.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {suggestion.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={getImpactColor(suggestion.impact) as any} className="text-xs px-2 py-0.5">
                      {suggestion.impact} Impact
                    </Badge>
                    <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getCategoryColor(suggestion.category)}`}>
                      {suggestion.category}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    View Details
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>;
      })}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            Suggestions based on uploaded content analysis
          </p>
          <Button variant="outline" size="sm" className="text-xs">
            Generate More Suggestions
          </Button>
        </div>
      </div>
    </div>;
};