
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap } from 'lucide-react';

interface CreditStatusCardProps {
  currentBalance: number;
  totalPurchased: number;
}

export const CreditStatusCard: React.FC<CreditStatusCardProps> = ({
  currentBalance,
  totalPurchased
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
          Current Credits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="text-2xl sm:text-3xl font-bold">
          {currentBalance} / {totalPurchased}
        </div>
        <Progress 
          value={totalPurchased > 0 ? (currentBalance / totalPurchased) * 100 : 0} 
          className="h-2 sm:h-3" 
        />
        <p className="text-xs sm:text-sm text-muted-foreground">
          Credits remaining
        </p>
      </CardContent>
    </Card>
  );
};
