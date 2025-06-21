
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Award, Zap, ArrowRight } from 'lucide-react';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

interface ProfileCompletionProgressProps {
  onSectionChange: (section: string) => void;
  currentSection: string;
}

export const ProfileCompletionProgress: React.FC<ProfileCompletionProgressProps> = ({
  onSectionChange,
  currentSection
}) => {
  const {
    completionPercentage,
    completedSections,
    missingSections,
    nextSuggestion,
    completionStatus,
    isComplete,
    getSectionDisplayName,
    getSectionDescription,
    getCompletionRewards
  } = useProfileCompletion();

  const rewards = getCompletionRewards();

  if (isComplete) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Profile Complete!</h3>
              <p className="text-sm text-green-700">
                Congratulations! Your profile is 100% complete.
              </p>
            </div>
          </div>
          
          {rewards.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {rewards.map((reward, index) => (
                <Badge key={index} className="bg-green-100 text-green-800 border-green-200">
                  <Award className="h-3 w-3 mr-1" />
                  {reward}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900">Profile Completion</CardTitle>
          <Badge variant="outline" className="bg-white">
            {completionPercentage}% Complete
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-700">Progress</span>
            <span className="text-blue-600 font-medium">{completedSections.length} of 6 sections</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {nextSuggestion && (
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-900">Next Step</span>
                </div>
                <h4 className="font-medium text-gray-900">
                  {getSectionDisplayName(nextSuggestion)}
                </h4>
                <p className="text-sm text-gray-600">
                  {getSectionDescription(nextSuggestion)}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => onSectionChange(nextSuggestion)}
                className="ml-3"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-900 mb-3">Section Status</h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(completionStatus).map(([section, isCompleted]) => (
              <div
                key={section}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                  currentSection === section
                    ? 'bg-blue-100 border border-blue-300'
                    : 'hover:bg-white/50'
                }`}
                onClick={() => onSectionChange(section)}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400" />
                )}
                <span className={`text-sm ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                  {getSectionDisplayName(section)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {rewards.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-900">Available Rewards</h4>
            <div className="flex flex-wrap gap-2">
              {rewards.map((reward, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  {reward}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
