
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, Shield, Crown, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileHeaderProps {
  user: any;
  profile: any;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, profile }) => {
  const isMobile = useIsMobile();
  const isOwner = profile?.role === 'owner';

  const getRoleBadge = () => {
    if (isOwner) {
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
          <Crown className="h-3 w-3 mr-1" />
          Owner
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Shield className="h-3 w-3 mr-1" />
        Subscriber
      </Badge>
    );
  };

  if (isMobile) {
    return (
      <Card className="mx-4 mt-6 mb-4">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-gray-100 text-lg">
                <User className="h-6 w-6 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-gray-900 truncate">
                  {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </h1>
                {getRoleBadge()}
              </div>
              
              <p className="text-sm text-gray-600 truncate">
                {user?.email}
              </p>
              
              <div className="flex items-center gap-1 mt-2">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  Joined {new Date(user?.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-gray-100 text-xl">
              <User className="h-8 w-8 text-gray-500" />
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
              </h1>
              {getRoleBadge()}
            </div>
            
            <p className="text-gray-600 mb-1">
              {user?.email}
            </p>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                Member since {new Date(user?.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Quick Settings
        </Button>
      </div>
    </div>
  );
};
