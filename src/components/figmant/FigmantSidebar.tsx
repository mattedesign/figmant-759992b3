
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Settings, 
  Search,
  Crown,
  CreditCard,
  HelpCircle,
  Sparkles,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';

interface FigmantSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const FigmantSidebar: React.FC<FigmantSidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  const { user, signOut } = useAuth();

  const navigationSections = [
    {
      title: 'Pages',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'analysis', icon: BarChart3, label: 'Analysis' },
        { id: 'premium-analysis', icon: Sparkles, label: 'Premium Analysis' },
        { id: 'templates', icon: FileText, label: 'Templates' },
        { id: 'preferences', icon: Settings, label: 'Preferences' },
      ]
    }
  ];

  const recentAnalyses = [
    'Analysis of something',
    'Analysis of something',
    'Analysis of something'
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleBuyCredits = () => {
    onSectionChange('credits');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header with Logo */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          <span className="font-semibold text-gray-900">figmant</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto">
        {navigationSections.map((section) => (
          <div key={section.title} className="p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full justify-start h-8 px-2 text-sm ${
                    activeSection === item.id 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        ))}

        {/* Search */}
        <div className="px-4 pb-4">
          <Button
            variant="ghost"
            onClick={() => onSectionChange('search')}
            className={`w-full justify-start h-8 px-2 text-sm ${
              activeSection === 'search'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
            <span className="ml-auto text-xs text-gray-400">⌘K</span>
          </Button>
        </div>

        {/* Recent */}
        <div className="px-4 pb-4">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Recent
          </h3>
          <div className="space-y-1">
            {recentAnalyses.map((analysis, index) => (
              <div
                key={index}
                className="text-sm text-gray-600 py-1 px-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => onSectionChange('analysis')}
              >
                {analysis}
              </div>
            ))}
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start h-6 px-2 text-xs text-gray-500 mt-2"
            onClick={() => onSectionChange('analysis')}
          >
            See all
          </Button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 bg-white">
        {/* Premium Section */}
        <div className="p-4 space-y-3">
          <Button
            variant="ghost"
            onClick={() => onSectionChange('premium-analysis')}
            className={`w-full justify-start h-8 px-2 text-sm ${
              activeSection === 'premium-analysis'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Crown className="h-4 w-4 mr-2" />
            Premium
          </Button>
          
          {/* Credits */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Credits</span>
              <span className="text-sm text-gray-600">50/110</span>
            </div>
            <Progress value={45} className="h-2" />
            <Button 
              size="sm" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleBuyCredits}
            >
              Buy More
            </Button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full p-0 h-auto">
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-orange-500 text-white text-sm">
                      {user?.email?.charAt(0).toUpperCase() || 'R'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-medium text-gray-900">Ronald Richards</div>
                    <div className="text-xs text-gray-500 truncate">ronaldrichards@gmail.com</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSectionChange('preferences')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSectionChange('preferences')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBuyCredits}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
