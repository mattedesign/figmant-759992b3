
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagementProfile, UserCreditsData } from '@/types/userManagement';
import { UserTable } from '../UserTable';

interface UserManagementContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ownerUsers: UserManagementProfile[];
  subscriberUsers: UserManagementProfile[];
  creditsMap?: Map<string, UserCreditsData>;
  onEditUser: (user: UserManagementProfile) => void;
  onManageCredits: (user: UserManagementProfile) => void;
  onUpdateUserRole: (userId: string, newRole: 'owner' | 'subscriber') => void;
}

export const UserManagementContent: React.FC<UserManagementContentProps> = ({
  activeTab,
  setActiveTab,
  ownerUsers,
  subscriberUsers,
  creditsMap,
  onEditUser,
  onManageCredits,
  onUpdateUserRole
}) => {
  return (
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
            onEditUser={onEditUser}
            onManageCredits={onManageCredits}
            onUpdateUserRole={onUpdateUserRole}
          />
        </TabsContent>

        <TabsContent value="owners" className="mt-6">
          <UserTable
            userList={ownerUsers}
            userType="owner"
            creditsMap={creditsMap}
            onEditUser={onEditUser}
            onManageCredits={onManageCredits}
            onUpdateUserRole={onUpdateUserRole}
          />
        </TabsContent>
      </Tabs>
    </CardContent>
  );
};
