
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
  const hasContent = fileAttachments.length > 0 || urlAttachments.length > 0 || lastAnalysisResult || analysisMessages.length > 0;

  return (
    <div className="flex-1 overflow-y-auto">
      <TabsContent value="details" className="mt-0 space-y-4">
        {hasContent ? (
          <div className="space-y-4">
            {/* File Attachments */}
            {fileAttachments.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Files ({fileAttachments.length})
                </div>
                <FileAttachmentsSection
                  fileAttachments={fileAttachments}
                  onRemoveAttachment={onRemoveAttachment}
                  onViewAttachment={onViewAttachment}
                />
              </div>
            )}

            {/* Website Attachments */}
            {urlAttachments.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Websites ({urlAttachments.length})
                </div>
                <WebsiteAttachmentsSection
                  urlAttachments={urlAttachments}
                  onRemoveAttachment={onRemoveAttachment}
                />
              </div>
            )}

            {/* Analysis Insights */}
            {(lastAnalysisResult || analysisMessages.length > 0) && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Analysis Insights
                </div>
                <AnalysisInsightsSection
                  lastAnalysisResult={lastAnalysisResult}
                  analysisMessages={analysisMessages}
                />
              </div>
            )}
          </div>
        ) : (
          <NavigationEmptyState />
        )}
      </TabsContent>

      <TabsContent value="suggestions" className="mt-0">
        <div className="px-3">
          <SuggestionsTabContent />
        </div>
      </TabsContent>
    </div>
  );
};
