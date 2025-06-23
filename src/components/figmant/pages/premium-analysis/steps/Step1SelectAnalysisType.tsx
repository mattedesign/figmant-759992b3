import React, { useState, useMemo } from 'react';
import { StepProps } from '../types';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp, Zap, Crown, Search, Star, Eye, Filter } from 'lucide-react';
import { TemplatePreviewModal } from '../components/TemplatePreviewModal';

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

const renderStarRating = (rating: number) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
    </div>
  );
};

export const Step1SelectAnalysisType: React.FC<StepProps> = ({
  stepData,
  setStepData,
  currentStep,
  totalSteps
}) => {
  const { data: promptTemplates = [], isLoading } = useClaudePromptExamples();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('most_popular');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const handleTemplateSelect = (templateId: string, event?: React.MouseEvent) => {
    // Prevent any default behavior and event bubbling
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log('🎯 Template selected in wizard:', templateId);
    
    const template = promptTemplates.find(t => t.id === templateId);
    if (template) {
      // Save both selectedType and selectedTemplate for proper validation
      setStepData(prev => ({
        ...prev,
        selectedType: templateId,
        selectedTemplate: template, // Save full template object
        projectName: `${template.title} Analysis`,
        analysisGoals: template.description || `Analysis using ${template.title} template`,
        contextualData: {
          ...prev.contextualData,
          selectedTemplate: template,
          templateCategory: template.category,
          templateTitle: template.title,
          contextualFields: template?.contextual_fields || template?.contextFields || []
        }
      }));
      
      console.log('✅ Template selection updated in wizard state:', template);
    }
  };

  const handlePreviewTemplate = (template: any, event?: React.MouseEvent) => {
    // Prevent event bubbling to template card
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setPreviewTemplate(template);
  };

  // Filter and sort templates
  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = promptTemplates.filter(template => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });

    // Sort templates
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'most_popular':
          return (b.effectiveness_rating || 0) - (a.effectiveness_rating || 0);
        case 'lowest_cost':
          return (a.credit_cost || 3) - (b.credit_cost || 3);
        case 'highest_cost':
          return (b.credit_cost || 3) - (a.credit_cost || 3);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [promptTemplates, searchQuery, categoryFilter, sortBy]);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(promptTemplates.map(t => t.category))];
    return uniqueCategories.map(cat => ({
      value: cat,
      label: cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
  }, [promptTemplates]);

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
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Analysis Type</h1>
          <p className="text-gray-600">
            Choose the type of analysis you want to perform
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Choose a Template:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <TrendingUp className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="most_popular">Most Popular</SelectItem>
                <SelectItem value="lowest_cost">Lowest Cost</SelectItem>
                <SelectItem value="highest_cost">Highest Cost</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              {filteredAndSortedTemplates.length} template{filteredAndSortedTemplates.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </div>
      
      {/* Template Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {filteredAndSortedTemplates.map((template) => {
              const IconComponent = getCategoryIcon(template.category);
              const isSelected = stepData.selectedType === template.id;
              const isPopular = template.effectiveness_rating > 8;
              
              return (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] min-h-0 relative group ${
                    isSelected ? 'border-2 border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                  }`}
                  onClick={(e) => handleTemplateSelect(template.id, e)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category.replace('_', ' ')}
                        </Badge>
                        {isPopular && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Most Popular
                          </Badge>
                        )}
                      </div>
                      
                      {/* Preview Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handlePreviewTemplate(template, e)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <CardTitle className="text-base">{template.title}</CardTitle>
                    {template.description && (
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    )}
                    
                    {/* Star Rating */}
                    {template.effectiveness_rating && (
                      <div className="mt-2">
                        {renderStarRating(template.effectiveness_rating)}
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    {template.use_case_context && (
                      <div className="text-xs text-gray-600 mb-2">
                        <span className="font-medium">Best for:</span> {template.use_case_context}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Credit Cost: {template.credit_cost || 3}</span>
                      {template.effectiveness_rating && (
                        <span>Rating: {template.effectiveness_rating}/10</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredAndSortedTemplates.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600">
                Try adjusting your search query or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelectTemplate={(templateId) => {
            handleTemplateSelect(templateId);
          }}
        />
      )}
    </div>
  );
};
