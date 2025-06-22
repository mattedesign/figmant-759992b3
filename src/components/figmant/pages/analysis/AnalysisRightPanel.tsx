
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { 
  MessageSquare, 
  Clock, 
  FileText, 
  Image, 
  Video, 
  Eye, 
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface ConversationContext {
  sessionId: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
    attachments?: number;
  }>;
  totalMessages: number;
  sessionAttachments: any[];
  sessionLinks: any[];
  historicalContext: string;
  attachmentContext: string[];
  tokenEstimate: number;
}

interface AnalysisRightPanelProps {
  currentSessionId?: string;
  conversationContext: ConversationContext;
  onRemoveAttachment?: (id: string) => void;
  onViewAttachment?: (attachment: ChatAttachment) => void;
  autoSaveStatus?: 'saving' | 'saved' | 'error' | 'idle';
  lastAnalysisResult?: any;
  messageCount?: number;
  lastSaved?: Date;
}

export const AnalysisRightPanel: React.FC<AnalysisRightPanelProps> = ({
  currentSessionId,
  conversationContext,
  onRemoveAttachment,
  onViewAttachment,
  autoSaveStatus = 'idle',
  lastAnalysisResult,
  messageCount = 0,
  lastSaved
}) => {
  const [activeTab, setActiveTab] = useState('context');

  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType?.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (messages: any[]) => {
    if (messages.length < 2) return 'Just started';
    
    const first = new Date(messages[0]?.timestamp);
    const last = new Date(messages[messages.length - 1]?.timestamp);
    const diffMs = last.getTime() - first.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} minutes`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header with Auto-save Status */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Session Details</h3>
          <AutoSaveIndicator 
            status={autoSaveStatus}
            lastSaved={lastSaved}
            messageCount={messageCount}
          />
        </div>
        
        {/* Session Statistics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-2 rounded-md">
            <MessageSquare className="h-4 w-4" />
            <div>
              <div className="font-medium">{conversationContext.totalMessages}</div>
              <div className="text-xs">Messages</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-2 rounded-md">
            <Clock className="h-4 w-4" />
            <div>
              <div className="font-medium">{formatDuration(conversationContext.messages)}</div>
              <div className="text-xs">Duration</div>
            </div>
          </div>
        </div>

        {/* Context Quality Indicator */}
        {conversationContext.historicalContext && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2 text-blue-700">
              <RefreshCw className="h-3 w-3" />
              <span className="text-xs font-medium">Enhanced Context Active</span>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {Math.ceil(conversationContext.tokenEstimate / 100)}% context utilization
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="context" className="text-xs">
            Context
          </TabsTrigger>
          <TabsTrigger value="files" className="text-xs">
            Files ({(conversationContext.sessionAttachments?.length || 0) + (conversationContext.sessionLinks?.length || 0)})
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs">
            Analysis
          </TabsTrigger>
        </TabsList>

        {/* Context Tab */}
        <TabsContent value="context" className="flex-1 p-4 pt-2">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {/* Conversation Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Conversation Flow
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-600 space-y-2">
                  {conversationContext.messages.length > 0 ? (
                    <>
                      <div className="flex justify-between">
                        <span>Total exchanges:</span>
                        <span className="font-medium">{Math.ceil(conversationContext.totalMessages / 2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Session duration:</span>
                        <span className="font-medium">{formatDuration(conversationContext.messages)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Context depth:</span>
                        <span className="font-medium">
                          {conversationContext.historicalContext ? 'Enhanced' : 'Basic'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-2">
                      <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p>New conversation session</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Topics */}
              {conversationContext.messages.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Recent Topics</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <div className="space-y-2">
                      {conversationContext.messages.slice(-3).map((msg, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-2">
                          <div className="font-medium text-blue-700 capitalize">{msg.role}</div>
                          <div className="text-gray-600 line-clamp-2">
                            {msg.content.substring(0, 80)}...
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Attachments Context */}
              {conversationContext.attachmentContext.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Referenced Materials</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs">
                    <div className="space-y-1">
                      {conversationContext.attachmentContext.slice(0, 3).map((context, index) => (
                        <div key={index} className="text-gray-600">
                          {context}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="flex-1 p-4 pt-2">
          <ScrollArea className="h-full">
            {(conversationContext.sessionAttachments?.length || 0) + (conversationContext.sessionLinks?.length || 0) > 0 ? (
              <div className="space-y-3">
                {/* File Attachments */}
                {conversationContext.sessionAttachments?.map((attachment) => (
                  <Card key={attachment.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getFileIcon(attachment.file_type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {attachment.file_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {attachment.file_size && formatFileSize(attachment.file_size)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(attachment.upload_timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => onViewAttachment?.(attachment)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => onRemoveAttachment?.(attachment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Link Attachments */}
                {conversationContext.sessionLinks?.map((link) => (
                  <Card key={link.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {link.link_title || 'Website Link'}
                        </p>
                        <p className="text-xs text-blue-500 truncate">
                          {link.url}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(link.upload_timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => onRemoveAttachment?.(link.id)}
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
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>No files in this session</p>
                <p className="text-xs mt-1">Upload designs or add URLs to get started</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="flex-1 p-4 pt-2">
          <ScrollArea className="h-full">
            {lastAnalysisResult ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Latest Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-3">
                    <div>
                      <p className="font-medium text-gray-700">Analysis Type:</p>
                      <p className="text-gray-600">{lastAnalysisResult.analysis_type || 'Design Analysis'}</p>
                    </div>
                    {lastAnalysisResult.confidence_score && (
                      <div>
                        <p className="font-medium text-gray-700">Confidence:</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${lastAnalysisResult.confidence_score * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {Math.round(lastAnalysisResult.confidence_score * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-700">Key Insights:</p>
                      <p className="text-gray-600 line-clamp-3">
                        {typeof lastAnalysisResult.analysis_results === 'string' 
                          ? lastAnalysisResult.analysis_results.substring(0, 200) + '...'
                          : 'Analysis completed successfully'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm py-8">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>No analysis results yet</p>
                <p className="text-xs mt-1">Send a message to get AI insights</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
