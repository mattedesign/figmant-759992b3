
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Target, Zap, TrendingUp, Brain, Globe } from 'lucide-react';
import { competitorAnalysisTemplates } from '@/data/templates/competitorAnalysisTemplates';
import { FigmantPromptTemplate } from '@/types/figmant';

interface CompetitorTemplateSelectorProps {
  onTemplateSelect: (template: FigmantPromptTemplate, context: Record<string, any>) => void;
  isAnalyzing?: boolean;
}

const getTemplateIcon = (templateId: string) => {
  switch (templateId) {
    case 'uc024_competitor_analysis':
      return <Brain className="h-5 w-5 text-blue-600" />;
    case 'uc-024-competitive-intelligence':
      return <Target className="h-5 w-5 text-purple-600" />;
    default:
      return <Globe className="h-5 w-5 text-green-600" />;
  }
};

const getTemplateColor = (templateId: string) => {
  switch (templateId) {
    case 'uc024_competitor_analysis':
      return 'border-blue-200 hover:border-blue-300';
    case 'uc-024-competitive-intelligence':
      return 'border-purple-200 hover:border-purple-300';
    default:
      return 'border-green-200 hover:border-green-300';
  }
};

export const CompetitorTemplateSelector: React.FC<CompetitorTemplateSelectorProps> = ({
  onTemplateSelect,
  isAnalyzing = false
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<FigmantPromptTemplate | null>(null);
  const [contextData, setContextData] = useState<Record<string, any>>({});
  const [step, setStep] = useState<'selection' | 'configuration'>('selection');

  const handleTemplateClick = (template: FigmantPromptTemplate) => {
    setSelectedTemplate(template);
    setContextData({});
    setStep('configuration');
  };

  const handleContextFieldChange = (fieldId: string, value: any) => {
    setContextData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleStartAnalysis = () => {
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate, contextData);
    }
  };

  const handleBackToSelection = () => {
    setStep('selection');
    setSelectedTemplate(null);
    setContextData({});
  };

  if (step === 'configuration' && selectedTemplate) {
    return (
      <div className="space-y-6">
        {/* Configuration Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getTemplateIcon(selectedTemplate.id)}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedTemplate.displayName}
              </h3>
              <p className="text-sm text-gray-600">
                Configure your competitor analysis parameters
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleBackToSelection}>
            Back to Templates
          </Button>
        </div>

        {/* Context Fields Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Analysis Configuration</CardTitle>
            <CardDescription>
              Customize the analysis parameters to get the most relevant insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTemplate.contextual_fields?.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                
                {field.type === 'select' && field.options ? (
                  <Select 
                    value={contextData[field.id] || ''} 
                    onValueChange={(value) => handleContextFieldChange(field.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === 'textarea' ? (
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder}
                    value={contextData[field.id] || ''}
                    onChange={(e) => handleContextFieldChange(field.id, e.target.value)}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={contextData[field.id] || ''}
                    onChange={(e) => handleContextFieldChange(field.id, e.target.value)}
                  />
                )}
                
                {field.description && (
                  <p className="text-xs text-gray-500">{field.description}</p>
                )}
              </div>
            ))}

            <div className="pt-4 border-t">
              <Button 
                onClick={handleStartAnalysis}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? 'Starting Analysis...' : 'Start Competitor Analysis'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selection Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Choose Your Competitor Analysis Template
        </h3>
        <p className="text-sm text-gray-600">
          Select the analysis approach that best fits your business goals and objectives
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {competitorAnalysisTemplates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${getTemplateColor(template.id)}`}
            onClick={() => handleTemplateClick(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                {getTemplateIcon(template.id)}
                <div className="flex-1">
                  <CardTitle className="text-base">{template.displayName}</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Best For Section */}
              {template.best_for && template.best_for.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Best For:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.best_for.slice(0, 2).map((useCase, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {useCase}
                      </Badge>
                    ))}
                    {template.best_for.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.best_for.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Analysis Focus */}
              {template.analysis_focus && template.analysis_focus.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Analysis Focus:</h4>
                  <div className="text-xs text-gray-600">
                    {template.analysis_focus.slice(0, 3).join(', ')}
                    {template.analysis_focus.length > 3 && ` +${template.analysis_focus.length - 3} more`}
                  </div>
                </div>
              )}

              {/* Select Button */}
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateClick(template);
                  }}
                >
                  Configure & Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                AI-Powered Competitor Analysis
              </h4>
              <p className="text-xs text-blue-700">
                Each template uses advanced AI to analyze competitor websites, design patterns, 
                and market positioning to provide actionable insights for your business.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
