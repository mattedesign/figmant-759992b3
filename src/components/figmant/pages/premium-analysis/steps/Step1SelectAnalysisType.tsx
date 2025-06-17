
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { figmantPromptTemplates } from '@/data/figmantPromptTemplates';
import { Sparkles, Target, BarChart3, Users, ShoppingCart, FlaskConical, Crown, Brain, Star } from 'lucide-react';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'master': return Brain;
    case 'competitor': return Target;
    case 'visual_hierarchy': return BarChart3;
    case 'copy_messaging': return Users;
    case 'ecommerce_revenue': return ShoppingCart;
    case 'ab_testing': return FlaskConical;
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
    default: return 'bg-gray-100 text-gray-800';
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {figmantPromptTemplates.map((template) => {
          const IconComponent = getCategoryIcon(template.category);
          
          return (
            <Card 
              key={template.id} 
              className={`transition-all hover:shadow-md cursor-pointer group ${
                stepData.selectedType === template.id
                  ? 'ring-2 ring-primary shadow-md'
                  : ''
              }`}
              onClick={() => handleTypeSelection(template.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-muted-foreground">9.5/10</span>
                  </div>
                </div>
                
                <CardTitle className={`text-lg transition-colors ${
                  stepData.selectedType === template.id 
                    ? 'text-primary' 
                    : 'group-hover:text-primary'
                }`}>
                  {template.displayName}
                </CardTitle>
                
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {template.best_for && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Best for:</p>
                      <p className="text-xs">{template.best_for.slice(0, 2).join(', ')}</p>
                    </div>
                  )}
                  
                  {template.requires_context && (
                    <div>
                      <Badge variant="outline" className="text-xs">
                        <Crown className="h-3 w-3 mr-1" />
                        Context Enhanced
                      </Badge>
                    </div>
                  )}

                  {template.analysis_focus && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Analysis Focus:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.analysis_focus.slice(0, 3).map((focus, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {focus}
                          </Badge>
                        ))}
                        {template.analysis_focus.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.analysis_focus.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
