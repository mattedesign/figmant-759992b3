
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Camera, Globe, FileText, X } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface AttachmentDisplayProps {
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
}

export const AttachmentDisplay: React.FC<AttachmentDisplayProps> = ({
  attachments,
  onRemoveAttachment
}) => {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 w-full">
      {attachments.map((attachment) => (
        <Badge
          key={attachment.id}
          variant="secondary"
          className="flex items-center gap-2 px-3 py-2"
        >
          {attachment.type === 'file' ? (
            attachment.file?.type.startsWith('image/') ? <Camera className="w-4 h-4" /> : <FileText className="w-4 h-4" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          <span className="text-sm truncate max-w-[150px]">
            {attachment.name}
          </span>
          <button
            onClick={() => onRemoveAttachment(attachment.id)}
            className="ml-1 hover:text-red-500"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
};
