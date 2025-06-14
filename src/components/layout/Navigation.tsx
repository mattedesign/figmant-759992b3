
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface NavigationProps {
  showSidebarTrigger?: boolean;
}

export const Navigation = ({ showSidebarTrigger = false }: NavigationProps) => {
  const { user, isOwner } = useAuth();
  const location = useLocation();
  
  // Determine the title based on the current route and user role
  const getTitle = () => {
    if (location.pathname === '/owner' && isOwner) {
      return 'Owner Dashboard';
    }
    if (location.pathname === '/dashboard' || (location.pathname === '/owner' && !isOwner)) {
      return 'Dashboard';
    }
    return 'Dashboard';
  };

  return (
    <header className="border-b bg-card flex-shrink-0">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/c1e94897-1bb1-4fc6-9402-83245dcb008c.png" 
              alt="Logo" 
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-xl font-semibold">{getTitle()}</h1>
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
                {isOwner && (
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
                <UserMenu />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
