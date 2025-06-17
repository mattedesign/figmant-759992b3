
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { figmantPromptTemplates } from '@/data/figmantPromptTemplates';
import { Sparkles, Target, BarChart3, Users, ShoppingCart, FlaskConical, Crown, Brain } from 'lucide-react';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'master': return <Brain className="h-6 w-6" />;
    case 'competitor': return <Target className="h-6 w-6" />;
    case 'visual_hierarchy': return <BarChart3 className="h-6 w-6" />;
    case 'copy_messaging': return <Users className="h-6 w-6" />;
    case 'ecommerce_revenue': return <ShoppingCart className="h-6 w-6" />;
    case 'ab_testing': return <FlaskConical className="h-6 w-6" />;
    default: return <Sparkles className="h-6 w-6" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'master': return 'bg-purple-100 text-purple-600';
    case 'competitor': return 'bg-blue-100 text-blue-600';
    case 'visual_hierarchy': return 'bg-green-100 text-green-600';
    case 'copy_messaging': return 'bg-orange-100 text-orange-600';
    case 'ecommerce_revenue': return 'bg-emerald-100 text-emerald-600';
    case 'ab_testing': return 'bg-pink-100 text-pink-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getCategoryDisplayName = (category: string) => {
  switch (category) {
    case 'master': return 'Master Analysis';
    case 'competitor': return 'Competitor Analysis';
    case 'visual_hierarchy': return 'Visual Hierarchy';
    case 'copy_messaging': return 'Copy & Messaging';
    case 'ecommerce_revenue': return 'E-commerce Revenue';
    case 'ab_testing': return 'A/B Testing';
    default: return category;
  }
};

export const Step1SelectAnalysisType: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const handleTypeSelection = (templateId: string) => {
    setStepData({ ...stepData, selectedType: templateId });
  };

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Choose Your Premium Analysis"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {figmantPromptTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 ${
              stepData.selectedType === template.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
            }`}
            onClick={() => handleTypeSelection(template.id)}
          >
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center ${
                stepData.selectedType === template.id
                  ? getCategoryColor(template.category)
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {getCategoryIcon(template.category)}
              </div>
              <h3 className="font-medium text-center mb-2">{template.displayName}</h3>
              <p className="text-sm text-gray-600 text-center mb-3">{template.description}</p>
              
              <div className="flex justify-center mb-3">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    stepData.selectedType === template.id 
                      ? 'border-blue-500 text-blue-700' 
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  {getCategoryDisplayName(template.category)}
                </Badge>
              </div>

              {template.best_for && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">Best for:</p>
                  <div className="text-xs text-gray-600">
                    {template.best_for.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {template.requires_context && (
                <div className="mt-3 flex justify-center">
                  <Badge variant="secondary" className="text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Context Enhanced
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
