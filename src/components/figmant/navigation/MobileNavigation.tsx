
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsSmallMobile } from '@/hooks/use-mobile';
import { 
  Menu,
  Home,
  BarChart3, 
  Star, 
  FileText, 
  Settings,
  Search,
  Shield,
  LogOut,
  User,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isOwner, user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isSmallMobile = useIsSmallMobile();

  const mainSections = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'premium-analysis', label: 'Premium Analysis', icon: Star },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  // Add admin section for owners
  if (isOwner) {
    mainSections.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    console.log('MobileNavigation: Initiating sign out...');
    try {
      await signOut();
      console.log('MobileNavigation: Sign out successful, navigating to auth');
      navigate('/auth', { replace: true });
      setIsOpen(false);
    } catch (error) {
      console.error('MobileNavigation: Sign out error:', error);
    }
  };

  const handleProfileNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size={isSmallMobile ? "default" : "sm"} 
          className={isSmallMobile ? "h-10 w-10 p-0" : "h-8 w-8 p-0"}
        >
          <Menu className={isSmallMobile ? "h-5 w-5" : "h-4 w-4"} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 safe-left">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 safe-top">
            <h1 className="text-2xl font-bold text-gray-900">figmant</h1>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {mainSections.map((section) => (
                <Button
                  key={section.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 text-base",
                    activeSection === section.id 
                      ? "bg-white text-[#3D4A5C] rounded-[20px]"
                      : section.id === 'admin' 
                        ? "border border-orange-200 bg-orange-50 text-orange-700 hover:bg-white hover:text-[#3D4A5C] hover:rounded-[20px] hover:border-none"
                        : "hover:bg-white hover:text-[#3D4A5C] hover:rounded-[20px]"
                  )}
                  onClick={() => handleSectionChange(section.id)}
                >
                  <section.icon className={cn(
                    "h-5 w-5 mr-3",
                    activeSection === section.id && "text-[#3D4A5C]"
                  )} />
                  <span className={cn(
                    "flex-1 text-left",
                    activeSection === section.id && "text-[#3D4A5C]"
                  )}>
                    {section.label}
                  </span>
                  {section.id === 'admin' && (
                    <Badge variant="secondary" className={cn(
                      "ml-auto text-xs",
                      activeSection === section.id ? "bg-[#3D4A5C]/10 text-[#3D4A5C]" : "bg-orange-100 text-orange-700"
                    )}>
                      Owner
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* User Profile Section */}
          <div className="border-t border-gray-200 p-4">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-gray-100">
                  <User className="h-5 w-5 text-gray-500" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.email}
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-10 text-sm"
                onClick={() => handleProfileNavigation('/profile')}
              >
                <Settings className="h-4 w-4 mr-3" />
                Profile & Settings
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start h-10 text-sm"
                onClick={() => handleProfileNavigation('/subscription')}
              >
                <CreditCard className="h-4 w-4 mr-3" />
                Subscription
              </Button>

              {isOwner && (
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 text-sm"
                  onClick={() => handleProfileNavigation('/dashboard')}
                >
                  <User className="h-4 w-4 mr-3" />
                  Dashboard
                </Button>
              )}

              <Button
                variant="ghost"
                className="w-full justify-start h-10 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
