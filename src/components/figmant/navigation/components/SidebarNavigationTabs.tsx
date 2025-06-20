
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SidebarNavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SidebarNavigationTabs: React.FC<SidebarNavigationTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
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
          background: '#F5F5F5',
          border: 'none',
          boxShadow: 'none',
          padding: '2px'
        }}
      >
        <TabsTrigger 
          value="menu" 
          className="text-sm font-medium h-full rounded-md m-0.5 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:shadow-none"
          onClick={() => onTabChange('menu')}
        >
          Menu
        </TabsTrigger>
        <TabsTrigger 
          value="recent" 
          className="text-sm font-medium h-full rounded-md m-0.5 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:shadow-none"
          onClick={() => onTabChange('recent')}
        >
          Recent
        </TabsTrigger>
      </TabsList>
    </div>
  );
};
