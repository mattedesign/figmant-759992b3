
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Award, Target, TrendingUp } from 'lucide-react';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

interface ProfileCompletionSidebarProps {
  onSectionSelect: (section: string) => void;
  currentSection: string;
}

export const ProfileCompletionSidebar: React.FC<ProfileCompletionSidebarProps> = ({
  onSectionSelect,
  currentSection
}) => {
  const {
    completionPercentage,
    completedSections,
    nextSuggestion,
    completionStatus,
    isComplete,
    getSectionDisplayName,
    getCompletionRewards
  } = useProfileCompletion();

  const rewards = getCompletionRewards();

  return (
    <div className="space-y-4">
      {/* Completion Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Profile Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {completionPercentage}%
            </div>
            <p className="text-sm text-gray-600">Complete</p>
          </div>
          
          <Progress value={completionPercentage} className="h-3" />
          
          <div className="text-center text-sm text-gray-600">
            {completedSections.length} of 6 sections completed
          </div>

          {isComplete && (
            <div className="text-center">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Award className="h-3 w-3 mr-1" />
                Profile Complete!
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      {nextSuggestion && !isComplete && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-blue-900">Recommended Next Step</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <h4 className="font-medium text-gray-900 mb-1">
                  {getSectionDisplayName(nextSuggestion)}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Complete this section to improve your profile
                </p>
                <Button
                  size="sm"
                  onClick={() => onSectionSelect(nextSuggestion)}
                  className="w-full"
                >
                  Complete Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Checklist */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Section Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(completionStatus).map(([section, isCompleted]) => (
              <div
                key={section}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                  currentSection === section
                    ? 'bg-blue-100 border border-blue-300'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSectionSelect(section)}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400" />
                )}
                <span className={`text-sm flex-1 ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                  {getSectionDisplayName(section)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards */}
      {rewards.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-amber-900 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Rewards & Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rewards.map((reward, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border border-amber-200">
                  <Award className="h-3 w-3 text-amber-600" />
                  <span className="text-sm text-amber-800">{reward}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Profile Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="p-2 bg-gray-50 rounded">
              <p>💡 Complete your profile to unlock advanced features</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p>🎯 Adding a profile photo increases trust by 40%</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p>🔒 Enable 2FA for enhanced security</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
