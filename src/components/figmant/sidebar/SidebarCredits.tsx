
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface SidebarCreditsProps {
  currentBalance: number;
  totalPurchased: number;
  creditsLoading: boolean;
}

export const SidebarCredits: React.FC<SidebarCreditsProps> = ({
  currentBalance,
  totalPurchased,
  creditsLoading
}) => {
  const navigate = useNavigate();
  const progressPercentage = totalPurchased > 0 ? (currentBalance / totalPurchased) * 100 : 0;

  const handleBuyMoreCredits = () => {
    navigate('/subscription');
  };

  console.log('SidebarCredits props:', { currentBalance, totalPurchased, creditsLoading });

  return (
    <div className="p-4 border-t border-gray-200/30">
      <div className="bg-gray-50/80 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Credits</span>
          <span className="text-sm font-medium text-gray-900">
            {creditsLoading ? (
              <div className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>...</span>
              </div>
            ) : (
              `${currentBalance || 0}/${totalPurchased || 0}`
            )}
          </span>
        </div>
        
        <Progress 
          value={progressPercentage} 
          className="h-2"
        />
        
        <Button 
          onClick={handleBuyMoreCredits}
          className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
          variant="outline"
        >
          Buy More
        </Button>
      </div>
    </div>
  );
};
