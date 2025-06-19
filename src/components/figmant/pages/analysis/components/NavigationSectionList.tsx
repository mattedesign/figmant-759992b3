
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { FileAttachmentsSection } from './FileAttachmentsSection';
import { WebsiteAttachmentsSection } from './WebsiteAttachmentsSection';
import { AnalysisInsightsSection } from './AnalysisInsightsSection';
import { SuggestionsTabContent } from './SuggestionsTabContent';
import { NavigationEmptyState } from './NavigationEmptyState';

interface NavigationSectionListProps {
  fileAttachments: ChatAttachment[];
  urlAttachments: ChatAttachment[];
  analysisMessages: ChatMessage[];
  lastAnalysisResult?: any;
  onRemoveAttachment: (id: string) => void;
  onViewAttachment: (attachment: ChatAttachment) => void;
  activeTab?: string;
}

export const NavigationSectionList: React.FC<NavigationSectionListProps> = ({
  fileAttachments,
  urlAttachments,
  analysisMessages,
  lastAnalysisResult,
  onRemoveAttachment,
  onViewAttachment,
  activeTab = 'details'
}) => {
  const hasAnyContent = fileAttachments.length > 0 || urlAttachments.length > 0 || lastAnalysisResult || analysisMessages.length > 0;

  console.log('📋 NAVIGATION SECTION LIST - Rendering with:', {
    fileAttachmentsCount: fileAttachments.length,
    urlAttachmentsCount: urlAttachments.length,
    analysisMessagesCount: analysisMessages.length,
    hasLastAnalysisResult: !!lastAnalysisResult,
    activeTab,
    fileAttachmentDetails: fileAttachments.map(att => ({ id: att.id, name: att.name, status: att.status })),
    urlAttachmentDetails: urlAttachments.map(att => ({ id: att.id, name: att.name, url: att.url, status: att.status }))
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <TabsContent value="details" className="mt-0 space-y-6">
        <div className="space-y-6">
          {/* Files Section - Always show */}
          <div>
            <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">Files</h3>
              {fileAttachments.length > 0 && (
                <span className="text-xs text-gray-500">({fileAttachments.length})</span>
              )}
            </div>
            {fileAttachments.length > 0 ? (
              <FileAttachmentsSection
                fileAttachments={fileAttachments}
                onRemoveAttachment={onRemoveAttachment}
                onViewAttachment={onViewAttachment}
              />
            ) : (
              <div className="px-3 py-4">
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500">No files uploaded yet</p>
                </div>
              </div>
            )}
          </div>

          {/* Links Section - Always show */}
          <div>
            <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">Links</h3>
              {urlAttachments.length > 0 && (
                <span className="text-xs text-gray-500">({urlAttachments.length})</span>
              )}
            </div>
            {urlAttachments.length > 0 ? (
              <WebsiteAttachmentsSection
                urlAttachments={urlAttachments}
                onRemoveAttachment={onRemoveAttachment}
              />
            ) : (
              <div className="px-3 py-4">
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500">No links added yet</p>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Insights Section - Only show if there are insights */}
          {(lastAnalysisResult || analysisMessages.length > 0) && (
            <div>
              <div className="px-3 py-2 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900">Analysis Insights</h3>
              </div>
              <AnalysisInsightsSection
                lastAnalysisResult={lastAnalysisResult}
                analysisMessages={analysisMessages}
              />
            </div>
          )}

          {/* Show overall empty state only if no content at all */}
          {!hasAnyContent && (
            <div className="px-3">
              <NavigationEmptyState />
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="suggestions" className="mt-0">
        <div className="px-3">
          <SuggestionsTabContent />
        </div>
      </TabsContent>
    </div>
  );
};
