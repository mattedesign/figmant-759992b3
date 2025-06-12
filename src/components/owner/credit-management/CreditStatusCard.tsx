
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserCredits {
  current_balance: number;
  total_purchased: number;
  total_used: number;
}

interface CreditStatusCardProps {
  credits: UserCredits | null;
}

export const CreditStatusCard = ({ credits }: CreditStatusCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Current Credit Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {credits?.current_balance || 0}
            </div>
            <div className="text-xs text-muted-foreground">Current Balance</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {credits?.total_purchased || 0}
            </div>
            <div className="text-xs text-muted-foreground">Total Purchased</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {credits?.total_used || 0}
            </div>
            <div className="text-xs text-muted-foreground">Total Used</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
