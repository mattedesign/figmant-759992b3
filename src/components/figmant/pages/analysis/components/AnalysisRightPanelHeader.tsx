
import React, { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Crown, Zap } from 'lucide-react';
import { useTemplateCreditStore } from '@/stores/templateCreditStore';

interface AnalysisRightPanelHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalAttachments: number;
}

export const AnalysisRightPanelHeader: React.FC<AnalysisRightPanelHeaderProps> = ({
  activeTab,
  onTabChange,
  totalAttachments
}) => {
  // Use global store for credit cost
  const currentCreditCost = useTemplateCreditStore((state) => {
    console.log('🔄 AnalysisRightPanelHeader: Store selector called, credit cost:', state.currentCreditCost);
    return state.currentCreditCost;
  });

  console.log('🔄 AnalysisRightPanelHeader: Component rendering with credit cost:', currentCreditCost);

  // Monitor credit cost changes
  useEffect(() => {
    console.log('🔄 AnalysisRightPanelHeader: useEffect triggered - credit cost changed to:', currentCreditCost);
  }, [currentCreditCost]);

  const getCreditIcon = () => {
    if (currentCreditCost >= 5) return <Crown className="h-3 w-3" />;
    if (currentCreditCost >= 3) return <Zap className="h-3 w-3" />;
    return <CreditCard className="h-3 w-3" />;
  };

  const getCreditStyle = () => {
    if (currentCreditCost >= 5) {
      return "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none";
    }
    if (currentCreditCost >= 3) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="px-4 py-3 border-b border-gray-200" style={{ backgroundColor: '#FFF' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">Analysis Details</h3>
          <Badge className={`flex items-center gap-1 transition-all duration-200 ${getCreditStyle()}`}>
            {getCreditIcon()}
            {currentCreditCost} Credit{currentCreditCost !== 1 ? 's' : ''}
          </Badge>
        </div>
        <Badge variant="secondary" className="text-xs">
          {totalAttachments}
        </Badge>
      </div>
      
      {/* Tabs positioned in header where they belong */}
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details" className="text-sm">
            Details
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="text-sm">
            Insights
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
