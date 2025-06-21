
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Zap, CheckCircle, Gift } from 'lucide-react';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

interface ProfileCompletionBannerProps {
  onSectionSelect: (section: string) => void;
  onDismiss: () => void;
  isDismissed: boolean;
}

export const ProfileCompletionBanner: React.FC<ProfileCompletionBannerProps> = ({
  onSectionSelect,
  onDismiss,
  isDismissed
}) => {
  const {
    completionPercentage,
    nextSuggestion,
    isComplete,
    getSectionDisplayName,
    getSectionDescription,
    getCompletionRewards
  } = useProfileCompletion();

  if (isDismissed || isComplete || completionPercentage >= 90) {
    return null;
  }

  const rewards = getCompletionRewards();
  const hasNewRewards = completionPercentage >= 50 && rewards.length > 0;

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-full mt-1">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-amber-900">
                  Complete Your Profile ({completionPercentage}%)
                </h3>
                {hasNewRewards && (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                    <Gift className="h-3 w-3 mr-1" />
                    Rewards Available
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-amber-700 mb-3">
                {nextSuggestion ? (
                  <>
                    Next: Add your <strong>{getSectionDisplayName(nextSuggestion).toLowerCase()}</strong> to unlock more features and earn rewards.
                  </>
                ) : (
                  'Complete the remaining sections to unlock all features and earn badges.'
                )}
              </p>

              <div className="flex items-center gap-3">
                {nextSuggestion && (
                  <Button
                    size="sm"
                    onClick={() => onSectionSelect(nextSuggestion)}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete {getSectionDisplayName(nextSuggestion)}
                  </Button>
                )}
                
                {hasNewRewards && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-600">Earn:</span>
                    {rewards.slice(0, 2).map((reward, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-amber-300">
                        {reward}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
