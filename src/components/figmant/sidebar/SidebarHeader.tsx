
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PanelLeftClose, PanelLeftOpen, CreditCard, Crown, Zap } from 'lucide-react';
import { useTemplateCreditStore } from '@/stores/templateCreditStore';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse
}) => {
  // Use explicit selector pattern for better reactivity
  const currentCreditCost = useTemplateCreditStore((state) => {
    console.log('🔄 FigmantSidebarHeader: Store selector called, credit cost:', state.currentCreditCost);
    return state.currentCreditCost;
  });

  console.log('🔄 FigmantSidebarHeader: Component rendering with credit cost:', currentCreditCost);

  const getCreditIcon = () => {
    const icon = currentCreditCost >= 5 ? <Crown className="h-3 w-3" /> : 
                 currentCreditCost >= 3 ? <Zap className="h-3 w-3" /> : 
                 <CreditCard className="h-3 w-3" />;
    return icon;
  };

  const getCreditStyle = () => {
    return currentCreditCost >= 5 
      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none"
      : currentCreditCost >= 3 
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

  const handleToggle = () => {
    onToggleCollapse(!isCollapsed);
  };

  return (
    <div className="flex-shrink-0 p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/c1e94897-1bb1-4fc6-9402-83245dcb008c.png" 
            alt="Logo" 
            className="h-6 w-6 object-contain flex-shrink-0"
          />
          {!isCollapsed && (
            <span className="font-semibold text-lg text-gray-900">figmant</span>
          )}
        </div>

        {/* Credit Cost Display and Collapse Button */}
        <div className="flex items-center space-x-2">
          {/* Credit Cost Badge - Hidden but not removed */}
          {!isCollapsed && (
            <Badge className={`hidden flex items-center gap-1 transition-all duration-200 ${getCreditStyle()}`}>
              {getCreditIcon()}
              {currentCreditCost} Credit{currentCreditCost !== 1 ? 's' : ''}
            </Badge>
          )}
          
          {/* Collapse Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
