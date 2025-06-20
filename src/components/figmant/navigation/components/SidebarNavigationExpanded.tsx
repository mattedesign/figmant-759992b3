
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { navigationConfig } from '@/config/navigation';
import { cn } from '@/lib/utils';

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
  const mainItems = navigationConfig.mainItems;
  const supportItems = navigationConfig.supportItems;
  const adminItems = isOwner ? navigationConfig.adminItems : [];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col min-h-0">
        <div className="flex-none px-4 pt-4 pb-2">
          <TabsList 
            className="grid w-full grid-cols-2 h-10"
            style={{
              borderRadius: '12px',
              border: '1px solid var(--Stroke-02, #E2E2E2)',
              background: 'var(--Surface-03, #F1F1F1)',
              boxShadow: '0px 1px 1.9px 0px var(--Shade-7-10, rgba(50, 50, 50, 0.10)) inset'
            }}
          >
            <TabsTrigger value="menu" className="text-sm">Menu</TabsTrigger>
            <TabsTrigger value="history" className="text-sm">History</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0">
          <TabsContent value="menu" className="mt-0 h-full">
            <div className="h-full flex flex-col">
              {/* Main Navigation - Fixed height, no scroll */}
              <div className="flex-none px-4 pb-4">
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
                      {item.id === 'competitor-analysis' && (
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
              
              {/* History content with controlled scroll */}
              <ScrollArea className="flex-1">
                <div className="px-4 space-y-2">
                  {allAnalyses.slice(0, 10).map((analysis, index) => (
                    <div
                      key={`${analysis.type}-${analysis.id}`}
                      className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      <div className="text-sm font-medium text-gray-900 mb-1 truncate">
                        {analysis.title || analysis.displayTitle}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {analysis.analysisType || analysis.type}
                      </div>
                    </div>
                  ))}
                  
                  {allAnalyses.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8">
                      No analyses found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
