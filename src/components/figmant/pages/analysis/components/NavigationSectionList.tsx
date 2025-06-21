
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Globe, 
  Image, 
  Trash2, 
  Eye, 
  ExternalLink, 
  MessageSquare,
  Clock,
  TrendingUp
} from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { FileThumbail } from './FileThumbail';
import { ScreenshotDisplay } from './ScreenshotDisplay';
import { 
  getAttachmentsFromAnalysis,
  getAnalyzedUrls,
  SimpleAttachment
} from '@/utils/analysisAttachments';

interface NavigationSectionListProps {
  fileAttachments: ChatAttachment[];
  urlAttachments: ChatAttachment[];
  analysisMessages: any[];
  lastAnalysisResult?: any;
  onRemoveAttachment: (id: string) => void;
  onViewAttachment: (attachment: ChatAttachment) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  historicalAnalysis?: any; // Add support for historical analysis data
}

export const NavigationSectionList: React.FC<NavigationSectionListProps> = ({
  fileAttachments,
  urlAttachments,
  analysisMessages,
  lastAnalysisResult,
  onRemoveAttachment,
  onViewAttachment,
  activeTab,
  onTabChange,
  historicalAnalysis
}) => {
  const [historicalAttachments, setHistoricalAttachments] = useState<SimpleAttachment[]>([]);

  // Extract attachments from historical analysis if available
  useEffect(() => {
    if (historicalAnalysis) {
      console.log('🏛️ NAVIGATION SECTION - Loading historical analysis attachments:', historicalAnalysis);
      const extractedAttachments = getAttachmentsFromAnalysis(historicalAnalysis);
      setHistoricalAttachments(extractedAttachments);
    } else {
      setHistoricalAttachments([]);
    }
  }, [historicalAnalysis]);

  // Combine current session attachments with historical ones
  const allFileAttachments = [
    ...fileAttachments,
    ...historicalAttachments.filter(att => att.type === 'file' || att.type === 'image')
  ];

  const allUrlAttachments = [
    ...urlAttachments,
    ...historicalAttachments.filter(att => att.type === 'link')
  ];

  console.log('🎯 NAVIGATION SECTION LIST - Rendering with:', {
    currentFileAttachments: fileAttachments.length,
    currentUrlAttachments: urlAttachments.length,
    historicalAttachments: historicalAttachments.length,
    totalFileAttachments: allFileAttachments.length,
    totalUrlAttachments: allUrlAttachments.length,
    hasHistoricalAnalysis: !!historicalAnalysis
  });

  const renderHistoricalAttachment = (attachment: SimpleAttachment) => {
    const isImage = attachment.type === 'image' || attachment.thumbnailUrl || attachment.file_path || attachment.path;
    const isUrl = attachment.type === 'link';

    return (
      <div key={attachment.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
          {isImage ? (
            <Image className="h-4 w-4 text-blue-500" />
          ) : isUrl ? (
            <Globe className="h-4 w-4 text-blue-500" />
          ) : (
            <FileText className="h-4 w-4 text-gray-500" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          {attachment.url && (
            <p className="text-xs text-gray-500 truncate mt-1">{attachment.url}</p>
          )}
          
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {attachment.type === 'link' ? 'URL' : attachment.type === 'image' ? 'Image' : 'File'}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Historical
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {attachment.url && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(attachment.url, '_blank')}
              className="h-6 w-6 p-0"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderCurrentAttachment = (attachment: ChatAttachment) => (
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
  );

  const renderUrlAttachment = (attachment: ChatAttachment | SimpleAttachment) => {
    const isHistorical = !('status' in attachment);
    
    return (
      <div key={attachment.id} className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{attachment.name}</p>
            <p className="text-xs text-muted-foreground truncate">{attachment.url}</p>
            {isHistorical && (
              <Badge variant="secondary" className="text-xs mt-1">
                Historical
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {attachment.url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(attachment.url, '_blank')}
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
            {!isHistorical && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveAttachment(attachment.id)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        
        {!isHistorical && 'status' in attachment && (
          <ScreenshotDisplay attachment={attachment} />
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-hidden">
      <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
        <div className="px-3 py-2 border-b border-gray-200">
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="details" className="text-xs">
              Details ({allFileAttachments.length + allUrlAttachments.length})
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">
              Analysis
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <TabsContent value="details" className="mt-0 space-y-4">
            {/* File Management Section */}
            {allFileAttachments.length > 0 && (
              <Card className="mx-3">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Files ({allFileAttachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Current session files */}
                  {fileAttachments.map(renderCurrentAttachment)}
                  
                  {/* Historical files */}
                  {historicalAttachments
                    .filter(att => att.type === 'file' || att.type === 'image')
                    .map(renderHistoricalAttachment)}
                </CardContent>
              </Card>
            )}

            {/* Website Screenshots Section */}
            {allUrlAttachments.length > 0 && (
              <Card className="mx-3">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Websites ({allUrlAttachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Current session URLs */}
                  {urlAttachments.map(renderUrlAttachment)}
                  
                  {/* Historical URLs */}
                  {historicalAttachments
                    .filter(att => att.type === 'link')
                    .map(renderUrlAttachment)}
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {allFileAttachments.length === 0 && allUrlAttachments.length === 0 && (
              <div className="text-center py-8 mx-3">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No files or analysis yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload files or add URLs to see them here
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-0 space-y-4">
            {(lastAnalysisResult || analysisMessages.length > 0 || historicalAnalysis) ? (
              <Card className="mx-3">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Analysis Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {historicalAnalysis && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Historical Analysis</span>
                      </div>
                      <p className="text-xs text-blue-700">
                        Loaded from previous analysis session
                      </p>
                    </div>
                  )}
                  
                  {analysisMessages.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-700">Recent Messages</h5>
                      {analysisMessages.slice(-3).map((msg, index) => (
                        <div key={index} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                          {msg.content.substring(0, 100)}...
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8 mx-3">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No analysis yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start a conversation to see insights here
                </p>
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
