
import { 
  LayoutDashboard,
  FileText,
  Star,
  CreditCard,
  FileSearch,
  Settings,
  Search,
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  disabled?: boolean;
}

export const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: FileText,
    badge: 'New'
  },
  {
    id: 'premium-analysis',
    label: 'Premium Analysis',
    icon: Star,
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: FileSearch,
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
  },
  {
    id: 'credits',
    label: 'Credits',
    icon: CreditCard,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: Settings,
  },
];
