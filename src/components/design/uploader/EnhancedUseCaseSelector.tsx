
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Sparkles, Target, BarChart3, Users, ShoppingCart, FlaskConical } from 'lucide-react';
import { useDesignUseCases } from '@/hooks/useDesignUseCases';
import { figmantPromptTemplates, getFigmantTemplate } from '@/data/figmantPromptTemplates';
import { FigmantPromptTemplate, FigmantPromptVariables } from '@/types/figmant';

interface EnhancedUseCaseSelectorProps {
  selectedUseCase: string;
  setSelectedUseCase: (value: string) => void;
  promptVariables: FigmantPromptVariables;
  setPromptVariables: (value: FigmantPromptVariables) => void;
  customInstructions: string;
  setCustomInstructions: (value: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'master': return <Sparkles className="h-4 w-4" />;
    case 'competitor': return <Target className="h-4 w-4" />;
    case 'visual_hierarchy': return <BarChart3 className="h-4 w-4" />;
    case 'copy_messaging': return <Users className="h-4 w-4" />;
    case 'ecommerce_revenue': return <ShoppingCart className="h-4 w-4" />;
    case 'ab_testing': return <FlaskConical className="h-4 w-4" />;
    default: return <Sparkles className="h-4 w-4" />;
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

export const EnhancedUseCaseSelector = ({
  selectedUseCase,
  setSelectedUseCase,
  promptVariables,
  setPromptVariables,
  customInstructions,
  setCustomInstructions
}: EnhancedUseCaseSelectorProps) => {
  const { data: useCases = [], isLoading: loadingUseCases } = useDesignUseCases();
  const [selectedTemplate, setSelectedTemplate] = useState<FigmantPromptTemplate | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'standard' | 'figmant'>('figmant');

  const handleTemplateSelect = (templateId: string) => {
    const template = getFigmantTemplate(templateId);
    if (template) {
      setSelectedTemplate(template);
      setSelectedUseCase(`figmant_${templateId}`);
    }
  };

  const handleVariableChange = (key: keyof FigmantPromptVariables, value: string | string[]) => {
    setPromptVariables({
      ...promptVariables,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium">Analysis Framework</Label>
        <Tabs value={analysisMode} onValueChange={(value) => setAnalysisMode(value as 'standard' | 'figmant')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="figmant" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Figmant.ai Templates
            </TabsTrigger>
            <TabsTrigger value="standard">Standard Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="figmant" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {figmantPromptTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      {getCategoryIcon(template.category)}
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm">{template.name}</CardTitle>
                    <CardDescription className="text-xs">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {template.best_for && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Best for:</p>
                          <p className="text-xs">{template.best_for.slice(0, 2).join(', ')}</p>
                        </div>
                      )}
                      {template.requires_context && (
                        <Badge variant="outline" className="text-xs">
                          Context Enhanced
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(selectedTemplate.category)}
                    {selectedTemplate.name} Configuration
                  </CardTitle>
                  <CardDescription>
                    Customize the analysis parameters for optimal results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="designType">Design Type</Label>
                      <Input
                        id="designType"
                        placeholder="e.g., Landing page, Product page, App interface"
                        value={promptVariables.designType || ''}
                        onChange={(e) => handleVariableChange('designType', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        placeholder="e.g., SaaS, E-commerce, Healthcare"
                        value={promptVariables.industry || ''}
                        onChange={(e) => handleVariableChange('industry', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetAudience">Target Audience</Label>
                      <Input
                        id="targetAudience"
                        placeholder="e.g., B2B decision makers, Young professionals"
                        value={promptVariables.targetAudience || ''}
                        onChange={(e) => handleVariableChange('targetAudience', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessGoals">Business Goals</Label>
                      <Input
                        id="businessGoals"
                        placeholder="e.g., Increase conversions, Reduce churn"
                        value={promptVariables.businessGoals || ''}
                        onChange={(e) => handleVariableChange('businessGoals', e.target.value)}
                      />
                    </div>
                  </div>

                  {selectedTemplate.category === 'competitor' && (
                    <div className="space-y-2">
                      <Label htmlFor="competitorUrls">Competitor URLs</Label>
                      <Textarea
                        id="competitorUrls"
                        placeholder="Enter competitor URLs, one per line"
                        value={promptVariables.competitorUrls?.join('\n') || ''}
                        onChange={(e) => {
                          const urls = e.target.value.split('\n').filter(url => url.trim());
                          handleVariableChange('competitorUrls', urls);
                        }}
                      />
                    </div>
                  )}

                  {selectedTemplate.category === 'ecommerce_revenue' && (
                    <div className="space-y-2">
                      <Label htmlFor="conversionGoals">Conversion Goals</Label>
                      <Input
                        id="conversionGoals"
                        placeholder="e.g., Increase AOV by 15%, Reduce cart abandonment"
                        value={promptVariables.conversionGoals || ''}
                        onChange={(e) => handleVariableChange('conversionGoals', e.target.value)}
                      />
                    </div>
                  )}

                  {selectedTemplate.category === 'ab_testing' && (
                    <div className="space-y-2">
                      <Label htmlFor="testHypothesis">Test Hypothesis</Label>
                      <Textarea
                        id="testHypothesis"
                        placeholder="Describe what you want to test and why"
                        value={promptVariables.testHypothesis || ''}
                        onChange={(e) => handleVariableChange('testHypothesis', e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="customInstructions">Additional Instructions</Label>
                    <Textarea
                      id="customInstructions"
                      placeholder="Any specific requirements or focus areas..."
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="standard" className="space-y-4">
            <div className="space-y-2">
              <Label>Standard Analysis Type</Label>
              <Select value={selectedUseCase} onValueChange={setSelectedUseCase}>
                <SelectTrigger>
                  <SelectValue placeholder="Select analysis type" />
                </SelectTrigger>
                <SelectContent>
                  {useCases.map((useCase) => (
                    <SelectItem key={useCase.id} value={useCase.id}>
                      <div>
                        <div className="font-medium">{useCase.name}</div>
                        <div className="text-xs text-muted-foreground">{useCase.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
