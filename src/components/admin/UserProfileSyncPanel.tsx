
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { syncAllAuthUsers } from '@/utils/profileSyncUtils';
import { useToast } from '@/hooks/use-toast';

export const UserProfileSyncPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSyncUsers = async () => {
    setIsLoading(true);
    try {
      const result = await syncAllAuthUsers();
      setLastSyncResult(result);
      
      if (result.success) {
        toast({
          title: "Sync Completed",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sync Failed",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error during sync:', error);
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "An unexpected error occurred during sync",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Profile Sync
        </CardTitle>
        <CardDescription>
          Synchronize authentication users with profile records. This ensures all authenticated users 
          appear in the user management interface.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleSyncUsers}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isLoading ? 'Syncing...' : 'Sync All Users'}
          </Button>
        </div>

        {lastSyncResult && (
          <Alert variant={lastSyncResult.success ? "default" : "destructive"}>
            <div className="flex items-center gap-2">
              {lastSyncResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription>
                {lastSyncResult.message}
                {lastSyncResult.success && lastSyncResult.syncedUsers > 0 && (
                  <span className="block mt-1 text-sm text-muted-foreground">
                    {lastSyncResult.syncedUsers} user(s) were synchronized with profile records.
                  </span>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>What this does:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Finds users who exist in authentication but lack profile records</li>
            <li>Creates missing profile, subscription, and credit records</li>
            <li>Ensures all users appear in the user management interface</li>
            <li>Awards 5 welcome credits to newly synced users</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
