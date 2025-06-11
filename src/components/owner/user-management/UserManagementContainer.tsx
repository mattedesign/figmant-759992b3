import { useState } from 'react';
import { Card } from '@/components/ui/card';
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
