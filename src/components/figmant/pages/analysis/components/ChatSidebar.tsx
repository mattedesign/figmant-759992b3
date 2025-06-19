
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { FileThumbail } from './FileThumbail';
import { ScreenshotDisplay } from './ScreenshotDisplay';
import { AnalysisInsights } from './AnalysisInsights';
import { SuggestionsTabContent } from './SuggestionsTabContent';
import { AnalysisNavigationHeader } from './AnalysisNavigationHeader';
import { AnalysisNavigationTabs } from './AnalysisNavigationTabs';
import { ExtractedSuggestion } from '@/utils/suggestionExtractor';
import { FileText, Globe, Image, Trash2, Download, Eye, Lightbulb } from 'lucide-react';

interface ChatSidebarProps {
  messages: ChatMessage[];
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
  onViewAttachment: (attachment: ChatAttachment) => void;
  lastAnalysisResult?: any;
  extractedSuggestions?: ExtractedSuggestion[];
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  attachments,
  onRemoveAttachment,
  onViewAttachment,
  lastAnalysisResult,
  extractedSuggestions = []
}) => {
  const [activeTab, setActiveTab] = React.useState('details');
  
  // Separate files and URLs from attachments
  const fileAttachments = attachments.filter(att => att.type === 'file');
  const urlAttachments = attachments.filter(att => att.type === 'url');

  // Get analysis messages from conversation
  const analysisMessages = messages.filter(msg => msg.role === 'assistant');

  return (
    <div className="w-80 h-full bg-background border-l border-border flex flex-col">
      <AnalysisNavigationHeader />

      <AnalysisNavigationTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* File Management Section */}
              {fileAttachments.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Files ({fileAttachments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {fileAttachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                        <FileThumbail attachment={attachment} />
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{attachment.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={attachment.status === 'uploaded' ? 'default' : 
                                      attachment.status === 'error' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {attachment.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewAttachment(attachment)}
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveAttachment(attachment.id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Website Screenshots Section */}
              {urlAttachments.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Websites ({urlAttachments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {urlAttachments.map((attachment) => (
                      <div key={attachment.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{attachment.url}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveAttachment(attachment.id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <ScreenshotDisplay attachment={attachment} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Analysis Insights Section */}
              {(lastAnalysisResult || analysisMessages.length > 0) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Analysis Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnalysisInsights 
                      analysisResult={lastAnalysisResult}
                      analysisMessages={analysisMessages}
                    />
                  </CardContent>
                </Card>
              )}

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
          )}
          
          {activeTab === 'suggestions' && (
            <div>
              <SuggestionsTabContent suggestions={extractedSuggestions} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
