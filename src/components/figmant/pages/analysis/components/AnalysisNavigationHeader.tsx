
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PanelRightClose, CreditCard, Crown, Zap } from 'lucide-react';

interface AnalysisNavigationHeaderProps {
  onToggleCollapse?: () => void;
  creditCost?: number;
}

export const AnalysisNavigationHeader: React.FC<AnalysisNavigationHeaderProps> = ({
  onToggleCollapse,
  creditCost = 1
}) => {
  const getCreditIcon = () => {
    if (creditCost >= 5) return <Crown className="h-3 w-3" />;
    if (creditCost >= 3) return <Zap className="h-3 w-3" />;
    return <CreditCard className="h-3 w-3" />;
  };

  const getCreditStyle = () => {
    if (creditCost >= 5) {
      return "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none";
    }
    if (creditCost >= 3) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="flex-none border-b border-border">
      {/* Header with collapse button on left and credit cost display on right */}
      <div className="p-4 flex items-center justify-between">
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
        
        <Badge className={`flex items-center gap-1 transition-all duration-200 ${getCreditStyle()}`}>
          {getCreditIcon()}
          {creditCost} Credit{creditCost !== 1 ? 's' : ''}
        </Badge>
      </div>
    </div>
  );
};
