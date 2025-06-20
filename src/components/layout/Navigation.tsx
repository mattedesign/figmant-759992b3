
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
  
  // Determine the title based on the current route and search params
  const getTitle = () => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    
    if (location.pathname === '/owner') {
      return 'Owner Dashboard';
    }
    if (location.pathname === '/dashboard') {
      return isOwner ? 'Subscriber View' : 'Dashboard';
    }
    if (location.pathname === '/figmant' || location.pathname === '/') {
      // Check if we're in wizard mode for premium analysis
      if (mode === 'wizard') {
        return 'Premium Analysis Wizard';
      }
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
    // Check for wizard mode
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('mode') === 'wizard') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Wizard Mode
        </Badge>
      );
    }
    return null;
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
