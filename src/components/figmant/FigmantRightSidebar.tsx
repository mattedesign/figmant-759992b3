
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Paperclip, 
  Image, 
  FileText, 
  Globe, 
  X, 
  Download,
  Eye,
  Upload,
  Link
} from 'lucide-react';

interface FigmantRightSidebarProps {
  mode: string;
  activeSection: string;
}

export const FigmantRightSidebar: React.FC<FigmantRightSidebarProps> = ({
  mode,
  activeSection
}) => {
  const [attachments, setAttachments] = useState([
    {
      id: '1',
      name: 'homepage-design.png',
      type: 'image',
      size: '2.4 MB',
      url: '/placeholder-image.jpg'
    },
    {
      id: '2', 
      name: 'analysis-report.pdf',
      type: 'document',
      size: '1.8 MB',
      url: '#'
    }
  ]);

  const renderAttachmentsMode = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Attachments</h3>
          <Button size="sm" variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="text-xs">
            <Image className="h-3 w-3 mr-1" />
            Images
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            Documents
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <Link className="h-3 w-3 mr-1" />
            URLs
          </Button>
        </div>
      </div>

      {/* Attachments List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    {attachment.type === 'image' ? (
                      <Image className="h-4 w-4 text-blue-600" />
                    ) : (
                      <FileText className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500">{attachment.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Area */}
        <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Drop files here or click to upload</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
        </div>
      </div>
    </div>
  );

  const renderPreviewMode = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold">Preview</h3>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4">
        <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Eye className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">No Preview Available</h4>
            <p className="text-sm text-gray-600">
              Select an analysis or upload a file to preview
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (mode) {
      case 'attachments':
        return renderAttachmentsMode();
      case 'preview':
        return renderPreviewMode();
      default:
        return renderAttachmentsMode();
    }
  };

  return (
    <div className="h-full bg-white border-l border-gray-200">
      {renderContent()}
    </div>
  );
};
