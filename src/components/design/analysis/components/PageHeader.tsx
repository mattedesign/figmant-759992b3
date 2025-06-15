
import React from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AllAnalysisPageHeader } from '../AllAnalysisPageHeader';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';

interface PageHeaderProps {
  viewMode: 'grouped' | 'table';
  onViewModeChange: (mode: 'grouped' | 'table') => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  filteredGroupedAnalysesCount: number;
  totalGroupedAnalysesCount: number;
  filteredAnalysesCount: number;
  totalAnalysesCount: number;
  connectionStatus: 'connecting' | 'connected' | 'error' | 'fallback' | 'disabled';
  showDiagnostics: boolean;
  onShowDiagnosticsChange: (show: boolean) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  viewMode,
  onViewModeChange,
  onManualRefresh,
  isRefreshing,
  filteredGroupedAnalysesCount,
  totalGroupedAnalysesCount,
  filteredAnalysesCount,
  totalAnalysesCount,
  connectionStatus,
  showDiagnostics,
  onShowDiagnosticsChange
}) => {
  return (
    <div className="flex items-center justify-between">
      <AllAnalysisPageHeader
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onManualRefresh={onManualRefresh}
        isRefreshing={isRefreshing}
        filteredGroupedAnalysesCount={filteredGroupedAnalysesCount}
        totalGroupedAnalysesCount={totalGroupedAnalysesCount}
        filteredAnalysesCount={filteredAnalysesCount}
        totalAnalysesCount={totalAnalysesCount}
      />
      
      <div className="flex items-center gap-2">
        <ConnectionStatusBadge status={connectionStatus} />
        <Collapsible open={showDiagnostics} onOpenChange={onShowDiagnosticsChange}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {showDiagnostics ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>
    </div>
  );
};
