
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Home,
  BarChart3, 
  Star, 
  FileText, 
  Settings,
  Search,
  Shield,
  User,
  LogOut,
  CreditCard,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FigmantSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const FigmantSidebar: React.FC<FigmantSidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  const { isOwner, profile, user, subscription, signOut } = useAuth();
  const { credits, creditsLoading } = useUserCredits();
  const navigate = useNavigate();
  const location = useLocation();

  const mainSections = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'premium-analysis', label: 'Premium Analysis', icon: Star },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'search', label: 'Search', icon: Search },
  ];

  // Add admin section for owners
  if (isOwner) {
    mainSections.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  const currentBalance = credits?.current_balance || 0;
  const totalPurchased = credits?.total_purchased || 0;
  const progressPercentage = totalPurchased > 0 ? (currentBalance / totalPurchased) * 100 : 0;

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (profile?.email) {
      return profile.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleBuyMoreCredits = () => {
    navigate('/subscription');
  };

  const handleSignOut = async () => {
    console.log('FigmantSidebar: Initiating sign out...');
    try {
      await signOut();
      console.log('FigmantSidebar: Sign out successful, navigating to root');
      navigate('/');
    } catch (error) {
      console.error('FigmantSidebar: Sign out error:', error);
    }
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

  const isOnOwnerDashboard = location.pathname === '/owner';
  const isOnSubscriberDashboard = location.pathname === '/dashboard';

  return (
    <div className="w-64 bg-transparent border-r border-gray-200/30 flex flex-col min-h-screen backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200/30">
        <Logo size="md" className="w-auto" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Pages Section */}
        <div>
          <div className="text-sm font-medium text-gray-500 mb-3">Pages</div>
          <div className="space-y-1">
            {mainSections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeSection === section.id && "bg-[#F9FAFB] text-[#3D4A5C] rounded-[20px]",
                  section.id === 'admin' && activeSection !== section.id && "border border-orange-200 bg-orange-50/80 text-orange-700 hover:bg-orange-100/80",
                  section.id === 'admin' && activeSection === section.id && "bg-[#F9FAFB] text-[#3D4A5C] rounded-[20px] border-none"
                )}
                onClick={() => onSectionChange(section.id)}
              >
                <section.icon className={cn(
                  "h-4 w-4 mr-3",
                  activeSection === section.id && "text-[#3D4A5C]"
                )} />
                <span className={cn(
                  activeSection === section.id && "text-[#3D4A5C]"
                )}>
                  {section.label}
                </span>
                {section.id === 'admin' && (
                  <Badge variant="secondary" className={cn(
                    "ml-auto",
                    activeSection === section.id ? "bg-[#3D4A5C]/10 text-[#3D4A5C]" : "bg-orange-100 text-orange-700"
                  )}>
                    Owner
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Credits Section - Only show for non-owners */}
      {!isOwner && (
        <div className="p-4 border-t border-gray-200/30">
          <div className="bg-gray-50/80 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Credits</span>
              <span className="text-sm font-medium text-gray-900">
                {creditsLoading ? '...' : `${currentBalance}/${totalPurchased}`}
              </span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
            
            <Button 
              onClick={handleBuyMoreCredits}
              className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
              variant="outline"
            >
              Buy More
            </Button>
          </div>
        </div>
      )}

      {/* User Profile - Always at bottom */}
      <div className="p-4 border-t border-gray-200/30 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50/50 rounded-lg cursor-pointer transition-colors">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{getInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 flex items-center">
                  {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                  {getSubscriptionBadge()}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {profile?.email || user?.email || 'user@example.com'}
                </div>
              </div>
              <div className="w-4 h-4 text-gray-400">↓</div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Dashboard Navigation - Only show for owners */}
            {isOwner && (
              <>
                <DropdownMenuItem 
                  onClick={() => navigate('/dashboard')}
                  className={isOnSubscriberDashboard ? 'bg-accent' : ''}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Subscriber Dashboard
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => navigate('/owner')}
                  className={isOnOwnerDashboard ? 'bg-accent' : ''}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Owner Dashboard
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
              </>
            )}

            {/* Regular dashboard link for non-owners */}
            {!isOwner && (
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <User className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={() => navigate('/subscription')}>
              <CreditCard className="mr-2 h-4 w-4" />
              Subscription
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
