
import { navigationConfig } from '@/config/navigation';
import { LucideIcon } from 'lucide-react';

// Interface for sidebar items
export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
}

// Export the unified navigation configuration for backward compatibility
export const sidebarItems: SidebarItem[] = navigationConfig.mainItems.map(item => ({
  id: item.id,
  label: item.label,
  icon: item.icon,
  badge: item.id === 'competitor-analysis' ? 'New' : undefined,
  disabled: false
}));
