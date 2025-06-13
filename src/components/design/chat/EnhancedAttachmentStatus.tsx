
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Globe, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  RotateCcw,
  X
} from 'lucide-react';
import { ChatAttachment } from '../DesignChatInterface';

interface EnhancedAttachmentStatusProps {
  attachments: ChatAttachment[];
  onRemove: (id: string) => void;
  onRetry?: (id: string) => void;
}

export const EnhancedAttachmentStatus: React.FC<EnhancedAttachmentStatusProps> = ({
  attachments,
  onRemove,
  onRetry
}) => {
  if (attachments.length === 0) return null;

  const getStatusIcon = (status: string, type: string) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'uploading':
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return type === 'url' ? <Globe className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      uploaded: { label: 'Ready', variant: 'default' as const },
      error: { label: 'Error', variant: 'destructive' as const },
      uploading: { label: 'Uploading', variant: 'secondary' as const },
      processing: { label: 'Processing', variant: 'secondary' as const },
      pending: { label: 'Pending', variant: 'outline' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { label: status, variant: 'outline' as const };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getDomainFromUrl = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Attachments ({attachments.length})
        </span>
      </div>
      
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <Card key={attachment.id} className="p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getStatusIcon(attachment.status || 'pending', attachment.type)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {attachment.type === 'url' 
                        ? getDomainFromUrl(attachment.url || attachment.name)
                        : attachment.name
                      }
                    </span>
                    {attachment.type === 'url' && attachment.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(attachment.url, '_blank')}
                        className="h-6 w-6 p-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  {attachment.errorMessage && (
                    <p className="text-xs text-red-600 mt-1">
                      {attachment.errorMessage}
                    </p>
                  )}
                  
                  {attachment.type === 'file' && attachment.file && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {(attachment.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(attachment.status || 'pending')}
                
                {attachment.status === 'error' && onRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRetry(attachment.id)}
                    className="h-7 px-2"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(attachment.id)}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        ))}
      </div>
    </div>
  );
};
