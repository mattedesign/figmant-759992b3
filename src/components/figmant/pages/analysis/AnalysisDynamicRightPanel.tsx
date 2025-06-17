
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PanelRightClose, PanelRightOpen, FileText, Layout, Paperclip, Image, Globe, Eye, Download, Trash2, Upload } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { TemplatesPanel } from './components/TemplatesPanel';
import { AnalysisDetailsPanel } from './components/AnalysisDetailsPanel';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  business_domain?: string;
  claude_response?: string;
  created_at?: string;
  created_by?: string;
  effectiveness_rating?: number;
  is_active?: boolean;
  original_prompt?: string;
  use_case_context?: string;
}

interface AnalysisDynamicRightPanelProps {
  mode: 'templates' | 'analysis' | 'upload';
  promptTemplates?: PromptTemplate[];
  selectedPromptCategory?: string;
  selectedPromptTemplate?: string;
  onPromptTemplateSelect?: (templateId: string) => void;
  onPromptCategoryChange?: (category: string) => void;
  currentAnalysis?: any;
  attachments?: ChatAttachment[];
  onAnalysisClick?: () => void;
  onBackClick?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
  onRemoveAttachment?: (id: string) => void;
  onFileUpload?: (files: FileList) => void;
  onToggleUrlInput?: () => void;
}

export const AnalysisDynamicRightPanel: React.FC<AnalysisDynamicRightPanelProps> = ({
  mode,
  promptTemplates = [],
  selectedPromptTemplate,
  onPromptTemplateSelect,
  currentAnalysis,
  attachments = [],
  onAnalysisClick,
  onBackClick,
  onCollapseChange,
  onRemoveAttachment,
  onFileUpload,
  onToggleUrlInput
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && onFileUpload) {
      onFileUpload(files);
    }
  };

  const getHeaderTitle = () => {
    if (mode === 'analysis') return 'Analysis Details';
    if (mode === 'templates') return 'More';
    return 'Upload Files';
  };

  const getModeIcon = () => {
    if (mode === 'analysis') return FileText;
    if (mode === 'templates') return Layout;
    return Upload;
  };

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
        <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center p-4">
            <Globe className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <div className="text-xs text-gray-500 break-all">{attachment.url}</div>
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

  const renderUploadView = () => (
    <div className="flex-1 overflow-y-auto p-4 bg-white">
      <div className="space-y-4">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
            id="file-upload-right-panel"
          />
          <label htmlFor="file-upload-right-panel" className="cursor-pointer">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Upload design files
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-xs text-gray-400">
              Supports: PNG, JPG, PDF (max 50MB each)
            </p>
          </label>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => document.getElementById('file-upload-right-panel')?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Choose Files
          </button>
          <button
            onClick={onToggleUrlInput}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Paperclip className="h-4 w-4" />
            Add URL
          </button>
        </div>

        {/* Show attachments if any */}
        {attachments.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Attachments</span>
              <Badge variant="secondary">{attachments.length}</Badge>
            </div>
            {attachments.map((attachment) => (
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
                        {attachment.type === 'file' && (
                          <Button variant="outline" size="sm" className="h-6 text-xs">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </>
                    )}
                    {onRemoveAttachment && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 text-xs ml-auto"
                        onClick={() => onRemoveAttachment(attachment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white border-l border-gray-200 flex flex-col h-full w-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{getHeaderTitle()}</h3>
              {attachments.length > 0 && mode === 'upload' && (
                <Badge variant="secondary" className="text-xs">
                  {attachments.length}
                </Badge>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleCollapse}
            className={`h-8 w-8 p-0 flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}
            title={isCollapsed ? "Expand panel" : "Collapse panel"}
          >
            {isCollapsed ? (
              <PanelRightOpen className="h-4 w-4" />
            ) : (
              <PanelRightClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-hidden">
          {mode === 'templates' ? (
            <TemplatesPanel
              promptTemplates={promptTemplates}
              selectedPromptTemplate={selectedPromptTemplate}
              onPromptTemplateSelect={onPromptTemplateSelect}
            />
          ) : mode === 'analysis' ? (
            <AnalysisDetailsPanel
              currentAnalysis={currentAnalysis}
              attachments={attachments}
              onAnalysisClick={onAnalysisClick}
              onBackClick={onBackClick}
            />
          ) : (
            renderUploadView()
          )}
        </div>
      )}

      {/* Collapsed state content */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 p-0 flex items-center justify-center"
            onClick={handleToggleCollapse}
            title={getHeaderTitle()}
          >
            {React.createElement(getModeIcon(), { className: "h-5 w-5" })}
          </Button>
          {attachments.length > 0 && mode === 'upload' && (
            <Badge variant="secondary" className="text-xs mt-2">
              {attachments.length}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
