
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Shield, 
  CreditCard, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Search,
  Eye
} from 'lucide-react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { supabase } from '@/integrations/supabase/client';

interface UserAccessAnalyzerProps {
  isDebugActive: boolean;
}

interface UserDebugData {
  id: string;
  email: string;
  role: string;
  authStatus: 'authenticated' | 'unauthenticated' | 'expired';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'expired' | 'free';
  credits: {
    current: number;
    total: number;
    used: number;
  };
  permissions: string[];
  lastActivity: Date;
  sessionData: any;
}

export const UserAccessAnalyzer: React.FC<UserAccessAnalyzerProps> = ({ 
  isDebugActive 
}) => {
  const { credits } = useUserCredits();
  const [searchEmail, setSearchEmail] = useState('');
  const [debuggedUser, setDebuggedUser] = useState<UserDebugData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeUser = async (email: string) => {
    if (!email || !isDebugActive) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (profileError) {
        setError('User not found');
        return;
      }

      // Fetch subscription data
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', profile.id)
        .single();

      // Fetch credits data
      const { data: userCredits } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', profile.id)
        .single();

      // Fetch recent activity
      const { data: recentActivity } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const userData: UserDebugData = {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        authStatus: 'authenticated', // Simplified for demo
        subscriptionStatus: (subscription?.status as UserDebugData['subscriptionStatus']) || 'free',
        credits: {
          current: userCredits?.current_balance || 0,
          total: userCredits?.total_purchased || 0,
          used: userCredits?.total_used || 0
        },
        permissions: profile.role === 'owner' ? ['admin', 'read', 'write'] : ['read'],
        lastActivity: recentActivity?.[0]?.created_at ? new Date(recentActivity[0].created_at) : new Date(),
        sessionData: {
          browser: 'Chrome 91.0',
          ip: '192.168.1.1',
          location: 'San Francisco, CA'
        }
      };

      setDebuggedUser(userData);
    } catch (err) {
      setError('Failed to analyze user');
      console.error('User analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'authenticated':
      case 'active':
        return 'text-green-600';
      case 'inactive':
      case 'unauthenticated':
      case 'free':
        return 'text-yellow-600';
      case 'expired':
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authenticated':
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'inactive':
      case 'unauthenticated':
      case 'free':
        return <AlertTriangle className="h-4 w-4" />;
      case 'expired':
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Access Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter user email to analyze..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={() => analyzeUser(searchEmail)}
              disabled={!isDebugActive || loading}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
          
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
          
          {!isDebugActive && (
            <p className="text-sm text-muted-foreground mt-2">
              Start a debug session to analyze users
            </p>
          )}
        </CardContent>
      </Card>

      {/* User Analysis Results */}
      {debuggedUser && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Authentication Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auth Status</span>
                <div className={`flex items-center gap-1 ${getStatusColor(debuggedUser.authStatus)}`}>
                  {getStatusIcon(debuggedUser.authStatus)}
                  <Badge variant="outline" className="capitalize">
                    {debuggedUser.authStatus}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">User Role</span>
                <Badge variant="secondary" className="capitalize">
                  {debuggedUser.role}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Permissions</span>
                <div className="flex gap-1">
                  {debuggedUser.permissions.map((perm) => (
                    <Badge key={perm} variant="outline" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Activity</span>
                <span className="text-sm text-muted-foreground">
                  {debuggedUser.lastActivity.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Credits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription & Credits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Subscription</span>
                <div className={`flex items-center gap-1 ${getStatusColor(debuggedUser.subscriptionStatus)}`}>
                  {getStatusIcon(debuggedUser.subscriptionStatus)}
                  <Badge variant="outline" className="capitalize">
                    {debuggedUser.subscriptionStatus}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Credits</span>
                  <span className="font-medium">{debuggedUser.credits.current}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Purchased</span>
                  <span className="text-muted-foreground">{debuggedUser.credits.total}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Used</span>
                  <span className="text-muted-foreground">{debuggedUser.credits.used}</span>
                </div>
              </div>

              {/* Credit Usage Visualization */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Credit Usage</span>
                  <span>{debuggedUser.credits.used}/{debuggedUser.credits.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full"
                    style={{ 
                      width: `${(debuggedUser.credits.used / debuggedUser.credits.total) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Session Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Browser</p>
                  <p className="font-medium">{debuggedUser.sessionData.browser}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IP Address</p>
                  <p className="font-medium">{debuggedUser.sessionData.ip}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{debuggedUser.sessionData.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
