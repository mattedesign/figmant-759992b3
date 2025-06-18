
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare,
  Sparkles, 
  Lightbulb, 
  CreditCard,
  HelpCircle,
  Users,
  Package,
  Settings as SettingsIcon,
  Search,
  ChevronUp,
  ChevronDown,
  PanelLeftOpen,
  PanelLeftClose
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';

interface SidebarNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOwner: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
  collapsible?: boolean;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionChange,
  isOwner,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { profile } = useAuth();
  const { data: analysisHistory = [] } = useChatAnalysisHistory();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Main menu sections
  const mainMenuSections: MenuSection[] = [
    {
      items: [
        { id: 'chat', label: 'Chat', icon: MessageSquare },
        { id: 'wizard', label: 'Wizard', icon: Sparkles },
        { id: 'prompts', label: 'Prompts', icon: Lightbulb },
        { id: 'credits', label: 'Credits', icon: CreditCard },
      ]
    }
  ];

  // Support section
  const supportSection: MenuSection = {
    items: [
      { id: 'support', label: 'Support', icon: HelpCircle }
    ]
  };

  // Admin sections (only for owners)
  const adminSections: MenuSection[] = isOwner ? [
    {
      title: 'Admin',
      items: [
        { id: 'users', label: 'Users', icon: Users },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'assets', label: 'Assets', icon: Lightbulb },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
      ]
    }
  ] : [];

  const toggleSection = (sectionTitle: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const renderMenuItem = (item: MenuItem) => (
    <Button
      key={item.id}
      variant="ghost"
      className={cn(
        "w-full justify-start h-12 text-left",
        activeSection === item.id 
          ? "bg-white text-[#3D4A5C] rounded-[20px]"
          : "hover:bg-white hover:text-[#3D4A5C] hover:rounded-[20px]"
      )}
      onClick={() => onSectionChange(item.id)}
    >
      <item.icon className={cn(
        "h-5 w-5 mr-3",
        activeSection === item.id ? "text-[#3D4A5C]" : "text-[#455468]"
      )} />
      <span className={cn(
        activeSection === item.id ? "text-[#3D4A5C] font-semibold" : "text-[#455468] font-medium"
      )}>
        {item.label}
      </span>
    </Button>
  );

  const renderMenuSection = (section: MenuSection, sectionKey: string) => {
    const isCollapsed = section.title ? collapsedSections[section.title] : false;
    
    return (
      <div key={sectionKey} className="space-y-2">
        {section.title && (
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{section.title}</h3>
            {section.collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection(section.title!)}
                className="h-6 w-6 p-0"
              >
                {isCollapsed ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronUp className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        )}
        
        {(!section.title || !isCollapsed) && (
          <div className="space-y-1">
            {section.items.map(renderMenuItem)}
          </div>
        )}
      </div>
    );
  };

  const renderRecentAnalyses = () => (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-1">
        {analysisHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent analyses</p>
          </div>
        ) : (
          analysisHistory.slice(0, 10).map((analysis) => (
            <div
              key={analysis.id}
              className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSectionChange('analysis')}
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {analysis.analysis_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {analysis.prompt_used.length > 60 
                      ? `${analysis.prompt_used.substring(0, 60)}...` 
                      : analysis.prompt_used}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );

  if (isCollapsed) {
    return (
      <div className="flex-1 overflow-y-auto flex flex-col py-6">
        <div className="p-2 space-y-2 flex-1">
          {mainMenuSections[0].items.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              className={cn(
                "w-10 h-10 p-0",
                activeSection === item.id 
                  ? "bg-white text-[#3D4A5C]" 
                  : "hover:bg-white hover:text-[#3D4A5C]"
              )}
              onClick={() => onSectionChange(item.id)}
              title={item.label}
            >
              <item.icon className={cn(
                "h-4 w-4",
                activeSection === item.id 
                  ? "text-[#3D4A5C] font-bold stroke-[2.5]" 
                  : "text-[#455468]"
              )} />
            </Button>
          ))}
        </div>
        
        <div className="p-2 border-t border-gray-200/30 flex justify-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onToggleCollapse?.(!isCollapsed)}
            className="w-10 h-10 p-0 text-gray-500 hover:text-gray-700 hover:bg-transparent active:bg-transparent"
          >
            <PanelLeftOpen className="h-9 w-9" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col py-6">
      {/* User Profile Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {profile?.full_name || 'User'}
            </h2>
            <p className="text-sm text-gray-500">Personal Account</p>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabbed Interface */}
      <div className="px-4 mb-4">
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="analysis" className="data-[state=active]:bg-white">
              Analysis
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-white">
              Recent
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis" className="mt-4 space-y-6">
            <div className="space-y-6">
              {mainMenuSections.map((section, index) => 
                renderMenuSection(section, `main-${index}`)
              )}
              
              {renderMenuSection(supportSection, 'support')}
              
              {adminSections.map((section, index) => 
                renderMenuSection(section, `admin-${index}`)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-4 h-96">
            {renderRecentAnalyses()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Search Bar */}
      <div className="px-4 mt-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <kbd className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs text-gray-500 bg-white border border-gray-200 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-gray-200/30 mt-4">
        <Button 
          variant="ghost"
          onClick={() => onToggleCollapse?.(!isCollapsed)}
          className="w-full justify-start text-gray-500 hover:text-gray-700 hover:bg-transparent active:bg-transparent"
        >
          <PanelLeftClose className="h-4 w-4 mr-3" />
          <span className="text-sm font-medium">Collapse</span>
        </Button>
      </div>
    </div>
  );
};
