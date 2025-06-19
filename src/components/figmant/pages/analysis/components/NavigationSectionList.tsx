
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, Globe, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { FileAttachmentsSection } from './FileAttachmentsSection';
import { WebsiteAttachmentsSection } from './WebsiteAttachmentsSection';
import { AnalysisInsightsSection } from './AnalysisInsightsSection';
import { NavigationEmptyState } from './NavigationEmptyState';

interface NavigationSectionListProps {
  fileAttachments: ChatAttachment[];
  urlAttachments: ChatAttachment[];
  analysisMessages: ChatMessage[];
  lastAnalysisResult?: any;
  onRemoveAttachment: (id: string) => void;
  onViewAttachment: (attachment: ChatAttachment) => void;
}

export const NavigationSectionList: React.FC<NavigationSectionListProps> = ({
  fileAttachments,
  urlAttachments,
  analysisMessages,
  lastAnalysisResult,
  onRemoveAttachment,
  onViewAttachment
}) => {
  // Navigation sections
  const sections = [
    {
      id: 'files',
      label: `Files (${fileAttachments.length})`,
      icon: FileText,
      badge: fileAttachments.length > 0 ? fileAttachments.length.toString() : undefined,
      content: fileAttachments
    },
    {
      id: 'websites',
      label: `Websites (${urlAttachments.length})`,
      icon: Globe,
      badge: urlAttachments.length > 0 ? urlAttachments.length.toString() : undefined,
      content: urlAttachments
    },
    {
      id: 'insights',
      label: 'Analysis Insights',
      icon: Brain,
      badge: analysisMessages.length > 0 ? analysisMessages.length.toString() : undefined,
      content: analysisMessages
    }
  ];

  const hasAnyContent = fileAttachments.length > 0 || urlAttachments.length > 0 || lastAnalysisResult;

  return (
    <div 
      style={{
        display: 'flex',
        padding: '12px',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        alignSelf: 'stretch',
        borderTop: '1px solid var(--Stroke-01, #ECECEC)'
      }}
    >
      {sections.map((section) => (
        <div key={section.id} className="w-full">
          <div
            className={cn(
              "w-full justify-start h-10 px-3 flex-shrink-0 flex items-center",
              "hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md"
            )}
          >
            <section.icon className="h-4 w-4 mr-1" />
            <span 
              className="flex-1 text-left"
              style={{
                overflow: 'hidden',
                color: 'var(--Text-Primary, #121212)',
                textOverflow: 'ellipsis',
                fontFamily: '"Instrument Sans"',
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '16px',
                letterSpacing: '-0.12px'
              }}
            >
              {section.label}
            </span>
            {section.badge && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {section.badge}
              </Badge>
            )}
          </div>

          {/* Section Content */}
          {section.id === 'files' && (
            <FileAttachmentsSection
              fileAttachments={fileAttachments}
              onRemoveAttachment={onRemoveAttachment}
              onViewAttachment={onViewAttachment}
            />
          )}

          {section.id === 'websites' && (
            <WebsiteAttachmentsSection
              urlAttachments={urlAttachments}
              onRemoveAttachment={onRemoveAttachment}
            />
          )}

          {section.id === 'insights' && (
            <AnalysisInsightsSection
              lastAnalysisResult={lastAnalysisResult}
              analysisMessages={analysisMessages}
            />
          )}
        </div>
      ))}

      {/* Empty State */}
      {!hasAnyContent && <NavigationEmptyState />}
    </div>
  );
};
