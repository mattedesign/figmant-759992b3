
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  Paperclip, 
  Link as LinkIcon,
  File,
  Image,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ChatSession, ChatAttachmentRecord, ChatLinkRecord } from '@/services/chatSessionService';

interface ChatSessionHistoryProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  sessionAttachments: ChatAttachmentRecord[];
  sessionLinks: ChatLinkRecord[];
  onCreateNewSession: () => void;
  onSwitchSession: (sessionId: string) => void;
  isCreatingSession: boolean;
}

export const ChatSessionHistory: React.FC<ChatSessionHistoryProps> = ({
  sessions,
  currentSessionId,
  sessionAttachments,
  sessionLinks,
  onCreateNewSession,
  onSwitchSession,
  isCreatingSession
}) => {
  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File className="h-4 w-4" />;
    
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="space-y-4">
      {/* Header with New Session Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chat Sessions</h3>
        <Button
          onClick={onCreateNewSession}
          size="sm"
          disabled={isCreatingSession}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Session
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="h-64">
        <div className="space-y-2">
          {sessions.map((session) => (
            <Card 
              key={session.id}
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                currentSessionId === session.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onSwitchSession(session.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">
                      {session.session_name || 'Untitled Session'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(session.last_activity), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  {currentSessionId === session.id && (
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {sessions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chat sessions yet</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Current Session Assets */}
      {currentSessionId && (sessionAttachments.length > 0 || sessionLinks.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Session Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Attachments */}
            {sessionAttachments.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Files ({sessionAttachments.length})
                  </span>
                </div>
                <div className="space-y-1">
                  {sessionAttachments.slice(0, 3).map((attachment) => (
                    <div 
                      key={attachment.id}
                      className="flex items-center gap-2 p-2 rounded border text-xs"
                    >
                      {getFileIcon(attachment.file_type)}
                      <span className="flex-1 truncate">{attachment.file_name}</span>
                      <span className="text-gray-500">
                        {formatFileSize(attachment.file_size)}
                      </span>
                    </div>
                  ))}
                  {sessionAttachments.length > 3 && (
                    <p className="text-xs text-gray-500 pl-6">
                      +{sessionAttachments.length - 3} more files
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Links */}
            {sessionLinks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Links ({sessionLinks.length})
                  </span>
                </div>
                <div className="space-y-1">
                  {sessionLinks.slice(0, 3).map((link) => (
                    <div 
                      key={link.id}
                      className="flex items-center gap-2 p-2 rounded border text-xs"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="flex-1 truncate">
                        {link.link_title || new URL(link.url).hostname}
                      </span>
                    </div>
                  ))}
                  {sessionLinks.length > 3 && (
                    <p className="text-xs text-gray-500 pl-6">
                      +{sessionLinks.length - 3} more links
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
