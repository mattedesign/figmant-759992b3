
import React, { useState } from 'react';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarNavigationCollapsed } from './SidebarNavigationCollapsed';
import { SidebarNavigationExpanded } from './SidebarNavigationExpanded';

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
  const isMobile = useIsMobile();

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

  // Wrap onSectionChange with logging
  const handleSectionChange = (section: string) => {
    console.log('🔍 SIDEBAR NAVIGATION - Section change triggered:', section);
    console.log('🔍 SIDEBAR NAVIGATION - Current active section:', activeSection);
    onSectionChange(section);
  };

  // On mobile, force expanded view (mobile navigation is handled differently)
  if (isMobile || (!isCollapsed)) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <SidebarNavigationExpanded
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isOwner={isOwner}
          allAnalyses={allAnalyses}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <SidebarNavigationCollapsed
        onSectionChange={handleSectionChange}
        isOwner={isOwner}
      />
    </div>
  );
};
