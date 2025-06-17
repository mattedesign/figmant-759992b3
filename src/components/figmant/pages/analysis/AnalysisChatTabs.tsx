
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  MessageSquare,
  Paperclip,
  Upload
} from 'lucide-react';

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
          value="attachments"
          style={{
            borderRadius: '6px',
            background: activeTab === 'attachments' ? 'var(--Background-primary, #FFF)' : 'transparent',
            boxShadow: activeTab === 'attachments' ? '0px 1px 1px 0px rgba(11, 19, 36, 0.10), 0px 1px 3px 0px rgba(11, 19, 36, 0.10)' : 'none'
          }}
        >
          <Paperclip className="h-4 w-4 mr-2" />
          Attachments
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chat" className="mt-0">
        {/* Chat content will be handled by parent component */}
      </TabsContent>

      <TabsContent value="attachments" className="mt-6">
        <div className="space-y-4">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Upload design files
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-xs text-gray-400">
                Supports: PNG, JPG, PDF (max 50MB each)
              </p>
            </label>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('file-upload')?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Choose Files
            </button>
            <button
              onClick={() => setShowUrlInput(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Paperclip className="h-4 w-4" />
              Add URL
            </button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
