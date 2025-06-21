import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, Settings, Shield, CreditCard, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserList } from './user-management/UserList';
import { UserDetails } from './user-management/UserDetails';
import { UserFilters } from './user-management/UserFilters';
import { UserStats } from './user-management/UserStats';
import { UserManagementProfile } from '@/types/userManagement';

type ValidSubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'expired';

export const UserManagement: React.FC = () => {
  const { isOwner } = useAuth();
  const [selectedUser, setSelectedUser] = useState<UserManagementProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', searchTerm, roleFilter, statusFilter],
    queryFn: async () => {
      console.log('🔍 Fetching users for admin management...');
      
      let query = supabase
        .from('profiles')
        .select(`
          *,
          subscriptions!inner(
            status,
            current_period_end,
            stripe_customer_id
          )
        `)
        .order('created_at', { ascending: false });

      // Apply search filter
      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
      }

      // Apply role filter - only filter if it's a valid role
      if (roleFilter !== 'all' && (roleFilter === 'owner' || roleFilter === 'subscriber')) {
        query = query.eq('role', roleFilter);
      }

      // Apply status filter for subscriptions - only filter if it's a valid status
      const validStatuses: ValidSubscriptionStatus[] = ['active', 'inactive', 'cancelled', 'expired'];
      if (statusFilter !== 'all' && validStatuses.includes(statusFilter as ValidSubscriptionStatus)) {
        query = query.eq('subscriptions.status', statusFilter as ValidSubscriptionStatus);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      // Transform the data to match UserManagementProfile type
      const transformedData: UserManagementProfile[] = (data || []).map(user => ({
        ...user,
        subscriptions: user.subscriptions ? [user.subscriptions] : []
      }));

      console.log('✅ Users fetched:', transformedData?.length || 0);
      return transformedData;
    },
    enabled: isOwner,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: userStats } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_analytics_summary', { days_back: 30 });
      if (error) throw error;
      return data[0];
    },
    enabled: isOwner,
  });

  if (!isOwner) {
    return (
      <div className="p-6 text-center">
        <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">You don't have permission to access user management.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, subscriptions, and access permissions
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* User Statistics */}
      <UserStats stats={userStats} />

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User List and Filters */}
            <div className="lg:col-span-2 space-y-4">
              <UserFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
              
              <UserList
                users={users || []}
                isLoading={isLoading}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
              />
            </div>

            {/* User Details */}
            <div className="lg:col-span-1">
              <UserDetails
                user={selectedUser}
                onRefresh={refetch}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Subscription management features will be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                User activity monitoring will be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
