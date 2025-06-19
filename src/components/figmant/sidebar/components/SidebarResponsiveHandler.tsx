
import { useEffect } from 'react';

interface SidebarResponsiveHandlerProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export const useSidebarResponsiveHandler = ({
  isCollapsed,
  setIsCollapsed,
  onCollapsedChange
}: SidebarResponsiveHandlerProps) => {
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Only set initial collapsed state if we're in tablet range
      // Let the parent layout control the state for responsive behavior
      if (width >= 768 && width < 1024) {
        // Don't force collapsed here - let parent layout handle it
        // This is just for detecting tablet range
        console.log('🔧 FIGMANT SIDEBAR - Detected tablet range:', width);
      } else if (width >= 1024) {
        console.log('🔧 FIGMANT SIDEBAR - Detected desktop range:', width);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapsedChange?.(collapsed);
  };

  return { handleToggleCollapse };
};
