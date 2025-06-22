
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Image, 
  Video, 
  Eye, 
  Trash2, 
  Clock, 
  MessageSquare,
  Save,
  CheckCircle 
} from 'lucide-react';

interface AnalysisRightPanelProps {
  currentSessionId?: string;
  analysisMessages?: any[];
  lastAnalysisResult?: any;
  conversationContext?: any;
  onRemoveAttachment?: (id: string) => void;
  onViewAttachment?: (attachment: ChatAttachment) => void;
  autoSaveStatus?: 'saving' | 'saved' | 'error' | 'idle';
}

export const AnalysisRightPanel: React.FC<AnalysisRightPanelProps> = ({
  currentSessionId,
  analysisMessages = [],
  lastAnalysisResult,
  conversationContext,
  onRemoveAttachment,
  onViewAttachment,
  autoSaveStatus = 'idle'
}) => {
  const [activeTab, setActiveTab] = useState('context');

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getAutoSaveIndicator = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return <Badge variant="secondary" className="text-xs"><Save className="h-3 w-3 mr-1" />Saving...</Badge>;
      case 'saved':
        return <Badge variant="default" className="text-xs bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Saved</Badge>;
      case 'error':
        return <Badge variant="destructive" className="text-xs">Save Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Session Details</h3>
          {getAutoSaveIndicator()}
        </div>
        
        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <MessageSquare className="h-3 w-3" />
            <span>{conversationContext?.totalMessages || 0} messages</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="h-3 w-3" />
            <span>{conversationContext?.sessionAttachments?.length || 0} files</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="context" className="text-xs">Context</TabsTrigger>
          <TabsTrigger value="attachments" className="text-xs">Files</TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs">Analysis</TabsTrigger>
        </TabsList>

        {/* Context Tab */}
        <TabsContent value="context" className="flex-1 p-4 pt-2">
          <ScrollArea className="h-full">
            <div className="space-y-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Conversation Summary</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-600">
                  {conversationContext?.messages?.length > 0 ? (
                    <div>
                      <p>Active conversation with {conversationContext.totalMessages} messages</p>
                      <p className="mt-1">
                        Recent topics: Design analysis, implementation guidance
                      </p>
                    </div>
                  ) : (
                    <p>New conversation session</p>
                  )}
                </CardContent>
              </Card>

              {conversationContext?.sessionLinks?.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Referenced URLs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {conversationContext.sessionLinks.slice(0, 3).map((link: any, index: number) => (
                        <div key={index} className="text-xs">
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline truncate block"
                          >
                            {link.title || link.url}
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Attachments Tab */}
        <TabsContent value="attachments" className="flex-1 p-4 pt-2">
          <ScrollArea className="h-full">
            {conversationContext?.sessionAttachments?.length > 0 ? (
              <div className="space-y-2">
                {conversationContext.sessionAttachments.map((attachment: any) => (
                  <Card key={attachment.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1">
                        {getFileIcon(attachment.file_type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {attachment.file_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(attachment.file_size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => onViewAttachment?.(attachment)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          onClick={() => onRemoveAttachment?.(attachment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm py-8">
                No files in this session
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="flex-1 p-4 pt-2">
          <ScrollArea className="h-full">
            {lastAnalysisResult ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Latest Analysis</CardTitle>
                </CardHeader>
                <CardContent className="text-xs">
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">Analysis Type:</p>
                      <p className="text-gray-600">{lastAnalysisResult.analysis_type || 'Design Analysis'}</p>
                    </div>
                    {lastAnalysisResult.confidence_score && (
                      <div>
                        <p className="font-medium">Confidence:</p>
                        <p className="text-gray-600">{Math.round(lastAnalysisResult.confidence_score * 100)}%</p>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">Key Insights:</p>
                      <p className="text-gray-600">
                        {lastAnalysisResult.analysis_results?.substring(0, 150)}...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center text-gray-500 text-sm py-8">
                No analysis results yet
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
