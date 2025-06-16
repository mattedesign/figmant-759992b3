
import React, { useState } from 'react';
import { CollapsibleSidebar } from './navigation/CollapsibleSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface FigmantSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const FigmantSidebar: React.FC<FigmantSidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // Auto-collapse on mobile
  React.useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <CollapsibleSidebar
      activeSection={activeSection}
      onSectionChange={onSectionChange}
      isCollapsed={isCollapsed}
      onToggleCollapse={handleToggleCollapse}
    />
  );
};
