
import { navigationConfig } from '@/config/navigation';

// Export the unified navigation configuration for backward compatibility
export const sidebarItems = navigationConfig.mainItems.map(item => ({
  id: item.id,
  label: item.label,
  icon: item.icon,
  badge: item.id === 'competitor-analysis' ? 'New' : undefined,
  disabled: false
}));
