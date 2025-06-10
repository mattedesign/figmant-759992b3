
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Crown, Settings, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserMenu = () => {
  const { profile, signOut, isOwner, hasActiveSubscription } = useAuth();
  const navigate = useNavigate();

  if (!profile) return null;

  const handleDashboardClick = () => {
    if (isOwner) {
      navigate('/owner-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile.email}
            </p>
            <div className="flex items-center space-x-1 pt-1">
              {isOwner ? (
                <Badge variant="default" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Owner
                </Badge>
              ) : (
                <Badge variant={hasActiveSubscription ? "default" : "secondary"} className="text-xs">
                  {hasActiveSubscription ? 'Active' : 'Inactive'}
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDashboardClick}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>{isOwner ? 'Owner Dashboard' : 'Dashboard'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        {!isOwner && (
          <DropdownMenuItem>
            <span>Subscription</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
