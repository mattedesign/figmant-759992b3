
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ChatAttachment } from '../../DesignChatInterface';

interface AttachmentsDebugSectionProps {
  attachments: ChatAttachment[];
}

export const AttachmentsDebugSection: React.FC<AttachmentsDebugSectionProps> = ({ 
  attachments 
}) => {
  return (
    <div>
      <h4 className="font-medium text-sm mb-2">Current Attachments Status</h4>
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-center justify-between p-2 bg-white rounded border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{attachment.name}</span>
              <Badge variant={attachment.status === 'uploaded' ? 'default' : 'destructive'}>
                {attachment.status}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">
              Type: {attachment.type} | 
              {attachment.uploadPath ? ' Has Upload Path' : ' No Upload Path'} |
              {attachment.url ? ' Has URL' : ' No URL'}
            </div>
          </div>
        ))}
        {attachments.length === 0 && (
          <div className="text-sm text-gray-500 italic">No attachments</div>
        )}
      </div>
    </div>
  );
};
