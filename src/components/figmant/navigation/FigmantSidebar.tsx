
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Lightbulb,
  Sparkles, 
  FileSearch, 
  Upload, 
  Clock3, 
  MessageSquare, 
  BarChart3, 
  User, 
  Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface FigmantSidebarProps {
  currentSection: string;
}

export const FigmantSidebar: React.FC<FigmantSidebarProps> = ({ currentSection }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Quick Actions',
      icon: LayoutDashboard,
      path: '/figmant/dashboard',
      description: 'Quick start hub'
    },
    {
      id: 'insights',
      label: 'Design Insights',
      icon: Lightbulb,
      path: '/figmant/insights',
      description: 'Analytics & insights',
      badge: 'New'
    },
    {
      id: 'premium-analysis',
      label: 'Premium Analysis',
      icon: Sparkles,
      path: '/figmant/premium-analysis',
      description: 'AI-powered analysis'
    },
    {
      id: 'analysis',
      label: 'All Analysis',
      icon: FileSearch,
      path: '/figmant/analysis',
      description: 'View all results'
    },
    {
      id: 'upload',
      label: 'Upload Design',
      icon: Upload,
      path: '/figmant/upload',
      description: 'Analyze new designs'
    },
    {
      id: 'processing',
      label: 'Processing',
      icon: Clock3,
      path: '/figmant/processing',
      description: 'Active analyses'
    },
    {
      id: 'prompts',
      label: 'Prompts',
      icon: MessageSquare,
      path: '/figmant/prompts',
      description: 'Saved prompts'
    },
    {
      id: 'analytics',
      label: 'Performance',
      icon: BarChart3,
      path: '/figmant/analytics',
      description: 'Performance metrics'
    }
  ];

  const bottomNavigationItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/figmant/profile',
      description: 'User settings'
    }
  ];

  // Add admin item for owners
  if (user?.user_metadata?.role === 'owner') {
    bottomNavigationItems.push({
      id: 'admin',
      label: 'Admin',
      icon: Settings,
      path: '/figmant/admin',
      description: 'System administration'
    });
  }

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const renderNavigationItem = (item: any) => (
    <Button
      key={item.id}
      variant={currentSection === item.id ? 'default' : 'ghost'}
      className={cn(
        "w-full justify-start h-auto p-3 mb-1",
        currentSection === item.id 
          ? "bg-primary text-primary-foreground shadow-sm" 
          : "hover:bg-gray-100 text-gray-700"
      )}
      onClick={() => handleNavigation(item.path)}
    >
      <div className="flex items-center gap-3 w-full">
        <item.icon className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          <p className="text-xs opacity-70">{item.description}</p>
        </div>
      </div>
    </Button>
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Figmant</h1>
        <p className="text-sm text-gray-600">AI Design Analysis</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigationItems.map(renderNavigationItem)}
      </nav>

      {/* Bottom Navigation */}
      <nav className="px-4 py-4 border-t border-gray-200 space-y-1">
        {bottomNavigationItems.map(renderNavigationItem)}
      </nav>
    </div>
  );
};
