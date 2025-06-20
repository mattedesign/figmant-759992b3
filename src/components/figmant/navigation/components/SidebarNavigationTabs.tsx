
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
          display: 'flex',
          padding: '4px',
          alignItems: 'center',
          flex: '1 0 0',
          borderRadius: '12px',
          border: '1px solid var(--Stroke-02, #E2E2E2)',
          background: 'var(--Surface-03, #F1F1F1)',
          boxShadow: '0px 1px 1.9px 0px var(--Shade-7-10, rgba(50, 50, 50, 0.10)) inset'
        }}
      >
        <TabsTrigger 
          value="menu" 
          className="text-base font-semibold h-full rounded-2xl data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:shadow-none"
          onClick={() => onTabChange('menu')}
          style={{
            margin: '2px',
            ...(activeTab === 'menu' ? {
              borderRadius: '8px',
              background: 'var(--Surface-01, #FCFCFC)',
              boxShadow: '0px 1.25px 3px 0px var(--Shade-7-10, rgba(50, 50, 50, 0.10)), 0px 1.25px 1px 0px #FFF inset',
              color: 'var(--Text-Primary, #121212)',
              fontFamily: '"Instrument Sans"',
              fontSize: '13px',
              fontStyle: 'normal',
              fontWeight: '600',
              lineHeight: '16px',
              letterSpacing: '-0.13px'
            } : {
              display: 'flex',
              padding: '8px 12px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              flex: '1 0 0',
              borderRadius: '8px',
              color: 'var(--Text-Secondary, #7B7B7B)',
              fontFamily: '"Instrument Sans"',
              fontSize: '13px',
              fontStyle: 'normal',
              fontWeight: '600',
              lineHeight: '16px',
              letterSpacing: '-0.13px'
            })
          }}
        >
          Analysis
        </TabsTrigger>
        <TabsTrigger 
          value="recent" 
          className="text-base font-semibold h-full rounded-2xl data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:shadow-none"
          onClick={() => onTabChange('recent')}
          style={{
            margin: '2px',
            ...(activeTab === 'recent' ? {
              borderRadius: '8px',
              background: 'var(--Surface-01, #FCFCFC)',
              boxShadow: '0px 1.25px 3px 0px var(--Shade-7-10, rgba(50, 50, 50, 0.10)), 0px 1.25px 1px 0px #FFF inset',
              color: 'var(--Text-Primary, #121212)',
              fontFamily: '"Instrument Sans"',
              fontSize: '13px',
              fontStyle: 'normal',
              fontWeight: '600',
              lineHeight: '16px',
              letterSpacing: '-0.13px'
            } : {
              display: 'flex',
              padding: '8px 12px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              flex: '1 0 0',
              borderRadius: '8px',
              color: 'var(--Text-Secondary, #7B7B7B)',
              fontFamily: '"Instrument Sans"',
              fontSize: '13px',
              fontStyle: 'normal',
              fontWeight: '600',
              lineHeight: '16px',
              letterSpacing: '-0.13px'
            })
          }}
        >
          Recent
        </TabsTrigger>
      </TabsList>
    </div>
  );
};
