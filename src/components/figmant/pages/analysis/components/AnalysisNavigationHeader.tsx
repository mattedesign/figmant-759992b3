
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelRightClose } from 'lucide-react';

interface AnalysisNavigationHeaderProps {
  onToggleCollapse?: () => void;
  creditCost?: number;
}

export const AnalysisNavigationHeader: React.FC<AnalysisNavigationHeaderProps> = ({
  onToggleCollapse,
  creditCost = 1
}) => {
  return (
    <div className="flex-none border-b border-border">
      {/* Header with collapse button on left and credit cost display */}
      <div className="p-4 flex items-center gap-3">
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-6 w-6 p-0 hover:bg-muted flex-shrink-0"
          >
            <PanelRightClose className="h-4 w-4" />
          </Button>
        )}
        
        <div 
          style={{
            display: 'flex',
            padding: '10px 24px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '12px',
            background: 'linear-gradient(180deg, #E5E5E5 0%, #E2E2E2 100%)',
            boxShadow: '0px 3px 4px -1px rgba(0, 0, 0, 0.15), 0px 1px 0px 0px rgba(255, 255, 255, 0.33) inset, 0px 0px 0px 1px #D4D4D4',
            color: 'var(--Text-Primary, #121212)',
            textAlign: 'center' as const,
            fontFamily: '"Instrument Sans"',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '20px',
            letterSpacing: '-0.28px'
          }}
        >
          {creditCost} {creditCost === 1 ? 'Credit' : 'Credits'}
        </div>
      </div>
    </div>
  );
};
