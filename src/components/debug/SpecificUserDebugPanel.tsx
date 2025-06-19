
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSpecificUserDebug, useFixMissingProfile } from '@/hooks/useSpecificUserDebug';
import { Search, User, AlertTriangle, Wrench } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const SpecificUserDebugPanel = () => {
  const { isOwner } = useAuth();
  const { toast } = useToast();
  const [searchEmail, setSearchEmail] = useState('say1534@gmail.com');
  const [activeSearch, setActiveSearch] = useState('');
  const [isFixing, setIsFixing] = useState(false);

  const { data: debugData, isLoading, refetch } = useSpecificUserDebug(activeSearch);
  const { fixMissingProfile } = useFixMissingProfile();

  const handleSearch = () => {
    setActiveSearch(searchEmail);
    refetch();
  };

  const handleQuickSearch = (email: string) => {
    setSearchEmail(email);
    setActiveSearch(email);
    refetch();
  };

  const handleFixMissingProfile = async () => {
    if (!activeSearch) return;
    
    setIsFixing(true);
    try {
      const result = await fixMissingProfile(activeSearch);
      
      if (result.success) {
        toast({
          title: "Profile Fixed",
          description: `Successfully created missing profile for ${activeSearch}`,
        });
        // Refresh the search to show the fixed profile
        setTimeout(() => {
          refetch();
        }, 1000);
      } else {
        toast({
          variant: "destructive",
          title: "Fix Failed",
          description: result.error || "Failed to create missing profile",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fix Failed",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsFixing(false);
    }
  };

  if (!isOwner) {
    return null;
  }

  // Check if user is missing from profiles table
  const userNotFound = debugData && !debugData.error && 
    (!debugData.exactMatch || debugData.exactMatch.length === 0) &&
    (!debugData.caseInsensitiveMatch || debugData.caseInsensitiveMatch.length === 0);

  console.log('🔍 Debug panel state:', {
    hasDebugData: !!debugData,
    hasError: !!debugData?.error,
    exactMatchLength: debugData?.exactMatch?.length || 0,
    caseInsensitiveMatchLength: debugData?.caseInsensitiveMatch?.length || 0,
    userNotFound,
    activeSearch
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Specific User Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Search Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickSearch('say1534@gmail.com')}
          >
            Search say1534@gmail.com
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickSearch('stephyoungdesign@gmail.com')}
          >
            Search stephyoungdesign@gmail.com
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickSearch('hbro13@yahoo.com')}
          >
            Search hbro13@yahoo.com
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email to search for..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-4">Searching for user...</div>
        )}

        {debugData && (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Search Results for: {debugData.searchEmail}
              </h3>
              
              {debugData.error ? (
                <div className="text-destructive">
                  <AlertTriangle className="h-4 w-4 inline mr-2" />
                  Error: {debugData.error}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <strong>Exact Match:</strong>
                    {debugData.exactMatch?.length > 0 ? (
                      <div className="ml-4 text-green-600">
                        ✓ Found: {debugData.exactMatch[0].email} (ID: {debugData.exactMatch[0].id})
                      </div>
                    ) : (
                      <div className="ml-4 text-red-600">✗ No exact match found</div>
                    )}
                  </div>

                  <div>
                    <strong>Case-Insensitive Match:</strong>
                    {debugData.caseInsensitiveMatch?.length > 0 ? (
                      <div className="ml-4 text-green-600">
                        ✓ Found: {debugData.caseInsensitiveMatch[0].email}
                      </div>
                    ) : (
                      <div className="ml-4 text-red-600">✗ No case-insensitive match found</div>
                    )}
                  </div>

                  <div>
                    <strong>Auth.Users Check:</strong>
                    {debugData.authUsersError ? (
                      <div className="ml-4 text-orange-600">⚠ {debugData.authUsersError}</div>
                    ) : debugData.authUserExists ? (
                      <div className="ml-4 text-green-600">✓ Found in auth.users table</div>
                    ) : (
                      <div className="ml-4 text-red-600">✗ Not found in auth.users table</div>
                    )}
                  </div>

                  {/* Show Issue #4 Detection and Fix Button */}
                  {userNotFound && activeSearch && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <strong className="text-yellow-800">Issue #4 Detected: Database Trigger Failure</strong>
                      </div>
                      <p className="text-yellow-700 mb-3">
                        This user appears to be missing from the profiles table. This typically happens when the 
                        database trigger that creates user profiles fails during registration.
                      </p>
                      <Button 
                        onClick={handleFixMissingProfile}
                        disabled={isFixing}
                        className="bg-yellow-600 hover:bg-yellow-700"
                        size="sm"
                      >
                        <Wrench className="h-4 w-4 mr-2" />
                        {isFixing ? 'Fixing...' : 'Fix Missing Profile'}
                      </Button>
                    </div>
                  )}

                  {debugData.similarEmails && debugData.similarEmails.length > 0 && (
                    <div>
                      <strong>Similar Emails Found:</strong>
                      <div className="ml-4 space-y-1">
                        {debugData.similarEmails.map((profile) => (
                          <div key={profile.id} className="text-sm">
                            • {profile.email} (Created: {new Date(profile.created_at).toLocaleString()})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {debugData.recentProfiles && (
                    <div>
                      <strong>Recent Registrations (Last 20):</strong>
                      <div className="ml-4 space-y-1 max-h-40 overflow-y-auto">
                        {debugData.recentProfiles.map((profile) => (
                          <div key={profile.id} className="text-xs">
                            • {profile.email} - {new Date(profile.created_at).toLocaleString()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
