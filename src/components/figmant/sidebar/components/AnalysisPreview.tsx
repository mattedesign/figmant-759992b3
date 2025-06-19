
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileImage, Link, MessageSquare, BarChart3 } from 'lucide-react';

interface AnalysisPreviewProps {
  analysis: any;
}

export const AnalysisPreview: React.FC<AnalysisPreviewProps> = ({ analysis }) => {
  const getAnalysisPreview = (analysis: any) => {
    if (analysis.type === 'chat') {
      return truncateText(analysis.prompt_used || 'Chat analysis');
    }
    return truncateText(analysis.analysis_results?.analysis || 'Design analysis');
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getAttachmentSummary = () => {
    const attachments = [];
    
    // Check for file attachments
    const fileCount = analysis.fileCount || 0;
    if (fileCount > 0) {
      attachments.push({
        type: 'files',
        count: fileCount,
        icon: FileImage,
        label: `${fileCount} file${fileCount > 1 ? 's' : ''}`
      });
    }

    // Check for URL attachments from chat analysis
    if (analysis.type === 'chat' && analysis.analysis_results?.upload_ids?.length > 0) {
      const urlCount = analysis.analysis_results.upload_ids.length;
      attachments.push({
        type: 'urls',
        count: urlCount,
        icon: Link,
        label: `${urlCount} link${urlCount > 1 ? 's' : ''}`
      });
    }

    // Check for design files
    if (analysis.type === 'design') {
      attachments.push({
        type: 'design',
        count: 1,
        icon: BarChart3,
        label: 'Design file'
      });
    }

    return attachments;
  };

  const attachments = getAttachmentSummary();

  return (
    <div className="mt-2 space-y-2">
      {/* Preview Text */}
      <div>
        <p className="text-xs font-medium text-gray-700 mb-1">Preview:</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          {getAnalysisPreview(analysis)}
        </p>
      </div>

      {/* Attachments Summary */}
      {attachments.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Content:</p>
          <div className="flex flex-wrap gap-1">
            {attachments.map((attachment, index) => {
              const IconComponent = attachment.icon;
              return (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-2 py-0.5 h-5 flex items-center gap-1"
                >
                  <IconComponent className="w-3 h-3" />
                  {attachment.label}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Analysis Metrics */}
      {analysis.impact_summary?.key_metrics && (
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Key Insights:</p>
          <div className="flex flex-wrap gap-1">
            {analysis.impact_summary.key_metrics.overall_score && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5 h-5">
                Score: {analysis.impact_summary.key_metrics.overall_score}/10
              </Badge>
            )}
            {analysis.impact_summary.key_metrics.improvement_areas?.length > 0 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 h-5">
                {analysis.impact_summary.key_metrics.improvement_areas.length} improvements
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
