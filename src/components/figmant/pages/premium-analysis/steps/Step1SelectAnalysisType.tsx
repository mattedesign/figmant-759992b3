import React, { useState, useEffect } from 'react';
import { StepProps } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { Lightbulb, Target, TrendingUp, Users, Zap, CheckCircle, Star } from 'lucide-react';
import { CreditCostDisplay } from '../components/CreditCostDisplay';
import { supabase } from '@/integrations/supabase/client';
import { useTemplateCreditStore } from '@/stores/templateCreditStore';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const { setTemplateCreditCost, resetCreditCost } = useTemplateCreditStore();

  // Reset credit cost when leaving the page
  useEffect(() => {
    return () => {
      resetCreditCost();
    };
  }, [resetCreditCost]);

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
      
      // Update global credit store
      setTemplateCreditCost(templateId, creditCost);
      
      // Pass credit cost to parent component
      if (onCreditCostChange) {
        onCreditCostChange(creditCost);
      }
    } catch (error) {
      console.error('Error fetching template credit cost:', error);
      setSelectedTemplateCreditCost(3);
      setTemplateCreditCost(templateId, 3);
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

  // Filter templates based on search term
  const filteredTemplates = templates.filter(template => 
    template.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                stepData.selectedType === template.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
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
                      <div className="mt-1 flex items-center gap-2">
                        {template.category && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {template.category.replace('_', ' ')}
                          </Badge>
                        )}
                        <CreditCostDisplay 
                          templateId={template.id} 
                          isSelected={stepData.selectedType === template.id}
                        />
                      </div>
                    </div>
                  </div>
                  {stepData.selectedType === template.id && (
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-sm mb-3">
                  {template.description}
                </CardDescription>
                
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">(4/5)</span>
                </div>
                
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template);
                      setShowPreview(true);
                    }}
                    className="w-full"
                  >
                    Preview Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
