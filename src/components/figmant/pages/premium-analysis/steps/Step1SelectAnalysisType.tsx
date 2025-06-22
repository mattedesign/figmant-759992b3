
import React, { useState, useEffect, useMemo } from 'react';
import { StepProps } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { Lightbulb, Target, TrendingUp, Users, Zap, CheckCircle, Star, Search, Filter, Sparkles } from 'lucide-react';
import { CreditCostDisplay } from '../components/CreditCostDisplay';
import { TemplatePreviewModal } from '../components/TemplatePreviewModal';
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
  const { setTemplateCreditCost, resetCreditCost } = useTemplateCreditStore();
  
  // Enhanced state for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Reset credit cost when leaving the page
  useEffect(() => {
    return () => {
      resetCreditCost();
    };
  }, [resetCreditCost]);

  // Get unique categories from templates
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(templates.map(t => t.category))];
    return uniqueCategories.filter(Boolean);
  }, [templates]);

  // Filter and sort templates
  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = searchTerm === '' || 
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort templates
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'cost-low':
          return (a.credit_cost || 3) - (b.credit_cost || 3);
        case 'cost-high':
          return (b.credit_cost || 3) - (a.credit_cost || 3);
        case 'rating':
          return (b.effectiveness_rating || 0) - (a.effectiveness_rating || 0);
        case 'popular':
        default:
          // Sort by effectiveness rating (higher is better) then by category
          const ratingDiff = (b.effectiveness_rating || 0) - (a.effectiveness_rating || 0);
          if (ratingDiff !== 0) return ratingDiff;
          return a.title.localeCompare(b.title);
      }
    });
  }, [templates, searchTerm, selectedCategory, sortBy]);

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

  const handlePreview = (template: any) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
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

  const getPopularityBadge = (template: any) => {
    const rating = template.effectiveness_rating || 0;
    if (rating >= 9) {
      return (
        <Badge className="absolute top-3 right-3 bg-yellow-500 text-yellow-900 border-yellow-400">
          <Sparkles className="h-3 w-3 mr-1" />
          Most Popular
        </Badge>
      );
    }
    if (rating >= 8) {
      return (
        <Badge className="absolute top-3 right-3 bg-green-500 text-green-900 border-green-400">
          Highly Rated
        </Badge>
      );
    }
    return null;
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

      <div className="max-w-6xl mx-auto">
        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates by name, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="capitalize">
                      {category.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="cost-low">Lowest Cost</SelectItem>
                  <SelectItem value="cost-high">Highest Cost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Results count */}
          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedTemplates.length} of {templates.length} templates
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory.replace('_', ' ')}`}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedTemplates.map((template) => (
            <div
              key={template.id}
              className={`group relative flex min-w-[260px] p-4 flex-col items-start gap-3 flex-1 rounded-3xl border cursor-pointer transition-all hover:shadow-lg ${
                stepData.selectedType === template.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              {/* Popularity Badge */}
              {getPopularityBadge(template)}
              
              <CardHeader className="pb-3 w-full">
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      stepData.selectedType === template.id 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getIcon(template.category)}
                    </div>
                    <div className="flex-1">
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
              
              <CardContent className="w-full pt-0">
                <CardDescription className="text-sm mb-4">
                  {template.description}
                </CardDescription>
                
                {/* Effectiveness Rating */}
                {template.effectiveness_rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-medium text-gray-600">Effectiveness:</span>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < template.effectiveness_rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({template.effectiveness_rating}/5)</span>
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-lg text-blue-600">{template.credit_cost || 3}</span>
                    <span className="text-xs text-gray-500">credits</span>
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(template);
                      }}
                      className="text-xs"
                    >
                      Preview
                    </Button>
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateSelect(template.id);
                      }}
                      className="text-xs"
                      variant={stepData.selectedType === template.id ? "default" : "outline"}
                    >
                      {stepData.selectedType === template.id ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          ))}
        </div>

        {filteredAndSortedTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or category filter
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  );
};
