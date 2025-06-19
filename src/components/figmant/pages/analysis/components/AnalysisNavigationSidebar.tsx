
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PanelRightClose, ChevronRight, FileText, Globe, Brain, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { FileThumbail } from './FileThumbail';
import { ScreenshotDisplay } from './ScreenshotDisplay';
import { AnalysisInsights } from './AnalysisInsights';

interface AnalysisNavigationSidebarProps {
  messages: ChatMessage[];
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
  onViewAttachment: (attachment: ChatAttachment) => void;
  lastAnalysisResult?: any;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AnalysisNavigationSidebar: React.FC<AnalysisNavigationSidebarProps> = ({
  messages,
  attachments,
  onRemoveAttachment,
  onViewAttachment,
  lastAnalysisResult,
  isCollapsed = false,
  onToggleCollapse
}) => {
  // Separate files and URLs from attachments
  const fileAttachments = attachments.filter(att => att.type === 'file');
  const urlAttachments = attachments.filter(att => att.type === 'url');
  
  // Get analysis messages from conversation
  const analysisMessages = messages.filter(msg => msg.role === 'assistant');

  // Navigation sections
  const sections = [
    {
      id: 'files',
      label: `Files (${fileAttachments.length})`,
      icon: FileText,
      badge: fileAttachments.length > 0 ? fileAttachments.length.toString() : undefined,
      content: fileAttachments
    },
    {
      id: 'websites',
      label: `Websites (${urlAttachments.length})`,
      icon: Globe,
      badge: urlAttachments.length > 0 ? urlAttachments.length.toString() : undefined,
      content: urlAttachments
    },
    {
      id: 'insights',
      label: 'Analysis Insights',
      icon: Brain,
      badge: analysisMessages.length > 0 ? analysisMessages.length.toString() : undefined,
      content: analysisMessages
    }
  ];

  return (
    <div 
      className={`${isCollapsed ? 'w-16' : 'w-80'} h-full transition-all duration-300 flex flex-col overflow-hidden`}
      style={{
        borderRadius: '20px',
        border: '1px solid var(--Stroke-01, #ECECEC)',
        background: 'var(--Surface-01, #FCFCFC)'
      }}
    >
      {!isCollapsed && (
        <>
          {/* Header */}
          <div className="flex-none p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold">Analysis Assets</h2>
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <PanelRightClose className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto">
            <div 
              style={{
                display: 'flex',
                padding: '12px',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                alignSelf: 'stretch',
                borderTop: '1px solid var(--Stroke-01, #ECECEC)'
              }}
            >
              {sections.map((section) => (
                <div key={section.id} className="w-full">
                  <div
                    className={cn(
                      "w-full justify-start h-10 px-3 flex-shrink-0 flex items-center",
                      "hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md"
                    )}
                  >
                    <section.icon className="h-4 w-4 mr-1" />
                    <span 
                      className="flex-1 text-left"
                      style={{
                        overflow: 'hidden',
                        color: 'var(--Text-Primary, #121212)',
                        textOverflow: 'ellipsis',
                        fontFamily: '"Instrument Sans"',
                        fontSize: '12px',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: '16px',
                        letterSpacing: '-0.12px'
                      }}
                    >
                      {section.label}
                    </span>
                    {section.badge && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {section.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Section Content */}
                  {section.id === 'files' && fileAttachments.length > 0 && (
                    <div className="mt-2 px-3 space-y-2">
                      {fileAttachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                          <FileThumbail attachment={attachment} size="sm" />
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{attachment.name}</p>
                            <Badge 
                              variant={attachment.status === 'uploaded' ? 'default' : 
                                      attachment.status === 'error' ? 'destructive' : 'secondary'}
                              className="text-xs mt-1"
                            >
                              {attachment.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewAttachment(attachment)}
                              className="h-5 w-5 p-0"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveAttachment(attachment.id)}
                              className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.id === 'websites' && urlAttachments.length > 0 && (
                    <div className="mt-2 px-3 space-y-2">
                      {urlAttachments.map((attachment) => (
                        <div key={attachment.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{attachment.url}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveAttachment(attachment.id)}
                              className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <ScreenshotDisplay attachment={attachment} />
                        </div>
                      ))}
                    </div>
                  )}

                  {section.id === 'insights' && (lastAnalysisResult || analysisMessages.length > 0) && (
                    <div className="mt-2 px-3">
                      <AnalysisInsights 
                        analysisResult={lastAnalysisResult}
                        analysisMessages={analysisMessages}
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Empty State */}
              {fileAttachments.length === 0 && urlAttachments.length === 0 && !lastAnalysisResult && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No files or analysis yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload files or add URLs to see them here
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      
      {isCollapsed && onToggleCollapse && (
        <div className="h-full flex items-start pt-4 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
