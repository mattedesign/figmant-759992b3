
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Crown, Mail, Calendar, Coins } from 'lucide-react';
import { format } from 'date-fns';
import { UserManagementProfile, UserCreditsData } from '@/types/userManagement';
import { UserStatusBadge } from './UserStatusBadge';
import { UserActions } from './UserActions';

interface UserTableProps {
  userList: UserManagementProfile[];
  userType: 'owner' | 'subscriber';
  creditsMap: Map<string, UserCreditsData> | undefined;
  onEditUser: (user: UserManagementProfile) => void;
  onManageCredits: (user: UserManagementProfile) => void;
  onUpdateUserRole: (userId: string, newRole: 'owner' | 'subscriber') => void;
}

export const UserTable = ({ 
  userList, 
  userType, 
  creditsMap, 
  onEditUser, 
  onManageCredits, 
  onUpdateUserRole 
}: UserTableProps) => {
  return (
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
                <UserStatusBadge user={userProfile} creditsMap={creditsMap} />
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
                <UserActions
                  user={userProfile}
                  onEditUser={onEditUser}
                  onManageCredits={onManageCredits}
                  onUpdateUserRole={onUpdateUserRole}
                />
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
};
