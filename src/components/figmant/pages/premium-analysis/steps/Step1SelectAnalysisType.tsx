import React, { useState, useEffect } from 'react';
import { StepProps } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { Lightbulb, Target, TrendingUp, Users, Zap, CheckCircle, Star } from 'lucide-react';
import { CreditCostDisplay } from '../components/CreditCostDisplay';
import { supabase } from '@/integrations/supabase/client';
import { useTemplateCreditStore } from '@/stores/templateCreditStore';
import { getAnalysisCost } from '@/hooks/premium-analysis/creditCostManager';

interface Step1SelectAnalysisTypeProps extends StepProps {
  onCreditCostChange?: (creditCost: number) => void;
  onNextStep?: () => void;
}

export const Step1SelectAnalysisType: React.FC<Step1SelectAnalysisTypeProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps,
  onCreditCostChange,
  onNextStep
}) => {
  const { data: templates = [], isLoading } = useFigmantPromptTemplates();
  const [selectedTemplateCreditCost, setSelectedTemplateCreditCost] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [templateCosts, setTemplateCosts] = useState<Record<string, number>>({});
  const { setTemplateCreditCost, resetCreditCost } = useTemplateCreditStore();

  // Reset credit cost when leaving the page
  useEffect(() => {
    return () => {
      resetCreditCost();
    };
  }, [resetCreditCost]);

  // Load template costs asynchronously
  useEffect(() => {
    const loadCosts = async () => {
      const costs: Record<string, number> = {};
      for (const template of templates) {
        try {
          costs[template.id] = await getAnalysisCost(template.id);
        } catch (error) {
          console.error(`Error loading cost for template ${template.id}:`, error);
          costs[template.id] = 3; // fallback
        }
      }
      setTemplateCosts(costs);
    };
    
    if (templates.length > 0) {
      loadCosts();
    }
  }, [templates]);

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

  const onSelectTemplate = (template: any) => {
    handleTemplateSelect(template.id);
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

  // Filter templates based on search term and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add sorting logic after filtering
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'cost-low': 
        return (templateCosts[a.id] || 3) - (templateCosts[b.id] || 3);
      case 'cost-high': 
        return (templateCosts[b.id] || 3) - (templateCosts[a.id] || 3);
      case 'alphabetical': 
        return (a.title || '').localeCompare(b.title || '');
      case 'popular':
      default:
        return 0; // Keep original order for now
    }
  });

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
        <div className="mb-4 flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="master">Master Analysis</SelectItem>
              <SelectItem value="competitor">Competitor</SelectItem>
              <SelectItem value="visual_hierarchy">Visual Design</SelectItem>
              <SelectItem value="ecommerce_revenue">E-commerce</SelectItem>
              <SelectItem value="ab_testing">A/B Testing</SelectItem>
              <SelectItem value="accessibility">Accessibility</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="cost-low">Lowest Cost</SelectItem>
              <SelectItem value="cost-high">Highest Cost</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Template Count Indicator */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {sortedTemplates.length} of {templates.length} templates
        </div>

        {/* Empty State */}
        {sortedTemplates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No templates match your search criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-2"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Templates Grid */}
        {sortedTemplates.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedTemplates.map((template) => (
              <Card
                key={template.id}
                className={`relative cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group ${
                  stepData.selectedType === template.id 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                {/* Most Popular Badge */}
                {(templateCosts[template.id] || 3) <= 3 && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 text-xs">
                    Most Popular
                  </Badge>
                )}

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
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Preview Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {previewTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    ⚡
                  </div>
                  {previewTemplate.title}
                </DialogTitle>
                <DialogDescription>{previewTemplate.description}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Analysis Type</h4>
                    <Badge variant="outline">{previewTemplate.category}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Credit Cost</h4>
                    <span className="text-xl font-bold">
                      {templateCosts[previewTemplate.id] || previewTemplate.credit_cost || 3} credits
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Effectiveness Rating</h4>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">4/5</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">What This Analysis Provides</h4>
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="text-sm">
                      Comprehensive analysis with actionable insights, improvement recommendations, 
                      and strategic guidance tailored to your specific needs.
                    </p>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  onSelectTemplate(previewTemplate);
                  setShowPreview(false);
                  // Add the missing onNextStep call to automatically advance to next step
                  if (onNextStep) {
                    onNextStep();
                  }
                }}>
                  Select This Template
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
