
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Crown } from 'lucide-react';

interface SidebarUserProfileProps {
  isOwner: boolean;
  profile: any;
  user: any;
  subscription: any;
  signOut: () => void;
  isCollapsed?: boolean;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  isOwner,
  profile,
  user,
  subscription,
  signOut,
  isCollapsed = false
}) => {
  if (isCollapsed) {
    return (
      <TooltipProvider>
        <div className="p-4 border-t border-gray-200/30">
          <div className="flex flex-col items-center space-y-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-900 text-white">
                <div>
                  <div className="font-medium">{profile?.full_name || 'User'}</div>
                  <div className="text-sm opacity-75">{user?.email}</div>
                </div>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-900 text-white">
                Sign out
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200/30">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback className="bg-blue-100 text-blue-600">
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {profile?.full_name || 'User'}
            </p>
            {isOwner && (
              <Crown className="h-4 w-4 text-yellow-500" />
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="mb-4">
        {isOwner ? (
          <Badge className="w-full justify-center bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            Owner
          </Badge>
        ) : subscription?.status === 'active' ? (
          <Badge className="w-full justify-center bg-green-100 text-green-800">
            Pro Member
          </Badge>
        ) : (
          <Badge variant="outline" className="w-full justify-center">
            Free Plan
          </Badge>
        )}
      </div>

      {/* Sign Out Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={signOut}
        className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign out
      </Button>
    </div>
  );
};
