
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSpecificUserDebug } from '@/hooks/useSpecificUserDebug';
import { Search, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const SpecificUserDebugPanel = () => {
  const { isOwner } = useAuth();
  const [searchEmail, setSearchEmail] = useState('hbro13@yahoo.com');
  const [activeSearch, setActiveSearch] = useState('');

  const { data: debugData, isLoading, refetch } = useSpecificUserDebug(activeSearch);

  const handleSearch = () => {
    setActiveSearch(searchEmail);
    refetch();
  };

  if (!isOwner) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Specific User Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
