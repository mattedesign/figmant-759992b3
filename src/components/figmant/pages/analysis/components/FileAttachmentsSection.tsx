
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
    <div className="px-3 space-y-3">
      {fileAttachments.map((attachment) => (
        <div key={attachment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
            <FileThumbail attachment={attachment} size="sm" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant={attachment.status === 'uploaded' ? 'default' : 
                        attachment.status === 'error' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {attachment.status}
              </Badge>
              {attachment.file && (
                <span className="text-xs text-gray-500">
                  {(attachment.file.size / 1024 / 1024).toFixed(1)} MB
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewAttachment(attachment)}
              className="h-8 w-8 p-0 hover:bg-gray-200"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveAttachment(attachment.id)}
              className="h-8 w-8 p-0 text-destructive hover:bg-red-50 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
