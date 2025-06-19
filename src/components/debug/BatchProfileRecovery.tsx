
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Wrench, Users, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export const BatchProfileRecovery = () => {
  const { isOwner } = useAuth();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);

  const scanForMissingProfiles = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.rpc('find_users_without_profiles');
      
      if (error) {
        console.error('Scan error:', error);
        toast({
          variant: "destructive",
          title: "Scan Failed",
          description: error.message,
        });
        return;
      }

      setScanResults(data);
      console.log('Scan results:', data);
      
      if (data && data.length > 0) {
        toast({
          title: "Issues Found",
          description: `Found ${data.length} users with missing profiles`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "All Good!",
          description: "No users found with missing profiles",
        });
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: "Failed to scan for missing profiles",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const fixAllMissingProfiles = async () => {
    if (!scanResults || scanResults.length === 0) return;

    setIsFixing(true);
    let fixed = 0;
    let errors = 0;

    try {
      for (const user of scanResults) {
        try {
          const { error } = await supabase.rpc('create_user_manual', {
            p_email: user.email,
            p_full_name: user.email.split('@')[0],
            p_role: 'subscriber'
          });

          if (error) {
            console.error(`Failed to fix profile for ${user.email}:`, error);
            errors++;
          } else {
            console.log(`✅ Fixed profile for ${user.email}`);
            fixed++;
          }
        } catch (error) {
          console.error(`Error fixing ${user.email}:`, error);
          errors++;
        }
      }

      toast({
        title: "Batch Fix Complete",
        description: `Fixed ${fixed} profiles. ${errors > 0 ? `${errors} errors occurred.` : ''}`,
      });

      // Re-scan to show updated results
      setTimeout(scanForMissingProfiles, 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Batch Fix Failed",
        description: "Failed to complete batch profile recovery",
      });
    } finally {
      setIsFixing(false);
    }
  };

  if (!isOwner) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Batch Profile Recovery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={scanForMissingProfiles}
            disabled={isScanning}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan for Missing Profiles'}
          </Button>

          {scanResults && scanResults.length > 0 && (
            <Button 
              onClick={fixAllMissingProfiles}
              disabled={isFixing}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Wrench className="h-4 w-4 mr-2" />
              {isFixing ? 'Fixing...' : `Fix All ${scanResults.length} Issues`}
            </Button>
          )}
        </div>

        {scanResults && (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {scanResults.length === 0 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              )}
              <strong>
                {scanResults.length === 0 
                  ? 'No Issues Found' 
                  : `${scanResults.length} Users Missing Profiles`
                }
              </strong>
            </div>
            
            {scanResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  The following users exist in auth.users but are missing profile records:
                </p>
                <div className="flex flex-wrap gap-1">
                  {scanResults.slice(0, 10).map((user: any, index: number) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {user.email}
                    </Badge>
                  ))}
                  {scanResults.length > 10 && (
                    <Badge variant="outline" className="text-xs">
                      +{scanResults.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
