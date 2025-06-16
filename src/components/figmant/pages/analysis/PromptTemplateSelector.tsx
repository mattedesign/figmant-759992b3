
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  original_prompt: string;
}

interface BestPrompt {
  id: string;
}

interface PromptTemplateSelectorProps {
  promptTemplates?: PromptTemplate[];
  promptsLoading: boolean;
  selectedPromptCategory: string;
  selectedPromptTemplate: string;
  onPromptCategoryChange: (category: string) => void;
  onPromptTemplateChange: (template: string) => void;
  bestPrompt?: BestPrompt;
}

export const PromptTemplateSelector: React.FC<PromptTemplateSelectorProps> = ({
  promptTemplates,
  promptsLoading,
  selectedPromptCategory,
  selectedPromptTemplate,
  onPromptCategoryChange,
  onPromptTemplateChange,
  bestPrompt
}) => {
  // Get unique categories from prompt templates
  const promptCategories = React.useMemo(() => {
    if (!promptTemplates) return [];
    const categories = [...new Set(promptTemplates.map(p => p.category))];
    return categories;
  }, [promptTemplates]);

  // Get templates for selected category
  const categoryTemplates = React.useMemo(() => {
    if (!promptTemplates || !selectedPromptCategory) return [];
    return promptTemplates.filter(p => p.category === selectedPromptCategory);
  }, [promptTemplates, selectedPromptCategory]);

  const selectedTemplate = promptTemplates?.find(p => p.id === selectedPromptTemplate);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Analysis Type</label>
          <Select value={selectedPromptCategory} onValueChange={onPromptCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              {promptCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.replace('_', ' ').toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Prompt Template</label>
          <Select 
            value={selectedPromptTemplate} 
            onValueChange={onPromptTemplateChange}
            disabled={!selectedPromptCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select prompt template" />
            </SelectTrigger>
            <SelectContent>
              {categoryTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center gap-2">
                    {template.title}
                    {bestPrompt?.id === template.id && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Best
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {selectedTemplate && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Selected Template</CardTitle>
            <CardDescription className="text-xs">
              {selectedTemplate.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
              {selectedTemplate.original_prompt.slice(0, 200)}...
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
