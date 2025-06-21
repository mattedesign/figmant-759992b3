import React, { useState } from 'react';
import { StepProps } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { Lightbulb, Target, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';
import { CreditCostDisplay } from '../components/CreditCostDisplay';
import { supabase } from '@/integrations/supabase/client';

interface Step1SelectAnalysisTypeProps extends StepProps {
  onCreditCostChange?: (creditCost: number) => void;
}

export const Step1SelectAnalysisType: React.FC<Step1SelectAnalysisTypeProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps,
  onCreditCostChange
}) => {
  const { data: templates = [], isLoading } = useFigmantPromptTemplates();
  const [selectedTemplateCreditCost, setSelectedTemplateCreditCost] = useState<number>(1);

  const handleTemplateSelect = async (templateId: string) => {
    setStepData(prev => ({ ...prev, selectedType: templateId }));

    // Fetch and set credit cost for display
    try {
      const { data } = await supabase
        .from('claude_prompt_examples')
        .select('credit_cost')
        .eq('id', templateId)
        .single();
      
      const creditCost = data?.credit_cost || 3;
      setSelectedTemplateCreditCost(creditCost);
      
      // Pass credit cost to parent component
      if (onCreditCostChange) {
        onCreditCostChange(creditCost);
      }
    } catch (error) {
      console.error('Error fetching template credit cost:', error);
      setSelectedTemplateCreditCost(3);
      if (onCreditCostChange) {
        onCreditCostChange(3);
      }
    }
  };

  const getIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'competitor':
        return <Target className="h-6 w-6" />;
      case 'e-commerce':
        return <TrendingUp className="h-6 w-6" />;
      case 'testing':
        return <CheckCircle className="h-6 w-6" />;
      case 'accessibility':
        return <Users className="h-6 w-6" />;
      case 'visual':
        return <Lightbulb className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-full">
        <div className="w-full">
          <h2 className="text-3xl font-bold text-center mb-8">Select Analysis Type</h2>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Select Analysis Type</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                stepData.selectedType === template.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      stepData.selectedType === template.id 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getIcon(template.category)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      {template.category && (
                        <Badge variant="outline" className="mt-1">
                          {template.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {stepData.selectedType === template.id && (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
                <div className="mt-3 flex items-center justify-between">
                  <CreditCostDisplay 
                    templateId={template.id} 
                    isSelected={stepData.selectedType === template.id}
                  />
                  {/* Show contextual fields indicator if template has them */}
                  {template.metadata && 
                   typeof template.metadata === 'object' && 
                   template.metadata !== null &&
                   Array.isArray((template.metadata as any).contextual_fields) &&
                   (template.metadata as any).contextual_fields.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Customizable
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No analysis templates available</p>
          </div>
        )}
      </div>
    </div>
  );
};
