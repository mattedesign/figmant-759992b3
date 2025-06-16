
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Target, BarChart3, Users, ShoppingCart, FlaskConical, ChevronRight, FileText, Star } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface AnalysisDynamicRightPanelProps {
  mode: 'templates' | 'analysis';
  promptTemplates?: any[];
  selectedPromptCategory?: string;
  selectedPromptTemplate?: string;
  onPromptTemplateSelect?: (templateId: string) => void;
  onPromptCategoryChange?: (category: string) => void;
  currentAnalysis?: any;
  attachments?: ChatAttachment[];
  onAnalysisClick?: () => void;
  onBackClick?: () => void;
}

const getTemplateIcon = (category: string) => {
  const cat = category?.toLowerCase() || '';
  
  if (cat.includes('master') || cat.includes('comprehensive')) {
    return Sparkles;
  } else if (cat.includes('competitor') || cat.includes('competitive')) {
    return Target;
  } else if (cat.includes('visual') || cat.includes('hierarchy')) {
    return BarChart3;
  } else if (cat.includes('copy') || cat.includes('messaging') || cat.includes('content')) {
    return Users;
  } else if (cat.includes('ecommerce') || cat.includes('revenue') || cat.includes('conversion')) {
    return ShoppingCart;
  } else if (cat.includes('ab') || cat.includes('test') || cat.includes('experiment')) {
    return FlaskConical;
  } else {
    return Sparkles;
  }
};

export const AnalysisDynamicRightPanel: React.FC<AnalysisDynamicRightPanelProps> = ({
  mode,
  promptTemplates = [],
  selectedPromptCategory,
  selectedPromptTemplate,
  onPromptTemplateSelect,
  onPromptCategoryChange,
  currentAnalysis,
  attachments = [],
  onAnalysisClick,
  onBackClick
}) => {
  if (mode === 'templates') {
    // Group templates by category
    const groupedTemplates = promptTemplates.reduce((acc, template) => {
      const category = template.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(template);
      return acc;
    }, {} as Record<string, any[]>);

    return (
      <div className="h-full bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-base">Prompt Templates</h3>
          <p className="text-xs text-gray-500 mt-1">Select a template to auto-fill your analysis</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(groupedTemplates).map(([category, templates]) => {
            const TemplateIcon = getTemplateIcon(category);
            
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <TemplateIcon className="h-4 w-4" />
                  <span>{category}</span>
                </div>
                
                <div className="space-y-1">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => onPromptTemplateSelect?.(template.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedPromptTemplate === template.id
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {template.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Analysis mode
  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base">Analysis Details</h3>
          {onBackClick && (
            <Button variant="ghost" size="sm" onClick={onBackClick}>
              Back
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {currentAnalysis ? (
          <div className="space-y-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={onAnalysisClick}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {currentAnalysis.title || 'Current Analysis'}
                  </CardTitle>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Files:</span>
                    <span className="font-medium">{attachments.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="default" className="text-xs">
                      {currentAnalysis.status || 'In Progress'}
                    </Badge>
                  </div>
                  {currentAnalysis.score && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Score:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="font-medium">{currentAnalysis.score}/10</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {attachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Attachments</h4>
                <div className="space-y-1">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded text-sm">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="flex-1 truncate">{attachment.name}</span>
                      <Badge 
                        variant={attachment.status === 'uploaded' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {attachment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No analysis in progress</p>
          </div>
        )}
      </div>
    </div>
  );
};
