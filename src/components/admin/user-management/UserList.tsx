
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { UserManagementProfile } from '@/types/userManagement';

interface UserListProps {
  users: UserManagementProfile[];
  isLoading: boolean;
  selectedUser: UserManagementProfile | null;
  onSelectUser: (user: UserManagementProfile) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  isLoading,
  selectedUser,
  onSelectUser
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'subscriber': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionStatus = (user: UserManagementProfile) => {
    if (!user.subscriptions || user.subscriptions.length === 0) {
      return { status: 'none', color: 'bg-gray-100 text-gray-800' };
    }
    
    const subscription = user.subscriptions[0];
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      canceled: 'bg-yellow-100 text-yellow-800',
      trialing: 'bg-blue-100 text-blue-800'
    };
    
    return {
      status: subscription.status,
      color: colors[subscription.status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Users
          </div>
          <Badge variant="outline">{users.length} total</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-2">
            {users.map((user) => {
              const subscriptionInfo = getSubscriptionStatus(user);
              
              return (
                <div
                  key={user.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedUser?.id === user.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => onSelectUser(user)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium truncate">
                          {user.full_name || 'No name'}
                        </h3>
                        <Badge className={getRoleColor(user.role)} variant="secondary">
                          {user.role}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={subscriptionInfo.color} variant="secondary">
                        {subscriptionInfo.status === 'none' ? 'No subscription' : subscriptionInfo.status}
                      </Badge>
                      
                      {user.role === 'owner' && (
                        <Shield className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found matching your criteria</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
