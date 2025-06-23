
import React from 'react';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, TrendingUp, Zap, Crown } from 'lucide-react';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'master': return Brain;
    case 'competitor': return Target;
    case 'visual_hierarchy': return TrendingUp;
    case 'copy_messaging': return Zap;
    case 'ecommerce_revenue': return TrendingUp;
    case 'ab_testing': return Target;
    case 'premium': return Crown;
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
    case 'premium': return 'bg-amber-100 text-amber-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const Step1SelectAnalysisType: React.FC<StepProps> = ({
  stepData,
  setStepData,
  currentStep,
  totalSteps
}) => {
  const { data: promptTemplates = [], isLoading } = useClaudePromptExamples();

  const handleTemplateSelect = (templateId: string) => {
    const template = promptTemplates.find(t => t.id === templateId);
    if (template) {
      setStepData(prev => ({
        ...prev,
        selectedType: templateId,
        contextualData: {
          ...prev.contextualData,
          selectedTemplate: template,
          templateCategory: template.category,
          templateTitle: template.title
        }
      }));
    }
  };

  // Check if template is pre-selected (from Templates page)
  const preSelectedTemplate = stepData.contextualData?.selectedTemplate;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <StepHeader
          title={preSelectedTemplate ? "Template Selected" : "Select Analysis Type"}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
        
        {/* Description text */}
        <div className="text-center text-gray-600 mb-6">
          {preSelectedTemplate 
            ? `You've selected the ${preSelectedTemplate.title} template. You can change this selection or proceed to the next step.`
            : "Choose the type of analysis you want to perform"
          }
        </div>

        {preSelectedTemplate && (
          <div className="mb-6">
            <Card className="border-2 border-blue-500 bg-blue-50 min-h-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {React.createElement(getCategoryIcon(preSelectedTemplate.category), { 
                    className: "h-5 w-5 text-primary" 
                  })}
                  <Badge className={getCategoryColor(preSelectedTemplate.category)}>
                    {preSelectedTemplate.category.replace('_', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{preSelectedTemplate.title}</CardTitle>
                {preSelectedTemplate.description && (
                  <CardDescription>{preSelectedTemplate.description}</CardDescription>
                )}
              </CardHeader>
            </Card>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {preSelectedTemplate ? "Available Templates:" : "Choose a Template:"}
          </h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {promptTemplates.map((template) => {
              const IconComponent = getCategoryIcon(template.category);
              const isSelected = stepData.selectedType === template.id;
              
              return (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md min-h-0 ${
                    isSelected ? 'border-2 border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{template.title}</CardTitle>
                    {template.description && (
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    {template.use_case_context && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Best for:</span> {template.use_case_context}
                      </div>
                    )}
                    
                    {template.effectiveness_rating && (
                      <div className="mt-2 text-xs text-gray-500">
                        Effectiveness: {template.effectiveness_rating}/10
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
