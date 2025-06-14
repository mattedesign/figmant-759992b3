
import { Button } from '@/components/ui/button';
import { BarChart3, Users, CreditCard, Bot, Settings, Bell, MessageSquare, Target, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { lazy, Suspense } from 'react';

// Lazy load content components
const DesignChatInterface = lazy(() => import('@/components/design/DesignChatInterface').then(module => ({
  default: module.DesignChatInterface
})));
const BatchAnalysisDashboard = lazy(() => import('@/components/design/BatchAnalysisDashboard'));
const UnifiedAnalysisHistory = lazy(() => import('@/components/design/UnifiedAnalysisHistory'));
const DesignList = lazy(() => import('@/components/design/DesignList'));
const UserManagement = lazy(() => import('@/components/owner/UserManagement').then(module => ({
  default: module.UserManagement
})));
const SubscriptionPlansManager = lazy(() => import('@/components/owner/SubscriptionPlansManager').then(module => ({
  default: module.SubscriptionPlansManager
})));
const ClaudeSettings = lazy(() => import('@/components/owner/ClaudeSettings').then(module => ({
  default: module.ClaudeSettings
})));
const AdminSettings = lazy(() => import('@/components/owner/AdminSettings').then(module => ({
  default: module.AdminSettings
})));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

interface SecondaryNavigationProps {
  activeSection: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sectionConfig = {
  workspace: {
    title: 'Workspace',
    items: [
      { id: 'design', label: 'AI Chat Analysis', icon: MessageSquare },
      { id: 'batch', label: 'Batch Analysis', icon: BarChart3 },
      { id: 'history', label: 'Analysis History', icon: Target },
      { id: 'legacy', label: 'Legacy View', icon: History },
    ]
  },
  users: {
    title: 'User Management',
    items: [
      { id: 'users', label: 'All Users', icon: Users },
    ]
  },
  products: {
    title: 'Products & Plans',
    items: [
      { id: 'plans', label: 'Subscription Plans', icon: CreditCard },
    ]
  },
  apps: {
    title: 'Applications',
    items: [
      { id: 'claude', label: 'Claude AI', icon: Bot },
    ]
  },
  settings: {
    title: 'Settings',
    items: [
      { id: 'settings', label: 'Admin Settings', icon: Settings },
      { 
        id: 'alerts', 
        label: 'Alerts', 
        icon: Bell, 
        disabled: true,
        badge: 'Soon'
      },
    ]
  },
};

const renderTabContent = (activeTab: string) => {
  switch (activeTab) {
    case 'design':
      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Design Analysis</h1>
              <p className="text-muted-foreground">
                Chat with AI for comprehensive UX insights and design analysis
              </p>
            </div>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <DesignChatInterface />
          </Suspense>
        </div>
      );
    case 'batch':
      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Batch Analysis</h1>
              <p className="text-muted-foreground">
                Analyze multiple designs simultaneously for comprehensive insights
              </p>
            </div>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <BatchAnalysisDashboard />
          </Suspense>
        </div>
      );
    case 'history':
      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analysis History</h1>
              <p className="text-muted-foreground">
                View and manage all your design analysis history
              </p>
            </div>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <UnifiedAnalysisHistory onViewAnalysis={(upload) => console.log('Viewing analysis:', upload.id, upload.file_name)} />
          </Suspense>
        </div>
      );
    case 'legacy':
      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Legacy Design View</h1>
              <p className="text-muted-foreground">
                Classic view of uploaded designs and analysis
              </p>
            </div>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <DesignList onViewAnalysis={(upload) => console.log('Viewing analysis:', upload.id, upload.file_name)} />
          </Suspense>
        </div>
      );
    case 'users':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <UserManagement />
        </Suspense>
      );
    case 'plans':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <SubscriptionPlansManager />
        </Suspense>
      );
    case 'claude':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <ClaudeSettings />
        </Suspense>
      );
    case 'settings':
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <AdminSettings />
        </Suspense>
      );
    default:
      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Design Analysis</h1>
              <p className="text-muted-foreground">
                Chat with AI for comprehensive UX insights and design analysis
              </p>
            </div>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <DesignChatInterface />
          </Suspense>
        </div>
      );
  }
};

export const SecondaryNavigation = ({ activeSection, activeTab, onTabChange }: SecondaryNavigationProps) => {
  const config = sectionConfig[activeSection as keyof typeof sectionConfig];

  if (!config) {
    return (
      <div className="flex flex-1">
        <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Navigation</h2>
          </div>
          <div className="flex-1 p-4">
            <div className="text-muted-foreground">
              Select a section from the left sidebar
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No content available</h3>
            <p className="text-muted-foreground">
              Please select a valid section from the left sidebar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      {/* Navigation Sidebar */}
      <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">{config.title}</h2>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-2">
          <div className="space-y-1">
            {config.items.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => !item.disabled && onTabChange(item.id)}
                className={cn(
                  "w-full justify-start h-10 px-3",
                  activeTab === item.id && "bg-accent text-accent-foreground",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
                disabled={item.disabled}
              >
                <item.icon className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {renderTabContent(activeTab)}
      </div>
    </div>
  );
};
