
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  getMenuItemButtonStyles,
  getMenuItemButtonInlineStyles,
  getIconContainerStyles,
  getIconStyles,
  getLabelStyles,
  getActiveLabelInlineStyles,
  getInactiveLabelInlineStyles
} from './sidebarMenuStyles';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}

interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onSectionChange: (section: string) => void;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isActive,
  onSectionChange
}) => {
  return (
    <Button
      key={item.id}
      variant="ghost"
      className={getMenuItemButtonStyles(isActive)}
      style={getMenuItemButtonInlineStyles(isActive)}
      onClick={() => onSectionChange(item.id)}
    >
      <div className={getIconContainerStyles(isActive)}>
        <item.icon className={getIconStyles(isActive)} />
      </div>
      <span
        className={getLabelStyles(isActive)}
        style={isActive ? getActiveLabelInlineStyles() : getInactiveLabelInlineStyles()}
      >
        {item.label}
      </span>
    </Button>
  );
};
