
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Plus } from 'lucide-react';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

interface SidebarCreditsProps {
  currentBalance: number;
  totalPurchased: number;
  creditsLoading: boolean;
}

export const SidebarCredits: React.FC<SidebarCreditsProps> = ({
  currentBalance,
  totalPurchased,
  creditsLoading
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const getContainerClasses = () => {
    if (isTablet) {
      return "p-3 border-t border-gray-200/30";
    }
    return "p-4 border-t border-gray-200/30";
  };

  const getCardClasses = () => {
    if (isTablet) {
      return "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50";
    }
    return "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50";
  };

  const getHeaderClasses = () => {
    if (isTablet) {
      return "pb-2";
    }
    return "pb-3";
  };

  const getTitleClasses = () => {
    if (isTablet) {
      return "text-sm font-semibold text-gray-900 flex items-center gap-2";
    }
    return "text-sm font-semibold text-gray-900 flex items-center gap-2";
  };

  const getContentClasses = () => {
    if (isTablet) {
      return "pt-0 space-y-2";
    }
    return "pt-0 space-y-3";
  };

  const getBalanceClasses = () => {
    if (isTablet) {
      return "text-lg font-bold text-blue-700";
    }
    return "text-xl font-bold text-blue-700";
  };

  const getStatClasses = () => {
    if (isTablet) {
      return "text-xs text-gray-600";
    }
    return "text-xs text-gray-600";
  };

  const getButtonSize = (): "sm" | "default" | "lg" | "icon" => {
    if (isTablet) {
      return "sm";
    }
    return "sm";
  };

  const getIconSize = () => {
    if (isTablet) {
      return "h-3 w-3";
    }
    return "h-4 w-4";
  };

  if (creditsLoading) {
    return (
      <div className={getContainerClasses()}>
        <div className="animate-pulse">
          <div className={`h-16 ${isTablet ? 'h-14' : ''} bg-gray-200 rounded-lg`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={getContainerClasses()}>
      <Card className={getCardClasses()}>
        <CardHeader className={getHeaderClasses()}>
          <h3 className={getTitleClasses()}>
            <Coins className={getIconSize()} />
            Credits
          </h3>
        </CardHeader>
        <CardContent className={getContentClasses()}>
          <div className="space-y-1">
            <div className={getBalanceClasses()}>
              {currentBalance.toLocaleString()}
            </div>
            <div className={getStatClasses()}>
              {totalPurchased.toLocaleString()} total purchased
            </div>
          </div>
          
          <Button 
            size={getButtonSize()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className={getIconSize()} />
            {isTablet ? 'Buy' : 'Buy Credits'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
