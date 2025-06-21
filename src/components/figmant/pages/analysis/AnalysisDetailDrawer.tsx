import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { 
  FileText, 
  MessageSquare, 
  Calendar, 
  User, 
  Target, 
  ExternalLink,
  Image as ImageIcon,
  Globe,
  Eye,
  X,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  ListTodo,
  File,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getAttachmentsFromAnalysis,
  getAnalyzedUrls,
  getAnalysisSummary,
  getAnalysisTitle
} from '@/utils/analysisAttachments';
import { EnhancedImage } from './components/EnhancedImage';

interface AnalysisDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: any;
}

const ScreenshotModal: React.FC<{
  screenshots: any[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}> = ({ screenshots, currentIndex, isOpen, onClose, onNext, onPrevious }) => {
  const currentScreenshot = screenshots[currentIndex];
  
  if (!currentScreenshot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Screenshot Preview
            </DialogTitle>
            <div className="flex items-center gap-2">
              {screenshots.length > 1 && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={onPrevious}>
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    {currentIndex + 1} of {screenshots.length}
                  </span>
                  <Button variant="outline" size="sm" onClick={onNext}>
                    Next
                  </Button>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-4 flex justify-center">
          <EnhancedImage
            attachment={currentScreenshot}
            className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
            alt="Screenshot preview"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InlineAttachment: React.FC<{
  attachment: any;
  onViewScreenshot?: () => void;
}> = ({ attachment, onViewScreenshot }) => {
  const isImage = attachment.type === 'image' || attachment.thumbnailUrl;
  const isUrl = attachment.type === 'link' || attachment.url;

  return (
    <div className="my-4 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-start gap-3">
        {/* Thumbnail or Icon */}
        <div className="w-12 h-12 bg-white rounded border flex items-center justify-center flex-shrink-0 overflow-hidden">
          {isImage ? (
            <EnhancedImage
              attachment={attachment}
              className="w-full h-full cursor-pointer"
              onClick={onViewScreenshot}
              showFallback={true}
            />
          ) : isUrl ? (
            <Globe className="h-6 w-6 text-blue-500" />
          ) : (
            <File className="h-6 w-6 text-gray-500" />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h5 className="font-medium text-sm text-gray-900 truncate">
            {attachment.name}
          </h5>
          {attachment.url && (
            <p className="text-xs text-gray-500 truncate mt-1">
              {attachment.url}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {attachment.type === 'link' ? 'URL' : attachment.type === 'image' ? 'Image' : 'File'}
            </Badge>
            
            {isImage && onViewScreenshot && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={onViewScreenshot}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            )}
            
            {attachment.url && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => window.open(attachment.url, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AttachmentCard: React.FC<{
  attachment: any;
  onViewScreenshot?: () => void;
}> = ({ attachment, onViewScreenshot }) => {
  const isUrl = attachment.type === 'link' || attachment.url;
  const hasScreenshot = attachment.thumbnailUrl || (attachment.url && onViewScreenshot);

  return (
    <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
          {isUrl ? (
            <Globe className="h-4 w-4 text-blue-500" />
          ) : (
            <FileText className="h-4 w-4 text-gray-500" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h5 className="font-medium text-sm truncate">{attachment.name}</h5>
          {attachment.url && (
            <p className="text-xs text-gray-500 truncate mt-1">{attachment.url}</p>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {attachment.type === 'link' ? 'URL' : 'File'}
            </Badge>
            
            {hasScreenshot && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={onViewScreenshot}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            )}
            
            {attachment.url && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => window.open(attachment.url, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </Button>
            )}
          </div>
        </div>
        
        {hasScreenshot && (
          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
            <EnhancedImage
              attachment={attachment}
              className="w-full h-full cursor-pointer"
              onClick={onViewScreenshot}
              showFallback={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const MetadataCard: React.FC<{ analysis: any }> = ({ analysis }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <div>
          <p className="text-xs text-gray-500">Created</p>
          <p className="text-sm font-medium">
            {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-gray-500" />
        <div>
          <p className="text-xs text-gray-500">Confidence</p>
          <p className="text-sm font-medium">
            {Math.round((analysis.confidence_score || 0.8) * 100)}%
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-500" />
        <div>
          <p className="text-xs text-gray-500">Type</p>
          <p className="text-sm font-medium capitalize">
            {analysis.type || analysis.analysis_type || 'Analysis'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-gray-500" />
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <Badge className={`text-xs ${getStatusColor(analysis.status || 'completed')}`}>
            {analysis.status || 'Completed'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

const FormattedContent: React.FC<{ 
  content: string; 
  attachments: any[];
  onViewScreenshot: (index: number) => void;
}> = ({ content, attachments, onViewScreenshot }) => {
  // Split content into paragraphs and format
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  
  return (
    <div className="prose prose-sm max-w-none">
      {paragraphs.map((paragraph, index) => {
        // Check if it's a list item
        if (paragraph.includes('•') || paragraph.includes('-')) {
          const items = paragraph.split(/[•-]/).filter(item => item.trim());
          return (
            <ul key={index} className="space-y-1 mb-4">
              {items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm leading-relaxed">
                  {item.trim()}
                </li>
              ))}
            </ul>
          );
        }
        
        // Regular paragraph
        return (
          <div key={index} className="mb-4">
            <p className="text-sm leading-relaxed mb-3 text-gray-700">
              {paragraph.trim()}
            </p>
            
            {/* Show relevant attachments after certain paragraphs */}
            {index === 0 && attachments.length > 0 && (
              <div className="my-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Referenced Materials:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {attachments.slice(0, 4).map((attachment, attIndex) => (
                    <InlineAttachment
                      key={attachment.id}
                      attachment={attachment}
                      onViewScreenshot={() => onViewScreenshot(attIndex)}
                    />
                  ))}
                </div>
                {attachments.length > 4 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    +{attachments.length - 4} more attachments available below
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const AnalysisDetailDrawer: React.FC<AnalysisDetailDrawerProps> = ({
  isOpen,
  onClose,
  analysis
}) => {
  const navigate = useNavigate();
  const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);

  if (!analysis) return null;

  const attachments = getAttachmentsFromAnalysis(analysis);
  const analyzedUrls = getAnalyzedUrls(analysis);
  const summary = getAnalysisSummary(analysis);
  const title = getAnalysisTitle(analysis);

  const screenshots = attachments
    .filter(att => att.thumbnailUrl || (att.type === 'link' && att.url))
    .map(att => ({
      thumbnailUrl: att.thumbnailUrl,
      url: att.url,
      name: att.name
    }));

  const handleOpenInChat = () => {
    if (analysis.type === 'chat') {
      navigate('/figmant', { 
        state: { 
          activeSection: 'chat',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
    } else {
      navigate('/figmant', { 
        state: { 
          activeSection: 'wizard',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
    }
    onClose();
  };

  const openScreenshotModal = (index: number = 0) => {
    setCurrentScreenshotIndex(index);
    setScreenshotModalOpen(true);
  };

  const nextScreenshot = () => {
    setCurrentScreenshotIndex((prev) => 
      prev < screenshots.length - 1 ? prev + 1 : 0
    );
  };

  const previousScreenshot = () => {
    setCurrentScreenshotIndex((prev) => 
      prev > 0 ? prev - 1 : screenshots.length - 1
    );
  };

  // Extract key insights and recommendations
  const keyInsights = analysis.impact_summary?.key_metrics || {};
  const recommendations = analysis.impact_summary?.recommendations || analysis.recommendations || [];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-4xl">
          <SheetHeader className="space-y-3 pb-4">
            <div className="flex items-center gap-2">
              {analysis.type === 'chat' ? (
                <MessageSquare className="h-5 w-5 text-blue-600" />
              ) : (
                <FileText className="h-5 w-5 text-green-600" />
              )}
              <SheetTitle className="text-left text-lg">{title}</SheetTitle>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">
                {analysis.type === 'chat' ? 'Chat Analysis' : 'Design Analysis'}
              </Badge>
              {analysis.analysisType && (
                <Badge variant="secondary">
                  {analysis.analysisType}
                </Badge>
              )}
              {analysis.score && (
                <Badge variant="default">
                  Score: {analysis.score}/10
                </Badge>
              )}
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="space-y-6">
              {/* Metadata Section */}
              <MetadataCard analysis={analysis} />
              
              <Separator />

              {/* Main Analysis Content with Inline Attachments */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Analysis Results
                </h3>
                
                {analysis.type === 'chat' && analysis.prompt_used && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Original Prompt</h4>
                    <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded-r-lg">
                      <p className="text-sm text-gray-700 italic">{analysis.prompt_used}</p>
                    </div>
                  </div>
                )}

                <div className="bg-white border rounded-lg p-4">
                  <FormattedContent 
                    content={summary} 
                    attachments={attachments}
                    onViewScreenshot={openScreenshotModal}
                  />
                </div>
              </div>

              {/* Collapsible Sections */}
              <Accordion type="multiple" className="w-full">
                {/* Attachments Section */}
                {(attachments.length > 0 || analyzedUrls.length > 0) && (
                  <AccordionItem value="attachments">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>All Attachments & Resources</span>
                        <Badge variant="outline" className="ml-2">
                          {attachments.length + analyzedUrls.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {attachments.map((attachment, index) => (
                          <AttachmentCard
                            key={attachment.id}
                            attachment={attachment}
                            onViewScreenshot={() => openScreenshotModal(index)}
                          />
                        ))}
                        
                        {analyzedUrls
                          .filter(url => !attachments.some(att => att.url === url))
                          .map((url, index) => (
                            <AttachmentCard
                              key={`url-${index}`}
                              attachment={{
                                id: `url-${index}`,
                                name: new URL(url).hostname,
                                url: url,
                                type: 'link'
                              }}
                            />
                          ))
                        }
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Key Insights Section */}
                {Object.keys(keyInsights).length > 0 && (
                  <AccordionItem value="insights">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Key Insights & Metrics</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {Object.entries(keyInsights).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium capitalize text-gray-700">
                                {key.replace(/_/g, ' ')}
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {typeof value === 'number' ? `${value}/10` : String(value)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Recommendations Section */}
                {recommendations.length > 0 && (
                  <AccordionItem value="recommendations">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        <span>Recommendations & Action Items</span>
                        <Badge variant="outline" className="ml-2">
                          {recommendations.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {recommendations.map((rec: any, index: number) => (
                          <div key={index} className="border-l-4 border-blue-200 bg-blue-50 p-3 rounded-r-lg">
                            <div className="flex items-start gap-2">
                              <ListTodo className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {rec.priority && (
                                    <Badge 
                                      variant={rec.priority === 'high' ? 'destructive' : 
                                               rec.priority === 'medium' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {rec.priority} priority
                                    </Badge>
                                  )}
                                  {rec.category && (
                                    <Badge variant="outline" className="text-xs">
                                      {rec.category}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 mb-1">
                                  {rec.description || rec}
                                </p>
                                {rec.expected_impact && (
                                  <p className="text-xs text-gray-500">
                                    Expected impact: {rec.expected_impact}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Technical Details Section */}
                <AccordionItem value="technical">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Technical Details</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Analysis ID:</span>
                            <span className="font-mono text-xs">{analysis.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Processing Time:</span>
                            <span>{analysis.processing_time || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Model Used:</span>
                            <span>{analysis.model_used || 'Claude AI'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Items Analyzed:</span>
                            <span>{attachments.length + analyzedUrls.length || 1}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="border-t pt-4 mt-4">
            <Button 
              onClick={handleOpenInChat}
              className="w-full"
              size="lg"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {analysis.type === 'chat' ? 'Continue in Chat' : 'Open in Analysis Wizard'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {screenshots.length > 0 && (
        <ScreenshotModal
          screenshots={screenshots}
          currentIndex={currentScreenshotIndex}
          isOpen={screenshotModalOpen}
          onClose={() => setScreenshotModalOpen(false)}
          onNext={nextScreenshot}
          onPrevious={previousScreenshot}
        />
      )}
    </>
  );
};
