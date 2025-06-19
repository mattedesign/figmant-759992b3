
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
    <Card>
      <CardHeader>
        <CardTitle>Usage Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm">Total Purchased</span>
            <span className="text-sm font-medium">{totalPurchased} credits</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Total Used</span>
            <span className="text-sm font-medium">{totalUsed} credits</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="font-medium">Available</span>
            <span className="font-medium">{currentBalance} credits</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
