
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface UserManagementHeaderProps {
  onCreateUser: () => void;
  isLoading?: boolean;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  onCreateUser,
  isLoading
}) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage users, their roles, subscriptions, and credits
          </CardDescription>
        </div>
        {!isLoading && (
          <Button onClick={onCreateUser}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        )}
      </div>
    </CardHeader>
  );
};
