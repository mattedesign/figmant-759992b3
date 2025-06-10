
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Crown, Mail, Calendar, Settings } from 'lucide-react';
import { format } from 'date-fns';

export const UserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          subscriptions (
            status,
            current_period_end,
            stripe_customer_id
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const logUserAction = async (targetUserId: string, action: string, details: any = {}) => {
    try {
      await supabase
        .from('user_management_logs')
        .insert({
          admin_user_id: user?.id,
          target_user_id: targetUserId,
          action,
          details
        });
    } catch (error) {
      console.error('Failed to log user action:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'owner' | 'subscriber') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      await logUserAction(userId, 'role_change', { new_role: newRole });
      
      toast({
        title: "Role Updated",
        description: `User role has been updated to ${newRole}`,
      });
      
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Loading users...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage users and their subscriptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{user.full_name || 'Unnamed User'}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>
                    {user.role === 'owner' && <Crown className="h-3 w-3 mr-1" />}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.subscriptions?.[0]?.status === 'active' ? 'default' : 'outline'}>
                    {user.subscriptions?.[0]?.status || 'inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'Unknown'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {user.role === 'subscriber' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateUserRole(user.id, 'owner')}
                      >
                        Make Owner
                      </Button>
                    )}
                    {user.role === 'owner' && user.id !== user?.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateUserRole(user.id, 'subscriber')}
                      >
                        Remove Owner
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
