
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, User, Clock } from 'lucide-react';
import { RecommendationCardProps } from '@/types/contextualAnalysis';

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  attachments,
  onAttachmentClick,
  className = ''
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'conversion':
        return <TrendingUp className="h-4 w-4" />;
      case 'ux':
        return <User className="h-4 w-4" />;
      case 'performance':
        return <Clock className="h-4 w-4" />;
      default:
        return <ArrowRight className="h-4 w-4" />;
    }
  };

  const relatedAttachments = attachments.filter(att => 
    recommendation.relatedAttachmentIds.includes(att.id)
  );

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getCategoryIcon(recommendation.category)}
              <CardTitle className="text-lg">{recommendation.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={getPriorityColor(recommendation.priority)}
              >
                {recommendation.priority} priority
              </Badge>
              <Badge variant="secondary">
                {recommendation.confidence}% confidence
              </Badge>
              <Badge variant="outline">
                {recommendation.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          {recommendation.description}
        </p>
        
        {recommendation.suggestedActions && recommendation.suggestedActions.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-900 mb-2">Suggested Actions:</h4>
            <ul className="space-y-1">
              {recommendation.suggestedActions.map((action, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {recommendation.estimatedImpact && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm text-blue-900 mb-2">Expected Impact:</h4>
            <div className="space-y-1 text-sm">
              {recommendation.estimatedImpact.conversionLift && (
                <p className="text-blue-700">
                  <span className="font-medium">Conversion Lift:</span> {recommendation.estimatedImpact.conversionLift}
                </p>
              )}
              {recommendation.estimatedImpact.userExperience && (
                <p className="text-blue-700">
                  <span className="font-medium">User Experience:</span> {recommendation.estimatedImpact.userExperience}
                </p>
              )}
              {recommendation.estimatedImpact.implementation && (
                <p className="text-blue-700">
                  <span className="font-medium">Implementation:</span> {recommendation.estimatedImpact.implementation} effort
                </p>
              )}
            </div>
          </div>
        )}
        
        {relatedAttachments.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-900 mb-2">Related Files:</h4>
            <div className="flex flex-wrap gap-2">
              {relatedAttachments.map((attachment) => (
                <Button
                  key={attachment.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onAttachmentClick?.(attachment)}
                  className="h-8"
                >
                  {attachment.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
