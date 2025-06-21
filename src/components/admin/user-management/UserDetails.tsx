
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Calendar, 
  CreditCard, 
  Activity, 
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { UserManagementProfile } from '@/types/userManagement';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserDetailsProps {
  user: UserManagementProfile | null;
  onRefresh: () => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user, onRefresh }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a user to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleRoleChange = async (newRole: string) => {
    if (user.role === 'owner' && newRole !== 'owner') {
      toast({
        variant: "destructive",
        title: "Cannot modify owner role",
        description: "Owner role cannot be changed through this interface."
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Role updated",
        description: `User role changed to ${newRole}`
      });
      
      onRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating role",
        description: "Failed to update user role"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subscription = user.subscriptions?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{user.full_name || 'No name set'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{user.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <Badge variant={user.role === 'owner' ? 'destructive' : 'default'}>
                  {user.role}
                </Badge>
              </div>
            </div>

            {user.role !== 'owner' && (
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Admin Actions</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRoleChange('admin')}
                    disabled={isLoading || user.role === 'admin'}
                    className="w-full"
                  >
                    {user.role === 'admin' ? 'Already Admin' : 'Make Admin'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRoleChange('subscriber')}
                    disabled={isLoading || user.role === 'subscriber'}
                    className="w-full"
                  >
                    {user.role === 'subscriber' ? 'Already Subscriber' : 'Make Subscriber'}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4">
            {subscription ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Subscription Status</span>
                </div>
                
                <Badge 
                  variant={subscription.status === 'active' ? 'default' : 'secondary'}
                  className={
                    subscription.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {subscription.status}
                </Badge>
                
                {subscription.current_period_end && (
                  <div className="text-sm text-gray-600">
                    <span>Expires: </span>
                    <span>{new Date(subscription.current_period_end).toLocaleDateString()}</span>
                  </div>
                )}
                
                {subscription.stripe_customer_id && (
                  <div className="text-sm text-gray-600">
                    <span>Stripe ID: </span>
                    <span className="font-mono text-xs">{subscription.stripe_customer_id}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No subscription found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="text-center py-4 text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Activity tracking coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
