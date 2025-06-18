
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserDebugInfo } from '@/hooks/useUserDebugInfo';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Eye, EyeOff, Database, User, CreditCard } from 'lucide-react';

export const UserDebugPanel: React.FC = () => {
  const { data: debugInfo, isLoading, error, refetch } = useUserDebugInfo();
  const [showRawData, setShowRawData] = React.useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading Debug Info for Mbrown@tfin.com...
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

  // Check if this is an error response
  if ('error' in debugInfo && debugInfo.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            User Lookup Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-red-600 font-medium">{debugInfo.error}</p>
            
            {debugInfo.profilesError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700">Profile Error: {debugInfo.profilesError}</p>
              </div>
            )}

            {debugInfo.debugInfo?.similarEmails && debugInfo.debugInfo.similarEmails.length > 0 && (
              <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-700 font-medium">Similar email addresses found:</p>
                <ul className="text-sm text-blue-600 mt-1">
                  {debugInfo.debugInfo.similarEmails.map((email, index) => (
                    <li key={index}>• {email}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={() => refetch()} className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Type guard to ensure we have the full debug data
  const hasFullDebugData = (data: any): data is {
    user: any;
    profile: any;
    subscription: any;
    credits: any;
    hasAccess: boolean;
    errors: any;
    transactions: any[];
  } => {
    return data && 'profile' in data && 'subscription' in data && 'credits' in data && 'hasAccess' in data;
  };

  if (!hasFullDebugData(debugInfo)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="h-5 w-5" />
            Incomplete Debug Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-600">Debug data is incomplete. This might indicate authentication or permission issues.</p>
          <Button onClick={() => refetch()} className="mt-2">
            Retry
          </Button>
          
          {showRawData && (
            <div className="mt-4 p-3 border rounded bg-gray-50">
              <h4 className="font-semibold mb-2">Raw Debug Data</h4>
              <pre className="text-xs overflow-auto max-h-60 bg-white p-2 rounded border whitespace-pre-wrap">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
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
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Debug Info: Mbrown@tfin.com
            </div>
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
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Access Analysis
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span>Is Owner:</span>
              <span className={isOwner ? 'text-green-600 font-medium' : 'text-red-600'}>
                {isOwner ? 'YES' : 'NO'}
              </span>
              <span>Has Active Subscription:</span>
              <span className={hasActiveSubscription ? 'text-green-600 font-medium' : 'text-red-600'}>
                {hasActiveSubscription ? 'YES' : 'NO'} 
                {debugInfo.subscription && ` (${debugInfo.subscription.status})`}
              </span>
              <span>Has Credits:</span>
              <span className={hasCredits ? 'text-green-600 font-medium' : 'text-red-600'}>
                {hasCredits ? 'YES' : 'NO'}
                {debugInfo.credits && ` (${debugInfo.credits.current_balance})`}
              </span>
              <span>Database Access Check:</span>
              <span className={debugInfo.hasAccess ? 'text-green-600 font-medium' : 'text-red-600'}>
                {debugInfo.hasAccess ? 'ALLOWED' : 'DENIED'}
              </span>
            </div>
          </div>

          {/* Database Query Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* User Profile */}
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(!!debugInfo.profile, !!debugInfo.errors?.profileError)}
                <span className="font-medium">Profile</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(!!debugInfo.profile, !!debugInfo.errors?.profileError)}
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
                {getStatusIcon(!!debugInfo.subscription, !!debugInfo.errors?.subscriptionError)}
                <span className="font-medium">Subscription</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(!!debugInfo.subscription, !!debugInfo.errors?.subscriptionError)}
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
                {getStatusIcon(!!debugInfo.credits, !!debugInfo.errors?.creditsError)}
                <CreditCard className="h-4 w-4" />
                <span className="font-medium">Credits</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(!!debugInfo.credits, !!debugInfo.errors?.creditsError)}
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
                {getStatusIcon(debugInfo.hasAccess === true, !!debugInfo.errors?.accessError)}
                <span className="font-medium">Access Permission</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(debugInfo.hasAccess === true, !!debugInfo.errors?.accessError)}
                <span className="text-sm text-gray-600">
                  {debugInfo.hasAccess ? 'Allowed' : 'Denied'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="p-3 border rounded">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(!!debugInfo.transactions?.length, !!debugInfo.errors?.transactionsError)}
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
              <pre className="text-xs overflow-auto max-h-60 bg-white p-2 rounded border whitespace-pre-wrap">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Details */}
      {debugInfo.errors && Object.values(debugInfo.errors).some(error => error) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Database Query Errors</CardTitle>
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

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle>User Information Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span>User ID:</span>
            <span className="font-mono text-xs">{debugInfo.user?.id || 'Not available'}</span>
            <span>Email:</span>
            <span>{debugInfo.user?.email || 'Not available'}</span>
            <span>Full Name:</span>
            <span>{debugInfo.user?.full_name || 'Not available'}</span>
            <span>Role:</span>
            <span>{debugInfo.user?.role || 'Not available'}</span>
            <span>Target User:</span>
            <span className="font-medium text-blue-600">Mbrown@tfin.com</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
