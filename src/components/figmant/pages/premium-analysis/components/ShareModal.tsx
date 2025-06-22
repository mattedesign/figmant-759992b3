
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Share2, Link, Mail, Download, Loader2, Copy, Check } from 'lucide-react';
import { ShareOptions, ExportShareService } from '@/services/exportShareService';
import { ContextualAnalysisResult } from '@/types/contextualAnalysis';
import { StepData } from '../types';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: ContextualAnalysisResult;
  stepData: StepData;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  analysisResult,
  stepData
}) => {
  const [shareType, setShareType] = useState<ShareOptions['type']>('link');
  const [recipients, setRecipients] = useState('');
  const [message, setMessage] = useState(`I've completed an analysis of ${stepData.projectName} and wanted to share the insights with you.`);
  const [expiresIn, setExpiresIn] = useState<ShareOptions['expiresIn']>('7d');
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareTypeOptions = [
    { value: 'link', label: 'Share Link', description: 'Generate a secure link to share', icon: Link },
    { value: 'email', label: 'Email', description: 'Send via email directly', icon: Mail },
    { value: 'download', label: 'Download Package', description: 'Prepare downloadable files', icon: Download }
  ];

  const expirationOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'never', label: 'Never' }
  ];

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const shareOptions: ShareOptions = {
        type: shareType,
        recipients: recipients ? recipients.split(',').map(email => email.trim()) : undefined,
        message,
        expiresIn
      };

      const result = await ExportShareService.shareAnalysis(
        analysisResult,
        stepData,
        shareOptions
      );

      if (result.success) {
        if (result.shareUrl) {
          setShareUrl(result.shareUrl);
        }
        
        toast({
          title: "Share Successful",
          description: shareType === 'link' 
            ? "Share link has been generated."
            : shareType === 'email'
            ? "Email client opened with analysis details."
            : "Download package prepared.",
        });

        if (shareType !== 'link') {
          // Close modal for email and download types
          onClose();
        }
      } else {
        throw new Error(result.error || 'Share failed');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Share Failed",
        description: error.message || "An error occurred while sharing.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-500" />
            Share Analysis
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Share Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Share Method</Label>
            <RadioGroup value={shareType} onValueChange={(value) => setShareType(value as ShareOptions['type'])}>
              {shareTypeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div key={option.value} className="flex items-start space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="text-sm font-medium cursor-pointer flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {option.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Email Recipients (only for email type) */}
          {shareType === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="recipients" className="text-sm font-medium">
                Email Recipients
              </Label>
              <Input
                id="recipients"
                placeholder="email1@example.com, email2@example.com"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate multiple emails with commas</p>
            </div>
          )}

          {/* Expiration (only for link type) */}
          {shareType === 'link' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Link Expiration</Label>
              <Select value={expiresIn} onValueChange={(value) => setExpiresIn(value as ShareOptions['expiresIn'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expirationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Message */}
          {(shareType === 'email' || shareType === 'link') && (
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                Message (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Add a personal message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Share URL Display (after generation) */}
          {shareUrl && shareType === 'link' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Share Link</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyShareUrl}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Analysis Preview */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Project:</strong> {stepData.projectName}<br />
              <strong>Recommendations:</strong> {analysisResult.recommendations.length}<br />
              <strong>High Priority Items:</strong> {analysisResult.metrics.highPriorityCount}<br />
              <strong>Confidence:</strong> {analysisResult.metrics.averageConfidence}%
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSharing}>
            {shareUrl && shareType === 'link' ? 'Close' : 'Cancel'}
          </Button>
          {(!shareUrl || shareType !== 'link') && (
            <Button onClick={handleShare} disabled={isSharing}>
              {isSharing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {shareType === 'link' ? 'Generating...' : 'Sharing...'}
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  {shareType === 'link' ? 'Generate Link' : shareType === 'email' ? 'Send Email' : 'Prepare Download'}
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
