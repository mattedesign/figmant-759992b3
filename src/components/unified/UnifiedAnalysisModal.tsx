
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  FileText, 
  Paperclip, 
  History, 
  Settings,
  MessageSquare,
  Sparkles,
  BarChart3,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { OverviewTabContent } from './tabs/OverviewTabContent';
import { DetailsTabContent } from './tabs/DetailsTabContent';
import { AttachmentsTabContent } from './tabs/AttachmentsTabContent';
import { HistoryTabContent } from './tabs/HistoryTabContent';
import { ActionsTabContent } from './tabs/ActionsTabContent';
import { 
  getAnalysisTitle,
  getAttachmentsFromAnalysis,
  getAnalysisSummary
} from '@/utils/analysisAttachments';

interface UnifiedAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: any;
  analysisType: 'premium' | 'chat' | 'design' | 'wizard' | 'batch';
  showAttachments?: boolean;
  showHistory?: boolean;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'details', label: 'Analysis Details', icon: FileText },
  { id: 'attachments', label: 'Files & Links', icon: Paperclip },
  { id: 'history', label: 'Related History', icon: History },
  { id: 'actions', label: 'Actions', icon: Settings }
];

export const UnifiedAnalysisModal: React.FC<UnifiedAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  analysisType,
  showAttachments = true,
  showHistory = true
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!analysis) {
    console.log('🔍 UnifiedAnalysisModal: No analysis provided');
    return null;
  }

  console.log('🔍 UnifiedAnalysisModal: Rendering modal for analysis:', {
    id: analysis.id,
    type: analysisType,
    title: getAnalysisTitle(analysis)
  });

  const getAnalysisIcon = () => {
    switch (analysisType) {
      case 'chat':
        return MessageSquare;
      case 'wizard':
      case 'premium':
        return Sparkles;
      case 'batch':
        return BarChart3;
      default:
        return FileText;
    }
  };

  const getAnalysisTypeLabel = () => {
    switch (analysisType) {
      case 'chat':
        return 'Chat Analysis';
      case 'wizard':
        return 'Premium Wizard';
      case 'premium':
        return 'Premium Analysis';
      case 'batch':
        return 'Batch Analysis';
      case 'design':
        return 'Design Analysis';
      default:
        return 'Analysis';
    }
  };

  const getConfidenceScore = () => {
    if (analysis.confidence_score) {
      return Math.round(analysis.confidence_score * 100);
    }
    if (analysis.score) {
      return analysis.score * 10;
    }
    return 85;
  };

  const attachments = getAttachmentsFromAnalysis(analysis);
  const title = getAnalysisTitle(analysis);
  const Icon = getAnalysisIcon();

  // Filter tabs based on props and content availability
  const availableTabs = tabs.filter(tab => {
    switch (tab.id) {
      case 'attachments':
        return showAttachments;
      case 'history':
        return showHistory;
      default:
        return true;
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] w-[95vw] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">
                    {title}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {getAnalysisTypeLabel()}
                    </Badge>
                    <Badge variant="default" className="text-xs">
                      Score: {getConfidenceScore()}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Tabbed Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="px-6 py-2 border-b bg-gray-50">
                <TabsList className="grid w-full grid-cols-5 h-10">
                  {availableTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center gap-2 text-xs"
                    >
                      <tab.icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="overview" className="m-0 h-full">
                  <OverviewTabContent 
                    analysis={analysis} 
                    analysisType={analysisType}
                    attachments={attachments}
                  />
                </TabsContent>

                <TabsContent value="details" className="m-0 h-full">
                  <DetailsTabContent 
                    analysis={analysis} 
                    analysisType={analysisType}
                  />
                </TabsContent>

                <TabsContent value="attachments" className="m-0 h-full">
                  <AttachmentsTabContent 
                    analysis={analysis}
                    attachments={attachments}
                  />
                </TabsContent>

                <TabsContent value="history" className="m-0 h-full">
                  <HistoryTabContent 
                    analysis={analysis}
                    analysisType={analysisType}
                  />
                </TabsContent>

                <TabsContent value="actions" className="m-0 h-full">
                  <ActionsTabContent 
                    analysis={analysis}
                    analysisType={analysisType}
                    onClose={onClose}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
