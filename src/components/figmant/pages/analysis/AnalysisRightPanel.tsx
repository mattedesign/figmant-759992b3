
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Share, ExternalLink, Eye, Download, Image, FileText, Globe } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface AnalysisRightPanelProps {
  analysis: any;
  attachments?: ChatAttachment[];
}

export const AnalysisRightPanel: React.FC<AnalysisRightPanelProps> = ({
  analysis,
  attachments = []
}) => {
  console.log('AnalysisRightPanel - Received attachments:', attachments);

  const getFileIcon = (attachment: ChatAttachment) => {
    if (attachment.type === 'url') {
      return <Globe className="h-4 w-4 text-blue-600" />;
    }
    
    if (attachment.file && attachment.file.type.startsWith('image/')) {
      return <Image className="h-4 w-4 text-green-600" />;
    }
    
    return <FileText className="h-4 w-4 text-gray-600" />;
  };

  const getPreviewContent = (attachment: ChatAttachment) => {
    if (attachment.type === 'file' && attachment.file && attachment.file.type.startsWith('image/')) {
      return (
        <div className="aspect-video bg-gray-100 rounded mb-2 overflow-hidden">
          <img 
            src={attachment.url} 
            alt={attachment.name}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    if (attachment.type === 'url') {
      return (
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded mb-2 flex items-center justify-center border border-blue-200">
          <div className="text-center p-4">
            <Globe className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <div className="text-xs text-blue-800 font-medium break-all">{attachment.name}</div>
            <div className="text-xs text-blue-600 mt-1">Website URL</div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center border border-gray-200">
        <div className="text-center p-4">
          <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <div className="text-xs text-gray-500">{attachment.name}</div>
        </div>
      </div>
    );
  };

  const formatFileSize = (file?: File) => {
    if (!file) return '';
    const size = file.size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Attachments</h3>
          <Badge variant="secondary" className="text-xs">
            {attachments.length}
          </Badge>
        </div>
      </div>

      {/* Attachments */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <div className="space-y-4">
          {attachments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm mb-2">No attachments yet</div>
              <div className="text-xs text-gray-500">Upload files or add URLs in the chat to see previews here</div>
            </div>
          ) : (
            attachments.map((attachment) => (
              <div key={attachment.id} className="p-3 border border-gray-200 rounded-lg bg-white">
                {/* Preview */}
                {getPreviewContent(attachment)}
                
                {/* File Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      {getFileIcon(attachment)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {attachment.name}
                        </div>
                        {attachment.type === 'url' && (
                          <div className="text-xs text-blue-600 truncate">
                            {attachment.url}
                          </div>
                        )}
                        {attachment.file && (
                          <div className="text-xs text-gray-500">
                            {formatFileSize(attachment.file)}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant={
                        attachment.status === 'uploaded' ? 'default' :
                        attachment.status === 'uploading' ? 'secondary' : 'destructive'
                      }
                      className="text-xs ml-2"
                    >
                      {attachment.status}
                    </Badge>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {attachment.status === 'uploaded' && (
                      <>
                        <Button variant="outline" size="sm" className="h-6 text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {attachment.type === 'url' && attachment.url && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-6 text-xs"
                            onClick={() => openUrl(attachment.url!)}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Open
                          </Button>
                        )}
                        {attachment.type === 'file' && (
                          <Button variant="outline" size="sm" className="h-6 text-xs">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </>
                    )}
                    <Button variant="outline" size="sm" className="h-6 text-xs ml-auto">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Upload Hint */}
          {attachments.length > 0 && (
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
              <div className="text-gray-400 text-xs">
                Drop more files in the chat or add URLs to continue
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
