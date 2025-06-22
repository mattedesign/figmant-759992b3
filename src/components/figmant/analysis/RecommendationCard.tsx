
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, TrendingUp, AlertTriangle, Info, Lightbulb } from 'lucide-react';
import { RecommendationCardProps } from '@/types/contextualAnalysis';
import { AttachmentReference } from './AttachmentReference';

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  attachments,
  onAttachmentClick,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRelatedAttachments = () => {
    return attachments.filter(attachment => 
      recommendation.relatedAttachmentIds.includes(attachment.id)
    );
  };

  const getPriorityIcon = () => {
    switch (recommendation.priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-orange-500 bg-orange-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getCategoryColor = () => {
    switch (recommendation.category) {
      case 'conversion':
        return 'bg-green-100 text-green-800';
      case 'accessibility':
        return 'bg-purple-100 text-purple-800';
      case 'performance':
        return 'bg-yellow-100 text-yellow-800';
      case 'branding':
        return 'bg-pink-100 text-pink-800';
      case 'content':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const relatedAttachments = getRelatedAttachments();

  return (
    <Card className={`border-l-4 ${getPriorityColor()} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {getPriorityIcon()}
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                {recommendation.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getCategoryColor()}>
                  {recommendation.category.charAt(0).toUpperCase() + recommendation.category.slice(1)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {recommendation.confidence}% Confidence
                </Badge>
              </div>
            </div>
          </div>
          
          {relatedAttachments.length > 0 && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description */}
        <div className="text-sm text-gray-700 mb-4 leading-relaxed">
          {recommendation.description.length > 200 && !isExpanded ? (
            <>
              {recommendation.description.substring(0, 200)}...
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-600 text-sm"
                onClick={() => setIsExpanded(true)}
              >
                Read more
              </Button>
            </>
          ) : (
            recommendation.description
          )}
        </div>

        {/* Related Attachments */}
        {relatedAttachments.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">
                Related to {relatedAttachments.length} file{relatedAttachments.length !== 1 ? 's' : ''}:
              </span>
            </div>
            
            <div className="grid gap-2">
              {relatedAttachments.slice(0, isExpanded ? undefined : 2).map((attachment) => (
                <AttachmentReference
                  key={attachment.id}
                  attachment={attachment}
                  onClick={() => onAttachmentClick?.(attachment)}
                  size="small"
                />
              ))}
              
              {!isExpanded && relatedAttachments.length > 2 && (
                <div className="text-xs text-gray-500 text-center py-2">
                  +{relatedAttachments.length - 2} more files
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expanded Content */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-4">
            {recommendation.specificFindings && recommendation.specificFindings.length > 0 && (
              <div>
                <h5 className="font-medium text-sm text-gray-900 mb-2">Specific Findings:</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  {recommendation.specificFindings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {recommendation.suggestedActions && recommendation.suggestedActions.length > 0 && (
              <div>
                <h5 className="font-medium text-sm text-gray-900 mb-2">Suggested Actions:</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  {recommendation.suggestedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {recommendation.estimatedImpact && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-medium text-sm text-gray-900 mb-2">Estimated Impact:</h5>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {recommendation.estimatedImpact.conversionLift && (
                    <div>
                      <span className="text-gray-600">Conversion:</span>
                      <span className="ml-1 font-medium">{recommendation.estimatedImpact.conversionLift}</span>
                    </div>
                  )}
                  {recommendation.estimatedImpact.userExperience && (
                    <div>
                      <span className="text-gray-600">UX:</span>
                      <span className="ml-1 font-medium">{recommendation.estimatedImpact.userExperience}</span>
                    </div>
                  )}
                  {recommendation.estimatedImpact.implementation && (
                    <div>
                      <span className="text-gray-600">Implementation:</span>
                      <span className="ml-1 font-medium capitalize">{recommendation.estimatedImpact.implementation}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
        
        {relatedAttachments.length > 0 && !isExpanded && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(true)}
            className="w-full mt-3"
          >
            View Details & Related Files
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
