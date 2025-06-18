
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserDebugInfo } from '@/hooks/useUserDebugInfo';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';

export const UserDebugPanel: React.FC = () => {
  const { data: debugInfo, isLoading, error, refetch } = useUserDebugInfo();
  const [showRawData, setShowRawData] = React.useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading Debug Info...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Debug Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error.message}</p>
          <Button onClick={() => refetch()} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!debugInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Debug Data Available</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const getStatusIcon = (hasData: boolean, hasError: boolean) => {
    if (hasError) return <XCircle className="h-4 w-4 text-red-500" />;
    if (hasData) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusBadge = (hasData: boolean, hasError: boolean) => {
    if (hasError) return <Badge variant="destructive">Error</Badge>;
    if (hasData) return <Badge variant="default">OK</Badge>;
    return <Badge variant="secondary">Missing</Badge>;
  };

  // Calculate overall access status
  const hasCredits = debugInfo.credits?.current_balance > 0;
  const hasActiveSubscription = debugInfo.subscription?.status === 'active';
  const isOwner = debugInfo.profile?.role === 'owner';
  const shouldHaveAccess = isOwner || hasActiveSubscription || hasCredits;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            User Debug Information
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowRawData(!showRawData)} 
                size="sm" 
                variant="ghost"
              >
                {showRawData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showRawData ? 'Hide' : 'Show'} Raw
              </Button>
              <Button onClick={() => refetch()} size="sm" variant="outline">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Debugging information for user: {debugInfo.user?.email}
            <br />
            <span className={`font-bold ${shouldHaveAccess ? 'text-green-600' : 'text-red-600'}`}>
              Expected Access: {shouldHaveAccess ? 'YES' : 'NO'}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Access Summary */}
          <div className="p-3 border rounded bg-gray-50">
            <h4 className="font-semibold mb-2">Access Analysis</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span>Is Owner:</span>
              <span className={isOwner ? 'text-green-600' : 'text-red-600'}>
                {isOwner ? 'YES' : 'NO'}
              </span>
              <span>Has Active Subscription:</span>
              <span className={hasActiveSubscription ? 'text-green-600' : 'text-red-600'}>
                {hasActiveSubscription ? 'YES' : 'NO'}
              </span>
              <span>Has Credits:</span>
              <span className={hasCredits ? 'text-green-600' : 'text-red-600'}>
                {hasCredits ? 'YES' : 'NO'}
              </span>
              <span>Database Access Check:</span>
              <span className={debugInfo.hasAccess ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.hasAccess ? 'ALLOWED' : 'DENIED'}
              </span>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-2">
              {getStatusIcon(!!debugInfo.profile, !!debugInfo.errors.profileError)}
              <span className="font-medium">Profile</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(!!debugInfo.profile, !!debugInfo.errors.profileError)}
              {debugInfo.profile && (
                <span className="text-sm text-gray-600">
                  Role: {debugInfo.profile.role}
                </span>
              )}
            </div>
          </div>

          {/* Subscription */}
          <div className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-2">
              {getStatusIcon(!!debugInfo.subscription, !!debugInfo.errors.subscriptionError)}
              <span className="font-medium">Subscription</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(!!debugInfo.subscription, !!debugInfo.errors.subscriptionError)}
              {debugInfo.subscription && (
                <span className="text-sm text-gray-600">
                  Status: {debugInfo.subscription.status}
                </span>
              )}
            </div>
          </div>

          {/* Credits */}
          <div className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-2">
              {getStatusIcon(!!debugInfo.credits, !!debugInfo.errors.creditsError)}
              <span className="font-medium">Credits</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(!!debugInfo.credits, !!debugInfo.errors.creditsError)}
              {debugInfo.credits && (
                <span className="text-sm text-gray-600">
                  Balance: {debugInfo.credits.current_balance}/{debugInfo.credits.total_purchased}
                </span>
              )}
            </div>
          </div>

          {/* Access Check */}
          <div className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-2">
              {getStatusIcon(debugInfo.hasAccess === true, !!debugInfo.errors.accessError)}
              <span className="font-medium">Access Permission</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(debugInfo.hasAccess === true, !!debugInfo.errors.accessError)}
              <span className="text-sm text-gray-600">
                {debugInfo.hasAccess ? 'Allowed' : 'Denied'}
              </span>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="p-3 border rounded">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(!!debugInfo.transactions?.length, !!debugInfo.errors.transactionsError)}
              <span className="font-medium">Recent Transactions</span>
              <Badge variant="outline">{debugInfo.transactions?.length || 0}</Badge>
            </div>
            {debugInfo.transactions?.length > 0 ? (
              <div className="space-y-1">
                {debugInfo.transactions.slice(0, 3).map((transaction, index) => (
                  <div key={index} className="text-sm text-gray-600 flex justify-between">
                    <span>{transaction.description}</span>
                    <span>{transaction.transaction_type}: {transaction.amount}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No transactions found</p>
            )}
          </div>

          {/* Raw Data Toggle */}
          {showRawData && (
            <div className="p-3 border rounded bg-gray-50">
              <h4 className="font-semibold mb-2">Raw Debug Data</h4>
              <pre className="text-xs overflow-auto max-h-60 bg-white p-2 rounded border">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Details */}
      {Object.values(debugInfo.errors).some(error => error) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(debugInfo.errors).map(([key, error]) => 
              error && (
                <div key={key} className="p-2 bg-red-50 border border-red-200 rounded">
                  <p className="font-medium text-red-800">{key}:</p>
                  <p className="text-red-600 text-sm">{error.message}</p>
                  {error.details && (
                    <pre className="text-xs text-red-500 mt-1 overflow-auto">
                      {JSON.stringify(error.details, null, 2)}
                    </pre>
                  )}
                </div>
              )
            )}
          </CardContent>
        </Card>
      )}

      {/* Authentication Status */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span>User ID:</span>
            <span className="font-mono text-xs">{debugInfo.user?.id || 'Not available'}</span>
            <span>Email:</span>
            <span>{debugInfo.user?.email || 'Not available'}</span>
            <span>Current Route:</span>
            <span>/auth</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
