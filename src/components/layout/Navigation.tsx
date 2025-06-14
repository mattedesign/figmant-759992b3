
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/common/Logo';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface NavigationProps {
  showSidebarTrigger?: boolean;
}

export const Navigation = ({ showSidebarTrigger = false }: NavigationProps) => {
  const { user } = useAuth();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showSidebarTrigger && (
              <div className="flex items-center space-x-2">
                <SidebarTrigger />
                <div className="h-4 w-px bg-border" />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Logo size="md" />
            </div>
            {showSidebarTrigger && (
              <h1 className="text-xl font-semibold">Owner Dashboard</h1>
            )}
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Live
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
                <UserMenu />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
