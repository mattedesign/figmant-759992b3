
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Wand2, 
  CreditCard, 
  Settings, 
  HelpCircle,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { SidebarRecentAnalyses } from '../../sidebar/components/SidebarRecentAnalyses';

interface SidebarNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  isOwner?: boolean;
  profile?: any;
  user?: any;
  subscription?: any;
  signOut?: () => Promise<void>;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggleCollapse,
  isOwner = false,
  profile,
  user,
  subscription,
  signOut
}) => {
  const [activeTab, setActiveTab] = useState('menu');

  // Fetch analysis history data
  const { data: chatAnalyses = [], isLoading: chatLoading } = useChatAnalysisHistory();
  const { data: designAnalyses = [], isLoading: designLoading } = useDesignAnalyses();

  // Combine both types of analyses and sort by date
  const allAnalyses = [
    ...designAnalyses.map(a => ({ 
      ...a, 
      type: 'design', 
      displayTitle: a.analysis_results?.title || 'Design Analysis',
      analysis_type: a.analysis_type || 'design_analysis'
    })),
    ...chatAnalyses.map(a => ({ 
      ...a, 
      type: 'chat', 
      displayTitle: 'Chat Analysis',
      analysis_type: a.analysis_type || 'chat_analysis'
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const isLoading = chatLoading || designLoading;

  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'Chat Analysis', icon: MessageSquare },
    { id: 'wizard', label: 'Analysis Wizard', icon: Wand2 },
  ];

  const supportItems = [
    { id: 'credits', label: 'Credits', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  const adminItems = isOwner ? [
    { id: 'admin', label: 'Admin Panel', icon: Shield },
  ] : [];

  // Collapsed state - icons only
  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center py-4 space-y-3" style={{ backgroundColor: '#F8F9FA' }}>
        {/* Main Menu Items */}
        {mainMenuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            onClick={() => onSectionChange(item.id)}
            className="w-10 h-10 p-0 hover:bg-transparent active:bg-transparent focus:bg-transparent border-none shadow-none"
          >
            <item.icon 
              className="h-5 w-5"
              style={{ color: '#6B7280' }}
            />
          </Button>
        ))}

        {/* Support Items */}
        {supportItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            onClick={() => onSectionChange(item.id)}
            className="w-10 h-10 p-0 hover:bg-transparent active:bg-transparent focus:bg-transparent border-none shadow-none"
          >
            <item.icon 
              className="h-5 w-5"
              style={{ color: '#6B7280' }}
            />
          </Button>
        ))}

        {/* Admin Items */}
        {adminItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            onClick={() => onSectionChange(item.id)}
            className="w-10 h-10 p-0 hover:bg-transparent active:bg-transparent focus:bg-transparent border-none shadow-none"
          >
            <item.icon 
              className="h-5 w-5"
              style={{ color: '#6B7280' }}
            />
          </Button>
        ))}
      </div>
    );
  }

  // Expanded state - with tabs
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'white' }}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        {/* Tabs Header */}
        <div 
          className="flex-shrink-0"
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #ECECEC'
          }}
        >
          <TabsList 
            className="grid w-full grid-cols-2 h-8"
            style={{
              borderRadius: '8px',
              background: 'rgba(28, 34, 43, 0.05)',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            <TabsTrigger 
              value="menu" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-[0px_1px_1px_0px_rgba(11,19,36,0.10),0px_1px_3px_0px_rgba(11,19,36,0.10)] data-[state=active]:rounded-[6px] data-[state=inactive]:bg-transparent data-[state=inactive]:shadow-none"
            >
              Menu
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-[0px_1px_1px_0px_rgba(11,19,36,0.10),0px_1px_3px_0px_rgba(11,19,36,0.10)] data-[state=active]:rounded-[6px] data-[state=inactive]:bg-transparent data-[state=inactive]:shadow-none"
            >
              Recent
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Tabs Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <TabsContent value="menu" className="h-full m-0 p-4 space-y-6">
            {/* Main Menu Section */}
            <div className="space-y-1">
              {mainMenuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "w-full justify-start h-10 px-3 transition-all duration-200 border-none shadow-none group",
                    activeSection === item.id
                      ? "text-blue-600 font-medium rounded-lg"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                  style={
                    activeSection === item.id 
                      ? { backgroundColor: '#EBF4FF', color: '#2563EB' }
                      : {}
                  }
                >
                  <item.icon 
                    className={cn(
                      "h-5 w-5 mr-3",
                      activeSection === item.id 
                        ? "text-blue-600" 
                        : "text-gray-500 group-hover:text-gray-700"
                    )}
                  />
                  <span className="font-medium text-sm">
                    {item.label}
                  </span>
                </Button>
              ))}
            </div>

            {/* Support Section */}
            <div className="space-y-1">
              <h3 
                className="text-xs font-medium px-3 mb-2 uppercase tracking-wide"
                style={{ color: '#6B7280' }}
              >
                Support
              </h3>
              {supportItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "w-full justify-start h-10 px-3 transition-all duration-200 border-none shadow-none group",
                    activeSection === item.id
                      ? "text-blue-600 font-medium rounded-lg"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                  style={
                    activeSection === item.id 
                      ? { backgroundColor: '#EBF4FF', color: '#2563EB' }
                      : {}
                  }
                >
                  <item.icon 
                    className={cn(
                      "h-5 w-5 mr-3",
                      activeSection === item.id 
                        ? "text-blue-600" 
                        : "text-gray-500 group-hover:text-gray-700"
                    )}
                  />
                  <span className="font-medium text-sm">
                    {item.label}
                  </span>
                </Button>
              ))}
            </div>

            {/* Admin Section */}
            {adminItems.length > 0 && (
              <div className="space-y-1">
                <h3 
                  className="text-xs font-medium px-3 mb-2 uppercase tracking-wide"
                  style={{ color: '#6B7280' }}
                >
                  Admin
                </h3>
                {adminItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onSectionChange(item.id)}
                    className={cn(
                      "w-full justify-start h-10 px-3 transition-all duration-200 border-none shadow-none group",
                      activeSection === item.id
                        ? "text-blue-600 font-medium rounded-lg"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                    style={
                      activeSection === item.id 
                        ? { backgroundColor: '#EBF4FF', color: '#2563EB' }
                        : {}
                    }
                  >
                    <item.icon 
                      className={cn(
                        "h-5 w-5 mr-3",
                        activeSection === item.id 
                          ? "text-blue-600" 
                          : "text-gray-500 group-hover:text-gray-700"
                      )}
                    />
                    <span className="font-medium text-sm">
                      {item.label}
                    </span>
                  </Button>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="h-full m-0 flex flex-col">
            <SidebarRecentAnalyses
              analysisHistory={allAnalyses}
              onSectionChange={onSectionChange}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
