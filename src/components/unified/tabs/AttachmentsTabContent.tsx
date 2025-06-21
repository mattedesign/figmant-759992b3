
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Image as ImageIcon, 
  Globe, 
  FileText, 
  ExternalLink, 
  Eye,
  Download,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  Folder,
  File,
  FileSpreadsheet,
  Link2,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getAnalyzedUrls } from '@/utils/analysisAttachments';

interface AttachmentDisplay {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document' | 'spreadsheet';
  size: string;
  uploadDate: string;
  source: 'chat' | 'wizard' | 'premium' | 'manual';
  preview?: string;
  downloadUrl: string;
}

interface ReferenceLink {
  url: string;
  title?: string;
  description?: string;
  screenshot?: string;
  status: 'active' | 'broken' | 'pending';
  addedDate: string;
  source: string;
}

interface AttachmentsTabContentProps {
  analysis: any;
  attachments: any[];
}

const FilePreviewModal: React.FC<{
  file: AttachmentDisplay;
  isOpen: boolean;
  onClose: () => void;
}> = ({ file, isOpen, onClose }) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      // Simulate download progress
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsDownloading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      // In real implementation, download file from downloadUrl
      console.log('Downloading file:', file.downloadUrl);
    } catch (error) {
      setIsDownloading(false);
      console.error('Download failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {file.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isDownloading && (
            <div className="mt-2">
              <Progress value={downloadProgress} className="w-full" />
              <p className="text-xs text-gray-500 mt-1">Downloading... {downloadProgress}%</p>
            </div>
          )}
        </DialogHeader>
        
        <div className="p-4 flex justify-center max-h-[calc(90vh-120px)] overflow-auto">
          {file.type === 'image' && file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
              <FileText className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium mb-2">{file.name}</p>
              <p className="text-sm">Preview not available for this file type</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-2" />
                Download to View
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FileCard: React.FC<{
  file: AttachmentDisplay;
  onPreview: () => void;
  onDownload: () => void;
}> = ({ file, onPreview, onDownload }) => {
  const getFileIcon = () => {
    switch (file.type) {
      case 'image': return ImageIcon;
      case 'pdf': return FileText;
      case 'spreadsheet': return FileSpreadsheet;
      default: return File;
    }
  };

  const getSourceBadgeColor = () => {
    switch (file.source) {
      case 'chat': return 'bg-blue-100 text-blue-800';
      case 'wizard': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const Icon = getFileIcon();

  return (
    <Card className="hover:shadow-md transition-shadow group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
            {file.type === 'image' && file.preview ? (
              <img
                src={file.preview}
                alt={file.name}
                className="w-full h-full object-cover rounded-lg cursor-pointer"
                onClick={onPreview}
              />
            ) : (
              <Icon className="h-6 w-6 text-gray-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 truncate mb-1">
              {file.name}
            </h4>
            
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={`text-xs ${getSourceBadgeColor()}`}>
                {file.source}
              </Badge>
              <span className="text-xs text-gray-500">{file.size}</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(new Date(file.uploadDate), { addSuffix: true })}
            </div>
            
            <div className="flex items-center gap-2">
              {file.type === 'image' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={onPreview}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={onDownload}
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LinkCard: React.FC<{
  link: ReferenceLink;
  onValidate: () => void;
}> = ({ link, onValidate }) => {
  const getStatusIcon = () => {
    switch (link.status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'broken': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (link.status) {
      case 'active': return 'border-l-green-500 bg-green-50';
      case 'broken': return 'border-l-red-500 bg-red-50';
      case 'pending': return 'border-l-yellow-500 bg-yellow-50';
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow border-l-4 ${getStatusColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {link.screenshot ? (
            <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={link.screenshot}
                alt="Website preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="h-5 w-5 text-gray-500" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm text-gray-900 truncate">
                {link.title || new URL(link.url).hostname}
              </h4>
              {getStatusIcon()}
            </div>
            
            {link.description && (
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {link.description}
              </p>
            )}
            
            <p className="text-xs text-gray-500 truncate mb-2">{link.url}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(link.addedDate), { addSuffix: true })}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={onValidate}
                >
                  <Link2 className="h-3 w-3 mr-1" />
                  Validate
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => window.open(link.url, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AttachmentsTabContent: React.FC<AttachmentsTabContentProps> = ({
  analysis,
  attachments
}) => {
  const [previewFile, setPreviewFile] = useState<AttachmentDisplay | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  
  const analyzedUrls = getAnalyzedUrls(analysis);

  // Transform attachments to AttachmentDisplay format
  const fileAttachments: AttachmentDisplay[] = attachments
    .filter(att => att.type === 'file')
    .map(att => ({
      id: att.id,
      name: att.name,
      type: att.file?.type.startsWith('image/') ? 'image' as const : 'document' as const,
      size: att.file ? `${Math.round(att.file.size / 1024)} KB` : 'Unknown size',
      uploadDate: new Date().toISOString(), // Would come from actual data
      source: 'chat' as const, // Would be determined by analysis type
      preview: att.file?.type.startsWith('image/') ? URL.createObjectURL(att.file) : undefined,
      downloadUrl: att.url || '#'
    }));

  // Transform URLs to ReferenceLink format
  const referenceLinks: ReferenceLink[] = [
    ...attachments
      .filter(att => att.type === 'url')
      .map(att => ({
        url: att.url!,
        title: att.name,
        description: att.metadata?.description,
        screenshot: att.metadata?.screenshots?.desktop?.screenshot_url,
        status: (att.status === 'uploaded' ? 'active' : att.status === 'error' ? 'broken' : 'pending') as const,
        addedDate: new Date().toISOString(),
        source: 'analysis'
      })),
    ...analyzedUrls
      .filter(url => !attachments.some(att => att.url === url))
      .map(url => ({
        url,
        title: new URL(url).hostname,
        status: 'active' as const,
        addedDate: analysis.created_at,
        source: 'automatic'
      }))
  ];

  // Group files by source
  const filesBySource = fileAttachments.reduce((acc, file) => {
    if (!acc[file.source]) acc[file.source] = [];
    acc[file.source].push(file);
    return acc;
  }, {} as Record<string, AttachmentDisplay[]>);

  const handleFilePreview = (file: AttachmentDisplay) => {
    setPreviewFile(file);
    setPreviewModalOpen(true);
  };

  const handleFileDownload = (file: AttachmentDisplay) => {
    console.log('Downloading file:', file.downloadUrl);
    // Implement actual download logic
  };

  const handleLinkValidation = (link: ReferenceLink) => {
    console.log('Validating link:', link.url);
    // Implement link validation logic
  };

  const totalFiles = fileAttachments.length;
  const totalLinks = referenceLinks.length;
  const activeLinks = referenceLinks.filter(l => l.status === 'active').length;
  const brokenLinks = referenceLinks.filter(l => l.status === 'broken').length;

  if (totalFiles === 0 && totalLinks === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Attachments Found</h3>
          <p className="text-gray-500">This analysis doesn't contain any files, images, or reference links.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <Folder className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{totalFiles}</div>
              <div className="text-sm text-gray-500">Files</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Link2 className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{totalLinks}</div>
              <div className="text-sm text-gray-500">Links</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{activeLinks}</div>
              <div className="text-sm text-gray-500">Active</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold">{brokenLinks}</div>
              <div className="text-sm text-gray-500">Issues</div>
            </CardContent>
          </Card>
        </div>

        {/* File Attachments by Source */}
        {Object.keys(filesBySource).length > 0 && (
          <>
            {Object.entries(filesBySource).map(([source, files]) => (
              <Card key={source}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 capitalize">
                    <Folder className="h-5 w-5" />
                    {source} Files
                    <Badge variant="outline">{files.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        onPreview={() => handleFilePreview(file)}
                        onDownload={() => handleFileDownload(file)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {/* Reference Links */}
        {referenceLinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Reference Links
                <Badge variant="outline">{referenceLinks.length}</Badge>
                {brokenLinks > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {brokenLinks} issues
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {referenceLinks.map((link, index) => (
                  <LinkCard
                    key={`${link.url}-${index}`}
                    link={link}
                    onValidate={() => handleLinkValidation(link)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          isOpen={previewModalOpen}
          onClose={() => {
            setPreviewModalOpen(false);
            setPreviewFile(null);
          }}
        />
      )}
    </>
  );
};
