
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUserCredits } from '@/hooks/useUserCredits';
import { Coins, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export const CreditsTab = () => {
  const { credits, transactions, creditsLoading, transactionsLoading } = useUserCredits();

  if (creditsLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'usage':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'refund':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case 'admin_adjustment':
        return <Coins className="h-4 w-4 text-purple-600" />;
      default:
        return <Coins className="h-4 w-4" />;
    }
  };

  const getTransactionBadgeVariant = (type: string) => {
    switch (type) {
      case 'purchase':
      case 'refund':
        return 'default';
      case 'usage':
        return 'destructive';
      case 'admin_adjustment':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Coins className="h-4 w-4" />
        <h3 className="text-lg font-medium">Credits & Usage</h3>
      </div>

      {/* Credits Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5" />
            <span>Your Credits</span>
          </CardTitle>
          <CardDescription>
            Track your credit balance and usage history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {credits ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {credits.current_balance.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Current Balance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {credits.total_purchased.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Purchased</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {credits.total_used.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Used</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No credit account found</p>
              <p className="text-sm">Credits will appear here after your first purchase</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Recent credit transactions and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 10).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTransactionIcon(transaction.transaction_type)}
                        <Badge variant={getTransactionBadgeVariant(transaction.transaction_type)}>
                          {transaction.transaction_type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        transaction.transaction_type === 'usage' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.transaction_type === 'usage' ? '-' : '+'}
                        {transaction.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{transaction.description || 'No description'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found</p>
              <p className="text-sm">Your credit transactions will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
