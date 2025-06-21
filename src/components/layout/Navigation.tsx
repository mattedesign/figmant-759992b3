
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { useTemplateCreditStore } from '@/stores/templateCreditStore';
import { CreditCard } from 'lucide-react';

interface NavigationProps {
  showSidebarTrigger?: boolean;
}

const getCreditBadgeStyle = (creditCost: number) => {
  if (creditCost >= 5) {
    return "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none";
  }
  if (creditCost >= 3) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }
  return "bg-gray-100 text-gray-700 border-gray-200";
};

export const Navigation = ({ showSidebarTrigger = false }: NavigationProps) => {
  const { user, isOwner } = useAuth();
  const location = useLocation();
  const { currentCreditCost } = useTemplateCreditStore();
  
  // Determine the title based on the current route and search params
  const getTitle = () => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    const tab = searchParams.get('tab');
    
    if (location.pathname === '/owner') {
      return 'Owner Dashboard';
    }
    if (location.pathname === '/dashboard') {
      if (tab === 'wizard-analysis') {
        return 'Wizard Analysis';
      }
      return isOwner ? 'Subscriber View' : 'Dashboard';
    }
    if (location.pathname === '/figmant' || location.pathname === '/') {
      if (tab === 'wizard-analysis') {
        return 'Wizard Analysis';
      }
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
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
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
    
    // Badge for direct wizard analysis
    if (tab === 'wizard-analysis') {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Wizard Mode
        </Badge>
      );
    }
    
    // Badge for wizard mode in premium analysis
    if (searchParams.get('mode') === 'wizard') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Premium Wizard
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
                {/* Dynamic Credit Cost Display from global store */}
                <Badge className={`flex items-center gap-1 ${getCreditBadgeStyle(currentCreditCost)}`}>
                  <CreditCard className="h-3 w-3" />
                  {currentCreditCost} Credit{currentCreditCost !== 1 ? 's' : ''}
                </Badge>
                <UserMenu />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
