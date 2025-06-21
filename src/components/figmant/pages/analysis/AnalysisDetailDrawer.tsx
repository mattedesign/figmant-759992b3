
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getAttachmentsFromAnalysis,
  getAnalyzedUrls,
  getAnalysisSummary,
  getAnalysisTitle
} from '@/utils/analysisAttachments';

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
          <img
            src={currentScreenshot.thumbnailUrl || currentScreenshot.url}
            alt="Screenshot"
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
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
        
        {hasScreenshot && attachment.thumbnailUrl && (
          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
            <img
              src={attachment.thumbnailUrl}
              alt="Preview"
              className="w-full h-full object-cover cursor-pointer"
              onClick={onViewScreenshot}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
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

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="space-y-3">
            <div className="flex items-center gap-2">
              {analysis.type === 'chat' ? (
                <MessageSquare className="h-5 w-5 text-blue-600" />
              ) : (
                <FileText className="h-5 w-5 text-green-600" />
              )}
              <SheetTitle className="text-left">{title}</SheetTitle>
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

          <div className="space-y-6 mt-6">
            {(attachments.length > 0 || analyzedUrls.length > 0) && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-gray-600" />
                  <h4 className="font-semibold">Screenshots & Attachments</h4>
                  <Badge variant="outline" className="text-xs">
                    {attachments.length + analyzedUrls.length}
                  </Badge>
                </div>
                
                <div className="grid gap-3">
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
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Confidence: {Math.round((analysis.confidence_score || 0.8) * 100)}%
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                Items analyzed: {attachments.length + analyzedUrls.length || 1}
              </div>
            </div>

            <div className="space-y-4">
              {analysis.type === 'chat' && analysis.prompt_used && (
                <div>
                  <h4 className="font-semibold mb-2">Original Prompt</h4>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    {analysis.prompt_used}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">
                  {analysis.type === 'chat' ? 'AI Response' : 'Analysis Summary'}
                </h4>
                <div className="bg-muted p-3 rounded-lg text-sm max-h-64 overflow-y-auto">
                  {summary}
                </div>
              </div>

              {analysis.impact_summary?.key_metrics && (
                <div>
                  <h4 className="font-semibold mb-2">Key Metrics</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(analysis.impact_summary.key_metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-2 bg-muted rounded">
                        <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <Button 
                onClick={handleOpenInChat}
                className="w-full"
                size="lg"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {analysis.type === 'chat' ? 'Continue in Chat' : 'Open in Analysis Wizard'}
              </Button>
            </div>
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
