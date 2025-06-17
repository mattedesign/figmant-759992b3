
import React from 'react';
import { TemplateIcon } from './TemplateIcon';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  business_domain?: string;
  claude_response?: string;
  created_at?: string;
  created_by?: string;
  effectiveness_rating?: number;
  is_active?: boolean;
  original_prompt?: string;
  use_case_context?: string;
}

interface TemplatesPanelProps {
  promptTemplates: PromptTemplate[];
  selectedPromptTemplate?: string;
  onPromptTemplateSelect?: (templateId: string) => void;
}

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({
  promptTemplates = [],
  selectedPromptTemplate,
  onPromptTemplateSelect
}) => {
  // Group templates by category - ensure promptTemplates is an array
  const templatesArray = Array.isArray(promptTemplates) ? promptTemplates : [];
  const groupedTemplates = templatesArray.reduce((acc, template) => {
    const category = template.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, PromptTemplate[]>);

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedTemplates).map(([category, templates]) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <TemplateIcon category={category} />
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
                  <div className="font-medium text-sm">{template.title}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
