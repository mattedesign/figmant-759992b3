
import React from 'react';
import { MainCreditDisplay } from './MainCreditDisplay';
import { Button } from '@/components/ui/button';

interface AnalysisPageHeaderProps {
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const AnalysisPageHeader: React.FC<AnalysisPageHeaderProps> = ({
  title = "AI Analysis",
  onBack,
  showBackButton = false
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {showBackButton && onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            Back
          </Button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <MainCreditDisplay />
      </div>
    </div>
  );
};
