
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Lightbulb, 
  Target, 
  Users, 
  Zap, 
  TrendingUp, 
  Eye,
  ArrowRight
} from 'lucide-react';

interface SuggestionItem {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  category: 'Conversion' | 'Usability' | 'Accessibility' | 'Performance';
  icon: React.ComponentType<{ className?: string }>;
}

const mockSuggestions: SuggestionItem[] = [
  {
    id: '1',
    title: 'Improve CTA Button Contrast',
    description: 'Increase contrast ratio of primary buttons to meet WCAG AA standards and improve conversion rates.',
    impact: 'High',
    category: 'Conversion',
    icon: Target
  },
  {
    id: '2',
    title: 'Optimize Mobile Touch Targets',
    description: 'Increase touch target sizes to minimum 44px for better mobile usability.',
    impact: 'Medium',
    category: 'Usability',
    icon: Users
  },
  {
    id: '3',
    title: 'Add Visual Hierarchy',
    description: 'Enhance typography scale and spacing to create clearer information hierarchy.',
    impact: 'Medium',
    category: 'Usability',
    icon: Eye
  },
  {
    id: '4',
    title: 'Reduce Cognitive Load',
    description: 'Simplify form fields and reduce the number of steps in the user flow.',
    impact: 'High',
    category: 'Conversion',
    icon: Zap
  },
  {
    id: '5',
    title: 'Improve Loading States',
    description: 'Add skeleton screens and progress indicators for better perceived performance.',
    impact: 'Low',
    category: 'Performance',
    icon: TrendingUp
  }
];

export const SuggestionsTabContent: React.FC = () => {
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-4 w-4 text-yellow-600" />
        <span className="text-sm font-medium text-gray-700">UX Improvement Suggestions</span>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {mockSuggestions.map((suggestion) => {
          const IconComponent = suggestion.icon;
          return (
            <Card key={suggestion.id} className="p-3 hover:shadow-sm transition-shadow">
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
                    <Badge 
                      variant={getImpactColor(suggestion.impact) as any}
                      className="text-xs px-2 py-0.5"
                    >
                      {suggestion.impact} Impact
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={`text-xs px-2 py-0.5 ${getCategoryColor(suggestion.category)}`}
                    >
                      {suggestion.category}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    View Details
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          );
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
    </div>
  );
};
