
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Folder,
  Sparkles
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TemplatesSidebarProps {
  promptTemplates?: any[];
  selectedPromptCategory?: string;
  selectedPromptTemplate?: string;
  onPromptCategoryChange?: (category: string) => void;
  onPromptTemplateChange?: (templateId: string) => void;
}

const templateCategories = [
  { id: 'web-app', name: 'Web app', icon: '💻' },
  { id: 'ui-design', name: 'UI/UI Design', icon: '🎨' },
  { id: 'mobile-app', name: 'Mobile app', icon: '📱' },
  { id: 'branding', name: 'Branding & logo', icon: '🏷️' },
  { id: 'illustration', name: 'Illustration', icon: '🎭' },
  { id: '3d-design', name: '3D Design', icon: '🎲' }
];

export const TemplatesSidebar: React.FC<TemplatesSidebarProps> = ({
  promptTemplates = [],
  selectedPromptCategory,
  selectedPromptTemplate,
  onPromptCategoryChange,
  onPromptTemplateChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-white border-l border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-80'
    } flex-shrink-0`}>
      {/* Collapse/Expand Button */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Templates</span>
            <span className="text-sm font-medium text-gray-900">Analysis</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-6 w-6 p-0"
        >
          {isCollapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-4">
          {/* Your Prompts Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Folder className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">Your Prompts</span>
            </div>
            <div className="text-sm text-gray-500">No custom prompts yet</div>
          </div>

          {/* Template Categories */}
          <div className="space-y-2">
            {templateCategories.map((category) => (
              <Card 
                key={category.id}
                className="border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onPromptCategoryChange?.(category.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-sm">{category.icon}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    </div>
                    <Folder className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Template Display */}
          {selectedPromptTemplate && (
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Active Template</span>
              </div>
              <div className="text-xs text-blue-700">
                {promptTemplates.find(t => t.id === selectedPromptTemplate)?.title || 'Selected Template'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
