
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Current Credits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-3xl font-bold">{currentBalance} / {totalPurchased}</div>
          <Progress value={totalPurchased > 0 ? (currentBalance / totalPurchased) * 100 : 0} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Credits remaining
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
