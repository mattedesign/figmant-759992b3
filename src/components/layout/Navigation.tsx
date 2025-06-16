
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface NavigationProps {
  showSidebarTrigger?: boolean;
}

export const Navigation = ({ showSidebarTrigger = false }: NavigationProps) => {
  const { user, isOwner } = useAuth();
  const location = useLocation();
  
  // Determine the title based on the current route
  const getTitle = () => {
    if (location.pathname === '/owner') {
      return 'Owner Dashboard';
    }
    if (location.pathname === '/dashboard') {
      return isOwner ? 'Subscriber View' : 'Dashboard';
    }
    if (location.pathname === '/figmant' || location.pathname === '/') {
      return 'figmant';
    }
    return 'Dashboard';
  };

  // Determine the badge based on current view
  const getBadge = () => {
    if (location.pathname === '/owner') {
      return (
        <Badge variant="default" className="bg-purple-100 text-purple-800">
          Owner Mode
        </Badge>
      );
    }
    if (location.pathname === '/dashboard' && isOwner) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Subscriber Mode
        </Badge>
      );
    }
    if (location.pathname === '/figmant' || location.pathname === '/') {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Live
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Live
      </Badge>
    );
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
            {getBadge()}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <UserMenu />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
