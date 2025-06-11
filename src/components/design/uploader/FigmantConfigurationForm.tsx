
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Target, BarChart3, Users, ShoppingCart, FlaskConical } from 'lucide-react';
import { FigmantPromptTemplate, FigmantPromptVariables } from '@/types/figmant';

interface FigmantConfigurationFormProps {
  selectedTemplate: FigmantPromptTemplate;
  promptVariables: FigmantPromptVariables;
  onVariableChange: (key: keyof FigmantPromptVariables, value: string | string[]) => void;
  customInstructions: string;
  onCustomInstructionsChange: (value: string) => void;
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

export const FigmantConfigurationForm = ({
  selectedTemplate,
  promptVariables,
  onVariableChange,
  customInstructions,
  onCustomInstructionsChange
}: FigmantConfigurationFormProps) => {
  return (
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
              onChange={(e) => onVariableChange('designType', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="e.g., SaaS, E-commerce, Healthcare"
              value={promptVariables.industry || ''}
              onChange={(e) => onVariableChange('industry', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., B2B decision makers, Young professionals"
              value={promptVariables.targetAudience || ''}
              onChange={(e) => onVariableChange('targetAudience', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessGoals">Business Goals</Label>
            <Input
              id="businessGoals"
              placeholder="e.g., Increase conversions, Reduce churn"
              value={promptVariables.businessGoals || ''}
              onChange={(e) => onVariableChange('businessGoals', e.target.value)}
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
                onVariableChange('competitorUrls', urls);
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
              onChange={(e) => onVariableChange('conversionGoals', e.target.value)}
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
              onChange={(e) => onVariableChange('testHypothesis', e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="customInstructions">Additional Instructions</Label>
          <Textarea
            id="customInstructions"
            placeholder="Any specific requirements or focus areas..."
            value={customInstructions}
            onChange={(e) => onCustomInstructionsChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
