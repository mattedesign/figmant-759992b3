
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClaudeUsageStats } from '@/types/claude';

interface ClaudeUsageStatsCardProps {
  usageStats: ClaudeUsageStats;
}

export const ClaudeUsageStatsCard = ({ usageStats }: ClaudeUsageStatsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Statistics (Last 30 Days)</CardTitle>
        <CardDescription>
          Monitor your Claude AI usage, costs, and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{usageStats.requestCount}</div>
            <div className="text-sm text-muted-foreground">Total Requests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{usageStats.successfulRequests}</div>
            <div className="text-sm text-muted-foreground">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{usageStats.totalTokens.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Tokens Used</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">${usageStats.totalCost.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Estimated Cost</div>
          </div>
        </div>
        {usageStats.requestCount > 0 && (
          <div className="mt-4 text-center">
            <Badge variant={parseFloat(usageStats.errorRate) < 5 ? "default" : "destructive"}>
              {usageStats.errorRate}% Error Rate
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
