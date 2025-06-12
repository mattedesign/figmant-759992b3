
import { User, Settings, LogOut, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const UserMenu = () => {
  const { user, profile, subscription, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getSubscriptionBadge = () => {
    if (profile?.role === 'owner') {
      return <Badge variant="default" className="ml-2">Owner</Badge>;
    }
    
    if (subscription?.status === 'active') {
      return <Badge variant="default" className="ml-2">Pro</Badge>;
    }
    
    return <Badge variant="secondary" className="ml-2">Free</Badge>;
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-accent p-2 rounded-md transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium flex items-center">
              {profile?.full_name || user?.email?.split('@')[0] || 'User'}
              {getSubscriptionBadge()}
            </div>
            <div className="text-xs text-muted-foreground">
              {user?.email}
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
          <User className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/subscription')}>
          <CreditCard className="mr-2 h-4 w-4" />
          Subscription
        </DropdownMenuItem>

        {profile?.role === 'owner' && (
          <DropdownMenuItem onClick={() => navigate('/owner')}>
            <Shield className="mr-2 h-4 w-4" />
            Owner Dashboard
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
