
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2 } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { FileThumbail } from './FileThumbail';

interface FileAttachmentsSectionProps {
  fileAttachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
  onViewAttachment: (attachment: ChatAttachment) => void;
}

export const FileAttachmentsSection: React.FC<FileAttachmentsSectionProps> = ({
  fileAttachments,
  onRemoveAttachment,
  onViewAttachment
}) => {
  if (fileAttachments.length === 0) return null;

  return (
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
  );
};
