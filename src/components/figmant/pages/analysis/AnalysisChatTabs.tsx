
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  MessageSquare,
  Sparkles,
  Upload
} from 'lucide-react';
import { TemplatesPage } from '../TemplatesPage';

interface AnalysisChatTabsProps {
  showUrlInput: boolean;
  setShowUrlInput: (show: boolean) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload?: (files: FileList) => void;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export const AnalysisChatTabs: React.FC<AnalysisChatTabsProps> = ({
  showUrlInput,
  setShowUrlInput,
  onFileSelect,
  onFileUpload,
  activeTab = "chat",
  onTabChange
}) => {
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && onFileUpload) {
      onFileUpload(files);
    }
    onFileSelect(event);
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList 
        className="grid w-full grid-cols-2"
        style={{
          borderRadius: '8px',
          background: '#E3F5FF'
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
          value="templates"
          style={{
            borderRadius: '6px',
            background: activeTab === 'templates' ? 'var(--Background-primary, #FFF)' : 'transparent',
            boxShadow: activeTab === 'templates' ? '0px 1px 1px 0px rgba(11, 19, 36, 0.10), 0px 1px 3px 0px rgba(11, 19, 36, 0.10)' : 'none'
          }}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Templates
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chat" className="mt-0">
        {/* Chat content will be handled by parent component */}
      </TabsContent>

      <TabsContent value="templates" className="mt-6">
        <div className="space-y-4">
          <TemplatesPage />
        </div>
      </TabsContent>
    </Tabs>
  );
};
