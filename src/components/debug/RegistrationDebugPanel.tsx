
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Users, Database, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const RegistrationDebugPanel = () => {
  const { isOwner } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: debugData, isLoading, refetch } = useQuery({
    queryKey: ['registration-debug', refreshKey],
    queryFn: async () => {
      console.log('Running registration debug checks...');

      // Check auth.users (requires admin access)
      let authUsersCount = 0;
      let authUsersError = null;
      try {
        const { data: authUsers, error } = await supabase.auth.admin.listUsers();
        authUsersCount = authUsers?.users?.length || 0;
        authUsersError = error;
      } catch (error) {
        authUsersError = error;
      }

      // Check profiles table
      const { data: profiles, error: profilesError, count: profilesCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Check subscriptions table
      const { data: subscriptions, error: subscriptionsError, count: subscriptionsCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact' });

      // Check user_credits table
      const { data: userCredits, error: userCreditsError, count: userCreditsCount } = await supabase
        .from('user_credits')
        .select('*', { count: 'exact' });

      // Get recent profiles (last 24 hours)
      const { data: recentProfiles, error: recentProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      return {
        authUsers: { count: authUsersCount, error: authUsersError },
        profiles: { count: profilesCount, error: profilesError, data: profiles },
        subscriptions: { count: subscriptionsCount, error: subscriptionsError },
        userCredits: { count: userCreditsCount, error: userCreditsError },
        recentProfiles: { data: recentProfiles, error: recentProfilesError },
      };
    },
    enabled: isOwner,
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  if (!isOwner) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Registration Debug Panel
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Loading debug information...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Auth Users
                </h3>
                <p className="text-sm text-muted-foreground">
                  Total: {debugData?.authUsers.count || 0}
                </p>
                {debugData?.authUsers.error && (
                  <p className="text-xs text-destructive mt-1">
                    Error: {debugData.authUsers.error.message}
                  </p>
                )}
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Profiles</h3>
                <p className="text-sm text-muted-foreground">
                  Total: {debugData?.profiles.count || 0}
                </p>
                {debugData?.profiles.error && (
                  <p className="text-xs text-destructive mt-1">
                    Error: {debugData.profiles.error.message}
                  </p>
                )}
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Subscriptions</h3>
                <p className="text-sm text-muted-foreground">
                  Total: {debugData?.subscriptions.count || 0}
                </p>
                {debugData?.subscriptions.error && (
                  <p className="text-xs text-destructive mt-1">
                    Error: {debugData.subscriptions.error.message}
                  </p>
                )}
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">User Credits</h3>
                <p className="text-sm text-muted-foreground">
                  Total: {debugData?.userCredits.count || 0}
                </p>
                {debugData?.userCredits.error && (
                  <p className="text-xs text-destructive mt-1">
                    Error: {debugData.userCredits.error.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Data Consistency Check
                </h3>
                <div className="text-sm space-y-1 mt-2">
                  <p>
                    Auth vs Profiles: 
                    {debugData?.authUsers.count === debugData?.profiles.count ? (
                      <span className="text-green-600 ml-1">✓ Match</span>
                    ) : (
                      <span className="text-red-600 ml-1">✗ Mismatch</span>
                    )}
                  </p>
                  <p>
                    Profiles vs Subscriptions: 
                    {debugData?.profiles.count === debugData?.subscriptions.count ? (
                      <span className="text-green-600 ml-1">✓ Match</span>
                    ) : (
                      <span className="text-red-600 ml-1">✗ Mismatch</span>
                    )}
                  </p>
                  <p>
                    Profiles vs Credits: 
                    {debugData?.profiles.count === debugData?.userCredits.count ? (
                      <span className="text-green-600 ml-1">✓ Match</span>
                    ) : (
                      <span className="text-red-600 ml-1">✗ Mismatch</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Recent Registrations (24h)</h3>
                {debugData?.recentProfiles.error ? (
                  <p className="text-xs text-destructive mt-1">
                    Error: {debugData.recentProfiles.error.message}
                  </p>
                ) : (
                  <div className="text-sm space-y-2 mt-2">
                    {debugData?.recentProfiles.data?.length === 0 ? (
                      <p className="text-muted-foreground">No recent registrations</p>
                    ) : (
                      debugData?.recentProfiles.data?.map((profile) => (
                        <div key={profile.id} className="p-2 bg-muted rounded text-xs">
                          <p className="font-medium">{profile.email}</p>
                          <p className="text-muted-foreground">
                            {profile.full_name || 'No name'} - {profile.role}
                          </p>
                          <p className="text-muted-foreground">
                            {new Date(profile.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
