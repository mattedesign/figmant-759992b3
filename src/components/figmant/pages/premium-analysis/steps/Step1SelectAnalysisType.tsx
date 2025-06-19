
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StepProps, StepData } from '../types';
import { StepHeader } from '../components/StepHeader';
import { figmantPromptTemplates } from '@/data/figmantPromptTemplates';
import { ANALYSIS_CREDIT_COSTS, isPremiumAnalysis, getAnalysisCost, getAnalysisValue } from '@/hooks/premium-analysis/creditCostManager';
import { Sparkles, Target, BarChart3, Users, ShoppingCart, FlaskConical, Crown, Brain, Star, Eye, Smartphone, Calendar, Layers, ArrowRight, Diamond, TrendingUp, Zap } from 'lucide-react';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'master': return Brain;
    case 'competitor': return Target;
    case 'visual_hierarchy': return BarChart3;
    case 'copy_messaging': return Users;
    case 'ecommerce_revenue': return ShoppingCart;
    case 'ab_testing': return FlaskConical;
    case 'accessibility': return Eye;
    case 'cross_device': return Smartphone;
    case 'seasonal': return Calendar;
    case 'design_system': return Layers;
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
    case 'accessibility': return 'bg-indigo-100 text-indigo-800';
    case 'cross_device': return 'bg-cyan-100 text-cyan-800';
    case 'seasonal': return 'bg-amber-100 text-amber-800';
    case 'design_system': return 'bg-slate-100 text-slate-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const Step1SelectAnalysisType: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps,
  onNextStep
}) => {
  const handleTypeSelection = (templateId: string) => {
    console.log('🎯 Step1 - Template selected:', templateId);
    
    // Update the step data using the new pattern
    setStepData(prev => ({ ...prev, selectedType: templateId }));
    
    console.log('🎯 Step1 - About to call onNextStep, onNextStep available:', !!onNextStep);
    
    // Call onNextStep immediately - no timeout needed
    if (onNextStep) {
      console.log('🎯 Step1 - Calling onNextStep now');
      onNextStep();
    }
  };

  console.log('🎯 Step1 - Current state:', {
    selectedType: stepData.selectedType,
    hasOnNextStep: !!onNextStep,
    hasSetStepData: !!setStepData
  });

  return (
    <div className="space-y-6 pb-8">
      <StepHeader 
        title="Choose Your Premium Analysis"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {figmantPromptTemplates.map((template) => {
          const IconComponent = getCategoryIcon(template.category);
          const isSelected = stepData.selectedType === template.id;
          const isPremium = isPremiumAnalysis(template.id);
          const creditCost = getAnalysisCost(template.id);
          const analysisValue = getAnalysisValue(template.id);
          
          return (
            <Card 
              key={template.id} 
              className={`transition-all hover:shadow-md group cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-primary shadow-md'
                  : ''
              } ${isPremium ? 'border-l-4 border-l-amber-400' : ''}`}
              onClick={() => handleTypeSelection(template.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category.replace('_', ' ')}
                    </Badge>
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                        <Diamond className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-muted-foreground">9.5/10</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-primary">{creditCost} credits</div>
                      {isPremium && (
                        <div className="text-xs text-muted-foreground">Value: {analysisValue}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <CardTitle className={`text-lg transition-colors ${
                  isSelected 
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
                  
                  {isPremium && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Premium Analysis Includes:</span>
                      </div>
                      <ul className="text-xs text-amber-700 space-y-1">
                        <li>✨ Strategic market positioning insights</li>
                        <li>📊 Competitive positioning matrix</li>
                        <li>💰 Revenue impact predictions</li>
                        <li>🛣️ 8-week implementation roadmap</li>
                      </ul>
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

                  <div className="pt-3 border-t">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTypeSelection(template.id);
                      }}
                      className={`w-full flex items-center justify-center gap-2 ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground' 
                          : isPremium 
                            ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white'
                            : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                      {isPremium && !isSelected && <Zap className="h-4 w-4" />}
                      {!isPremium && <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
