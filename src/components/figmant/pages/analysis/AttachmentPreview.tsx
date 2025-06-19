
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  X, 
  File, 
  Globe, 
  Image, 
  Monitor, 
  Smartphone, 
  CheckCircle, 
  Loader2,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { ImagePreviewModal } from './ImagePreviewModal';

interface AttachmentPreviewProps {
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
  showRemoveButton?: boolean;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachments,
  onRemoveAttachment,
  showRemoveButton = true
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (attachments.length === 0) {
    return null;
  }

  const getStatusIcon = (status: ChatAttachment['status']) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />;
      case 'uploaded':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: ChatAttachment['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'uploaded':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Attachments ({attachments.length})</span>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {attachments.map((attachment) => (
            <Card key={attachment.id} className="border border-gray-200">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-0.5">
                      {attachment.type === 'file' ? (
                        <File className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Globe className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {attachment.name}
                        </span>
                        <Badge className={getStatusColor(attachment.status)}>
                          {getStatusIcon(attachment.status)}
                          {attachment.status}
                        </Badge>
                      </div>
                      
                      {attachment.url && (
                        <div className="text-xs text-muted-foreground truncate">
                          {attachment.url}
                        </div>
                      )}
                      
                      {attachment.errorMessage && (
                        <div className="text-xs text-red-600">
                          {attachment.errorMessage}
                        </div>
                      )}

                      {/* Screenshot Preview */}
                      {attachment.metadata?.screenshots && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-gray-700">Screenshots Captured:</div>
                          <div className="flex gap-2">
                            {attachment.metadata.screenshots.desktop?.success && (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Monitor className="h-3 w-3" />
                                  Desktop
                                </div>
                                {attachment.metadata.screenshots.desktop.thumbnailUrl ? (
                                  <div className="relative group">
                                    <img
                                      src={attachment.metadata.screenshots.desktop.thumbnailUrl}
                                      alt="Desktop screenshot"
                                      className="w-20 h-12 object-cover rounded border cursor-pointer hover:opacity-80"
                                      onClick={() => setSelectedImage(attachment.metadata.screenshots.desktop.thumbnailUrl)}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Eye className="h-4 w-4 text-white bg-black bg-opacity-50 rounded p-1" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-20 h-12 bg-green-100 rounded border flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {attachment.metadata.screenshots.mobile?.success && (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Smartphone className="h-3 w-3" />
                                  Mobile
                                </div>
                                {attachment.metadata.screenshots.mobile.thumbnailUrl ? (
                                  <div className="relative group">
                                    <img
                                      src={attachment.metadata.screenshots.mobile.thumbnailUrl}
                                      alt="Mobile screenshot"
                                      className="w-12 h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                      onClick={() => setSelectedImage(attachment.metadata.screenshots.mobile.thumbnailUrl)}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Eye className="h-4 w-4 text-white bg-black bg-opacity-50 rounded p-1" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-12 h-20 bg-green-100 rounded border flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {showRemoveButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveAttachment(attachment.id)}
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        imageUrl={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};
