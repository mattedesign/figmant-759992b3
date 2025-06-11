
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Crown, Mail, Calendar, Settings, UserPlus, Coins, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { CreateUserDialog } from './CreateUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { CreditManagementDialog } from './CreditManagementDialog';
import { useUserManagementCredits } from '@/hooks/useUserManagementCredits';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'owner' | 'subscriber';
  created_at: string;
  subscriptions?: Array<{
    status: string;
    current_period_end: string | null;
    stripe_customer_id: string | null;
  }>;
}

export const UserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
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
      return data as UserProfile[];
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

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setEditUserDialogOpen(true);
  };

  const handleManageCredits = (user: UserProfile) => {
    setSelectedUser(user);
    setCreditManagementDialogOpen(true);
  };

  const getUserActivityStatus = (user: UserProfile) => {
    const subscription = user.subscriptions?.[0];
    const credits = creditsMap?.get(user.id);
    
    if (user.role === 'owner') return 'Active (Owner)';
    if (subscription?.status === 'active') return 'Active (Subscribed)';
    if (credits && credits.current_balance > 0) return `Active (${credits.current_balance} credits)`;
    return 'Inactive';
  };

  const getActivityStatusBadge = (user: UserProfile) => {
    const status = getUserActivityStatus(user);
    const isActive = status.startsWith('Active');
    
    return (
      <Badge variant={isActive ? 'default' : 'outline'}>
        {status}
      </Badge>
    );
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

  const renderUserTable = (userList: UserProfile[], userType: 'owner' | 'subscriber') => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Credits</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userList?.map((userProfile) => {
          const credits = creditsMap?.get(userProfile.id);
          return (
            <TableRow key={userProfile.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{userProfile.full_name || 'Unnamed User'}</div>
                    <div className="text-sm text-muted-foreground">{userProfile.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={userProfile.role === 'owner' ? 'default' : 'secondary'}>
                  {userProfile.role === 'owner' && <Crown className="h-3 w-3 mr-1" />}
                  {userProfile.role}
                </Badge>
              </TableCell>
              <TableCell>
                {getActivityStatusBadge(userProfile)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Coins className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {credits?.current_balance || 0}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {userProfile.created_at ? format(new Date(userProfile.created_at), 'MMM dd, yyyy') : 'Unknown'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditUser(userProfile)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleManageCredits(userProfile)}
                  >
                    <Coins className="h-4 w-4 mr-1" />
                    Credits
                  </Button>
                  {userProfile.role === 'subscriber' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateUserRole(userProfile.id, 'owner')}
                    >
                      Make Owner
                    </Button>
                  )}
                  {userProfile.role === 'owner' && userProfile.id !== user?.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateUserRole(userProfile.id, 'subscriber')}
                    >
                      Remove Owner
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
        {userList?.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No {userType === 'owner' ? 'owners' : 'subscribers'} found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

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
            {renderUserTable(subscriberUsers, 'subscriber')}
          </TabsContent>

          <TabsContent value="owners" className="mt-6">
            {renderUserTable(ownerUsers, 'owner')}
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
