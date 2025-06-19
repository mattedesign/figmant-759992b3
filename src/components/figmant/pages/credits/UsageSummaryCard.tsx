
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UsageSummaryCardProps {
  totalPurchased: number;
  totalUsed: number;
  currentBalance: number;
}

export const UsageSummaryCard: React.FC<UsageSummaryCardProps> = ({
  totalPurchased,
  totalUsed,
  currentBalance
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Usage Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-muted-foreground">Total Purchased</span>
          <span className="text-xs sm:text-sm font-medium">{totalPurchased} credits</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-muted-foreground">Total Used</span>
          <span className="text-xs sm:text-sm font-medium">{totalUsed} credits</span>
        </div>
        <div className="flex justify-between items-center border-t pt-2 sm:pt-3">
          <span className="text-sm sm:text-base font-medium">Available</span>
          <span className="text-sm sm:text-base font-medium">{currentBalance} credits</span>
        </div>
      </CardContent>
    </Card>
  );
};
