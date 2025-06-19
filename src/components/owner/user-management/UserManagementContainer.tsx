import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useUserManagementCredits } from '@/hooks/useUserManagementCredits';
import { UserManagementProfile } from '@/types/userManagement';
import { UserManagementHeader } from './UserManagementHeader';
import { UserManagementContent } from './UserManagementContent';
import { UserManagementDialogs } from './UserManagementDialogs';

export const UserManagementContainer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<UserManagementProfile | null>(null);
  const [activeTab, setActiveTab] = useState('subscribers');
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [creditManagementDialogOpen, setCreditManagementDialogOpen] = useState(false);

  const { data: users, isLoading, refetch, error } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      console.log('Fetching all registered users...');
      
      // First, let's check what users exist in auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      console.log('Auth users:', authUsers?.users?.length, authError);
      
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
      
      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
      
      console.log('All registered users fetched:', data?.length);
      console.log('Profile data sample:', data?.slice(0, 2));
      
      // Transform the data to match the UserManagementProfile type
      const transformedData = data.map(profile => ({
        ...profile,
        subscriptions: profile.subscriptions ? [profile.subscriptions] : []
      })) as UserManagementProfile[];
      
      return transformedData;
    },
    refetchInterval: 30000, // Refetch every 30 seconds to catch new users
    refetchOnWindowFocus: true,
  });

  // Add effect to log when users data changes
  useEffect(() => {
    if (users) {
      console.log(`User management: ${users.length} total registered users loaded`);
      console.log('Users by role:', {
        owners: users.filter(u => u.role === 'owner').length,
        subscribers: users.filter(u => u.role === 'subscriber').length
      });
    }
    if (error) {
      console.error('User management error:', error);
    }
  }, [users, error]);

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
      console.error('Error updating user role:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role",
      });
    }
  };

  const handleUserCreated = () => {
    console.log('User created, refetching user list...');
    refetch();
    setCreateUserDialogOpen(false);
    toast({
      title: "User Created",
      description: "New user has been created successfully",
    });
  };

  const handleUserUpdated = () => {
    console.log('User updated, refetching user list...');
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
        <UserManagementHeader 
          onCreateUser={() => setCreateUserDialogOpen(true)}
          isLoading={true}
        />
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

  if (error) {
    return (
      <Card>
        <UserManagementHeader onCreateUser={() => setCreateUserDialogOpen(true)} />
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">Error loading users: {error.message}</p>
            <button 
              onClick={() => refetch()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ownerUsers = users?.filter(user => user.role === 'owner') || [];
  const subscriberUsers = users?.filter(user => user.role === 'subscriber') || [];

  return (
    <Card>
      <UserManagementHeader onCreateUser={() => setCreateUserDialogOpen(true)} />
      <UserManagementContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ownerUsers={ownerUsers}
        subscriberUsers={subscriberUsers}
        creditsMap={creditsMap}
        onEditUser={handleEditUser}
        onManageCredits={handleManageCredits}
        onUpdateUserRole={updateUserRole}
      />
      <UserManagementDialogs
        createUserDialogOpen={createUserDialogOpen}
        setCreateUserDialogOpen={setCreateUserDialogOpen}
        editUserDialogOpen={editUserDialogOpen}
        setEditUserDialogOpen={setEditUserDialogOpen}
        creditManagementDialogOpen={creditManagementDialogOpen}
        setCreditManagementDialogOpen={setCreditManagementDialogOpen}
        selectedUser={selectedUser}
        creditsMap={creditsMap}
        activeTab={activeTab}
        onUserCreated={handleUserCreated}
        onUserUpdated={handleUserUpdated}
        onCreditsUpdated={handleCreditsUpdated}
      />
    </Card>
  );
};
