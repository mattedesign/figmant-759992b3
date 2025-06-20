
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
        className="grid w-full grid-cols-2 h-12"
        style={{
          borderRadius: '20px',
          background: '#E5E7EB',
          border: 'none',
          boxShadow: 'none',
          padding: '4px'
        }}
      >
        <TabsTrigger 
          value="menu" 
          className="text-base font-semibold h-full rounded-2xl data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:shadow-none"
          onClick={() => onTabChange('menu')}
          style={{
            margin: '2px'
          }}
        >
          Analysis
        </TabsTrigger>
        <TabsTrigger 
          value="recent" 
          className="text-base font-semibold h-full rounded-2xl data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:shadow-none"
          onClick={() => onTabChange('recent')}
          style={{
            margin: '2px'
          }}
        >
          Recent
        </TabsTrigger>
      </TabsList>
    </div>
  );
};
