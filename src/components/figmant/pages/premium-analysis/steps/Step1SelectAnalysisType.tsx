
import React, { useState, useMemo } from 'react';
import { StepProps } from '../types';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';
import { TemplatePreviewModal } from '../components/TemplatePreviewModal';
import { TemplateSearchFilters } from '../components/TemplateSearchFilters';
import { TemplateGrid } from '../components/TemplateGrid';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';

// Extended interface to include the missing properties
interface ExtendedClaudePromptExample extends ClaudePromptExample {
  contextual_fields?: any[];
  contextFields?: any[];
}

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
      // Cast to extended interface for safe property access
      const extendedTemplate = template as ExtendedClaudePromptExample;
      const contextualFields = extendedTemplate.contextual_fields || extendedTemplate.contextFields || [];
      
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
          contextualFields
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
        <TemplateSearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
          resultsCount={filteredAndSortedTemplates.length}
        />
      </div>
      
      {/* Template Grid */}
      <div className="flex-1 overflow-y-auto">
        <TemplateGrid
          templates={filteredAndSortedTemplates}
          selectedType={stepData.selectedType}
          onTemplateSelect={handleTemplateSelect}
          onTemplatePreview={handlePreviewTemplate}
        />
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
