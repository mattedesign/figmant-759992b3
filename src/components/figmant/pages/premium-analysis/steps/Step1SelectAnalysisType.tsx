
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StepProps, StepData } from '../types';
import { StepHeader } from '../components/StepHeader';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';
import { isPremiumAnalysis, getAnalysisCost, getAnalysisValue } from '@/hooks/premium-analysis/creditCostManager';
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
  const { data: databaseTemplates = [], isLoading } = useClaudePromptExamples();

  const handleTypeSelection = (templateId: string) => {
    console.log('🎯 Step1 - Template selected:', templateId);
    
    setStepData(prev => ({ ...prev, selectedType: templateId }));
    
    console.log('🎯 Step1 - About to call onNextStep, onNextStep available:', !!onNextStep);
    
    if (onNextStep) {
      console.log('🎯 Step1 - Calling onNextStep now');
      onNextStep();
    }
  };

  console.log('🎯 Step1 - Current state:', {
    selectedType: stepData.selectedType,
    hasOnNextStep: !!onNextStep,
    hasSetStepData: !!setStepData,
    templatesCount: databaseTemplates.length
  });

  if (isLoading) {
    return (
      <div className="pb-8">
        <StepHeader 
          title="Choose Your Premium Analysis"
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <StepHeader 
        title="Choose Your Premium Analysis"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      {databaseTemplates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No templates available. Please contact support.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {databaseTemplates.map((template) => {
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
                <CardHeader className="px-0">
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
                        <span className="text-xs text-muted-foreground">
                          {template.effectiveness_rating || 8}/10
                        </span>
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
                    {template.display_name || template.title}
                  </CardTitle>
                  
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-0">
                  <div className="space-y-3">
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
      )}
    </div>
  );
};
