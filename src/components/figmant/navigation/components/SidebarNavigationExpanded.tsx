
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAllNavigationItems } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { SidebarRecentAnalyses } from '../../sidebar/components/SidebarRecentAnalyses';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';

interface SidebarNavigationExpandedProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOwner: boolean;
  allAnalyses: any[];
}

export const SidebarNavigationExpanded: React.FC<SidebarNavigationExpandedProps> = ({
  activeTab,
  onTabChange,
  activeSection,
  onSectionChange,
  isOwner,
  allAnalyses
}) => {
  // Get filtered navigation items (automatically excludes hidden items)
  const allNavigationItems = getAllNavigationItems();
  const mainItems = allNavigationItems.filter(item => item.priority === 1);
  const supportItems = allNavigationItems.filter(item => item.priority === 2 && item.id === 'help-support');
  const adminItems = isOwner ? allNavigationItems.filter(item => item.priority === 2 && item.id === 'admin') : [];

  // Get chat analysis history for the interactive component
  const { data: chatAnalysisHistory = [] } = useChatAnalysisHistory();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col min-h-0">
        <div className="flex-none px-4 pt-4 pb-2">
          <TabsList 
            className="grid w-full grid-cols-2 h-10"
          >
            <TabsTrigger 
              value="menu" 
              className="text-sm"
              style={activeTab === 'menu' ? {
                borderRadius: '8px',
                background: 'var(--Surface-01, #FCFCFC)',
                boxShadow: '0px 1.25px 3px 0px var(--Shade-7-10, rgba(50, 50, 50, 0.10)), 0px 1.25px 1px 0px #FFF inset'
              } : {}}
            >
              Menu
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="text-sm"
              style={activeTab === 'history' ? {
                borderRadius: '8px',
                background: 'var(--Surface-01, #FCFCFC)',
                boxShadow: '0px 1.25px 3px 0px var(--Shade-7-10, rgba(50, 50, 50, 0.10)), 0px 1.25px 1px 0px #FFF inset'
              } : {}}
            >
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0">
          <TabsContent value="menu" className="mt-0 h-full">
            <div className="h-full flex flex-col">
              {/* Main Navigation - Fixed height, no scroll */}
              <div className="flex-none px-4 pt-6 pb-4">
                <div className="space-y-1">
                  {mainItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => onSectionChange(item.id)}
                      className={cn(
                        "w-full justify-start h-10 px-3 transition-colors",
                        activeSection === item.id 
                          ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                          : "hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="flex-1 text-left truncate text-sm">{item.label}</span>
                      {item.id === 'analysis' && (
                        <Badge variant="secondary" className="ml-2 text-xs bg-blue-100 text-blue-700">
                          New
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Support Items - Fixed height, no scroll */}
              {supportItems.length > 0 && (
                <div className="flex-none px-4 pb-4">
                  <div className="text-xs font-medium text-gray-500 mb-2 px-3">Support</div>
                  <div className="space-y-1">
                    {supportItems.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => onSectionChange(item.id)}
                        className={cn(
                          "w-full justify-start h-10 px-3 transition-colors",
                          activeSection === item.id 
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                            : "hover:bg-gray-100"
                        )}
                      >
                        <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span className="flex-1 text-left truncate text-sm">{item.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Items - Fixed height, no scroll */}
              {adminItems.length > 0 && (
                <div className="flex-none px-4">
                  <div className="text-xs font-medium text-gray-500 mb-2 px-3">Admin</div>
                  <div className="space-y-1">
                    {adminItems.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => onSectionChange(item.id)}
                        className={cn(
                          "w-full justify-start h-10 px-3 transition-colors",
                          activeSection === item.id 
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                            : "hover:bg-gray-100"
                        )}
                      >
                        <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span className="flex-1 text-left truncate text-sm">{item.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0 h-full">
            <div className="h-full flex flex-col">
              <div className="flex-none px-4 pb-2">
                <div className="text-sm font-medium text-gray-900">Recent Analysis</div>
                <div className="text-xs text-gray-500">Last 10 analyses</div>
              </div>
              
              {/* Use the interactive SidebarRecentAnalyses component */}
              <div className="flex-1 min-h-0">
                <SidebarRecentAnalyses
                  analysisHistory={chatAnalysisHistory}
                  onSectionChange={onSectionChange}
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
