
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, Bug } from 'lucide-react';
import { ChatAttachment } from '../DesignChatInterface';
import { ClaudeTestingSection } from './debug/ClaudeTestingSection';
import { SystemStatusSection } from './debug/SystemStatusSection';
import { AttachmentsDebugSection } from './debug/AttachmentsDebugSection';
import { AnalysisResultsSection } from './debug/AnalysisResultsSection';

interface DebugPanelProps {
  attachments: ChatAttachment[];
  lastAnalysisResult?: any;
  isVisible?: boolean;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ 
  attachments, 
  lastAnalysisResult,
  isVisible = false 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!isVisible) return null;

  return (
    <Card className="mt-4 border-orange-200 bg-orange-50">
      <CardHeader 
        className="cursor-pointer hover:bg-orange-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bug className="h-4 w-4" />
          Debug & Test Panel
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CardTitle>
      </CardHeader>
      {isOpen && (
        <CardContent className="space-y-6">
          <ClaudeTestingSection />
          <SystemStatusSection lastAnalysisResult={lastAnalysisResult} />
          <AttachmentsDebugSection attachments={attachments} />
          <AnalysisResultsSection lastAnalysisResult={lastAnalysisResult} />
        </CardContent>
      )}
    </Card>
  );
};
