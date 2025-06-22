
import React from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  FileText, 
  Image, 
  Video, 
  Eye, 
  Trash2,
  Clock
} from 'lucide-react';

interface AnalysisNavigationSidebarProps {
  messages: ChatMessage[];
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
  onViewAttachment: (attachment: ChatAttachment) => void;
}

export const AnalysisNavigationSidebar: React.FC<AnalysisNavigationSidebarProps> = ({
  messages,
  attachments,
  onRemoveAttachment,
  onViewAttachment
}) => {
  const getFileIcon = (type: string) => {
    if (type === 'file') {
      // Could determine by file extension, but defaulting to FileText
      return <FileText className="h-4 w-4" />;
    }
    if (type === 'url') return <Eye className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full bg-gray-50 border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="font-semibold text-gray-900 mb-2">Analysis Navigation</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Badge variant="secondary" className="text-xs">
            {messages.length} messages
          </Badge>
          <Badge variant="outline" className="text-xs">
            {attachments.length} files
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Recent Messages */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {messages.slice(-5).map((message, index) => (
                <div key={message.id || index} className="p-2 bg-gray-50 rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium capitalize text-blue-600">
                      {message.role}
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-700 line-clamp-2">
                    {message.content.substring(0, 100)}...
                  </p>
                </div>
              ))}
              
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs">No messages yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Session Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(attachment.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {attachment.name}
                      </p>
                      {attachment.type === 'url' && attachment.url && (
                        <p className="text-xs text-blue-500 truncate">
                          {attachment.url}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => onViewAttachment(attachment)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => onRemoveAttachment(attachment.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {attachments.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs">No files attached</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};
