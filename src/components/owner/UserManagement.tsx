
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { CreateUserDialog } from './CreateUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { CreditManagementDialog } from './CreditManagementDialog';
import { useUserManagementCredits } from '@/hooks/useUserManagementCredits';
import { UserManagementProfile } from '@/types/userManagement';
import { UserTable } from './UserTable';

export const UserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<UserManagementProfile | null>(null);
  const [activeTab, setActiveTab] = useState('subscribers');
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [creditManagementDialogOpen, setCreditManagementDialogOpen] = useState(false);

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
      
      // Transform the data to match the UserManagementProfile type
      return data.map(profile => ({
        ...profile,
        subscriptions: profile.subscriptions ? [profile.subscriptions] : []
      })) as UserManagementProfile[];
    }
  });

  const { data: creditsMap, refetch: refetchCredits } = useUserManagementCredits();

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

  const handleUserCreated = () => {
    refetch();
    setCreateUserDialogOpen(false);
    toast({
      title: "User Created",
      description: "New user has been created successfully",
    });
  };

  const handleUserUpdated = () => {
    refetch();
    setEditUserDialogOpen(false);
  };

  const handleCreditsUpdated = () => {
    refetchCredits();
    setCreditManagementDialogOpen(false);
  };

  const handleEditUser = (user: UserManagementProfile) => {
    setSelectedUser(user);
    setEditUserDialogOpen(true);
  };

  const handleManageCredits = (user: UserManagementProfile) => {
    setSelectedUser(user);
    setCreditManagementDialogOpen(true);
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

  const ownerUsers = users?.filter(user => user.role === 'owner') || [];
  const subscriberUsers = users?.filter(user => user.role === 'subscriber') || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage users, their roles, subscriptions, and credits
            </CardDescription>
          </div>
          <Button onClick={() => setCreateUserDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscribers">
              Subscribers ({subscriberUsers.length})
            </TabsTrigger>
            <TabsTrigger value="owners">
              Owners ({ownerUsers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscribers" className="mt-6">
            <UserTable
              userList={subscriberUsers}
              userType="subscriber"
              creditsMap={creditsMap}
              onEditUser={handleEditUser}
              onManageCredits={handleManageCredits}
              onUpdateUserRole={updateUserRole}
            />
          </TabsContent>

          <TabsContent value="owners" className="mt-6">
            <UserTable
              userList={ownerUsers}
              userType="owner"
              creditsMap={creditsMap}
              onEditUser={handleEditUser}
              onManageCredits={handleManageCredits}
              onUpdateUserRole={updateUserRole}
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CreateUserDialog
        open={createUserDialogOpen}
        onOpenChange={setCreateUserDialogOpen}
        onUserCreated={handleUserCreated}
        defaultRole={activeTab === 'owners' ? 'owner' : 'subscriber'}
      />

      <EditUserDialog
        open={editUserDialogOpen}
        onOpenChange={setEditUserDialogOpen}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />

      <CreditManagementDialog
        open={creditManagementDialogOpen}
        onOpenChange={setCreditManagementDialogOpen}
        user={selectedUser}
        credits={selectedUser ? creditsMap?.get(selectedUser.id) || null : null}
        onCreditsUpdated={handleCreditsUpdated}
      />
    </Card>
  );
};
