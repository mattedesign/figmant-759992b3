
import { 
  LayoutDashboard, 
  MessageSquare, 
  Wand2, 
  CreditCard, 
  Settings, 
  HelpCircle,
  Shield,
  Grid
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  disabled?: boolean;
}

export const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat', label: 'Chat Analysis', icon: MessageSquare },
  { id: 'wizard', label: 'Analysis Wizard', icon: Wand2 },
  { id: 'all-analyses', label: 'All Analyses', icon: Grid },
  { id: 'credits', label: 'Credits', icon: CreditCard },
  { id: 'preferences', label: 'Preferences', icon: Settings },
  { id: 'support', label: 'Help & Support', icon: HelpCircle },
];

export const adminSidebarItems: SidebarItem[] = [
  { id: 'admin', label: 'Admin Panel', icon: Shield },
];
