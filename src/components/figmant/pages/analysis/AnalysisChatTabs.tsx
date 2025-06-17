
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  MessageSquare,
  FileText,
  Upload
} from 'lucide-react';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';
import { TemplateIcon } from './components/TemplateIcon';

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

interface AnalysisChatTabsProps {
  showUrlInput: boolean;
  setShowUrlInput: (show: boolean) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload?: (files: FileList) => void;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  onPromptTemplateSelect?: (templateId: string) => void;
}

export const AnalysisChatTabs: React.FC<AnalysisChatTabsProps> = ({
  showUrlInput,
  setShowUrlInput,
  onFileSelect,
  onFileUpload,
  activeTab = "chat",
  onTabChange,
  onPromptTemplateSelect
}) => {
  const { data: promptExamples = [] } = useClaudePromptExamples();

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && onFileUpload) {
      onFileUpload(files);
    }
    onFileSelect(event);
  };

  // Group templates by category
  const groupedTemplates = promptExamples.reduce((acc, template) => {
    const category = template.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, typeof promptExamples>);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList 
        className="grid w-full grid-cols-2"
        style={{
          borderRadius: '8px',
          background: 'var(--action-background-neutral-light_active, rgba(28, 34, 43, 0.05))'
        }}
      >
        <TabsTrigger 
          value="chat"
          style={{
            borderRadius: '6px',
            background: activeTab === 'chat' ? 'var(--Background-primary, #FFF)' : 'transparent',
            boxShadow: activeTab === 'chat' ? '0px 1px 1px 0px rgba(11, 19, 36, 0.10), 0px 1px 3px 0px rgba(11, 19, 36, 0.10)' : 'none'
          }}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat
        </TabsTrigger>
        <TabsTrigger 
          value="prompts"
          style={{
            borderRadius: '6px',
            background: activeTab === 'prompts' ? 'var(--Background-primary, #FFF)' : 'transparent',
            boxShadow: activeTab === 'prompts' ? '0px 1px 1px 0px rgba(11, 19, 36, 0.10), 0px 1px 3px 0px rgba(11, 19, 36, 0.10)' : 'none'
          }}
        >
          <FileText className="h-4 w-4 mr-2" />
          Prompts
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chat" className="mt-0">
        {/* Chat content will be handled by parent component */}
      </TabsContent>

      <TabsContent value="prompts" className="mt-6">
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {Object.entries(groupedTemplates).map(([category, templates]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 sticky top-0 bg-white py-2">
                <TemplateIcon category={category} />
                <span className="capitalize">{category.replace('_', ' ')}</span>
              </div>
              
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => onPromptTemplateSelect?.(template.id)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900">{template.title}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {template.description}
                    </div>
                    {template.effectiveness_rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-yellow-600">★</span>
                        <span className="text-xs text-gray-500">{template.effectiveness_rating}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {promptExamples.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Templates Available</h3>
              <p className="text-gray-500 text-sm">
                Prompt templates will appear here when they're available.
              </p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
