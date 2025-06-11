
import React from 'react';
import { UserManagementProfile, UserCreditsData } from '@/types/userManagement';
import { CreateUserDialog } from '../CreateUserDialog';
import { EditUserDialog } from '../EditUserDialog';
import { CreditManagementDialog } from '../CreditManagementDialog';

interface UserManagementDialogsProps {
  createUserDialogOpen: boolean;
  setCreateUserDialogOpen: (open: boolean) => void;
  editUserDialogOpen: boolean;
  setEditUserDialogOpen: (open: boolean) => void;
  creditManagementDialogOpen: boolean;
  setCreditManagementDialogOpen: (open: boolean) => void;
  selectedUser: UserManagementProfile | null;
  creditsMap?: Map<string, UserCreditsData>;
  activeTab: string;
  onUserCreated: () => void;
  onUserUpdated: () => void;
  onCreditsUpdated: () => void;
}

export const UserManagementDialogs: React.FC<UserManagementDialogsProps> = ({
  createUserDialogOpen,
  setCreateUserDialogOpen,
  editUserDialogOpen,
  setEditUserDialogOpen,
  creditManagementDialogOpen,
  setCreditManagementDialogOpen,
  selectedUser,
  creditsMap,
  activeTab,
  onUserCreated,
  onUserUpdated,
  onCreditsUpdated
}) => {
  return (
    <>
      <CreateUserDialog
        open={createUserDialogOpen}
        onOpenChange={setCreateUserDialogOpen}
        onUserCreated={onUserCreated}
        defaultRole={activeTab === 'owners' ? 'owner' : 'subscriber'}
      />

      <EditUserDialog
        open={editUserDialogOpen}
        onOpenChange={setEditUserDialogOpen}
        user={selectedUser}
        onUserUpdated={onUserUpdated}
      />

      <CreditManagementDialog
        open={creditManagementDialogOpen}
        onOpenChange={setCreditManagementDialogOpen}
        user={selectedUser}
        credits={selectedUser ? creditsMap?.get(selectedUser.id) || null : null}
        onCreditsUpdated={onCreditsUpdated}
      />
    </>
  );
};
