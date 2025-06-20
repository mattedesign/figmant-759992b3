
import React from 'react';
import { LoaderCircle, Brain, Search, FileText } from 'lucide-react';

interface AnalysisLoadingIndicatorProps {
  stage: 'idle' | 'sending' | 'processing' | 'analyzing' | 'complete';
  isVisible: boolean;
  className?: string;
}

export const AnalysisLoadingIndicator: React.FC<AnalysisLoadingIndicatorProps> = ({
  stage,
  isVisible,
  className = ''
}) => {
  if (!isVisible || stage === 'idle' || stage === 'complete') {
    return null;
  }

  const getStageInfo = (currentStage: string) => {
    switch (currentStage) {
      case 'sending':
        return {
          icon: FileText,
          title: 'Sending Request',
          description: 'Preparing your competitor analysis...',
          color: 'blue'
        };
      case 'processing':
        return {
          icon: Search,
          title: 'Processing Data',
          description: 'Gathering competitor information...',
          color: 'indigo'
        };
      case 'analyzing':
        return {
          icon: Brain,
          title: 'AI Analysis',
          description: 'Generating insights and recommendations...',
          color: 'purple'
        };
      default:
        return {
          icon: LoaderCircle,
          title: 'Working',
          description: 'Please wait...',
          color: 'blue'
        };
    }
  };

  const stageInfo = getStageInfo(stage);
  const IconComponent = stageInfo.icon;
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700'
  };

  return (
    <div className={`flex items-center gap-3 p-4 border rounded-lg ${colorClasses[stageInfo.color]} ${className}`}>
      <IconComponent className="h-5 w-5 animate-spin" />
      <div className="flex-1">
        <span className="font-medium">{stageInfo.title}</span>
        <p className="text-sm mt-1 opacity-90">
          {stageInfo.description}
        </p>
      </div>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full animate-pulse ${
              stage === 'sending' && i === 0 ? 'bg-current' :
              stage === 'processing' && i === 1 ? 'bg-current' :
              stage === 'analyzing' && i === 2 ? 'bg-current' :
              'bg-current opacity-30'
            }`}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  );
};
