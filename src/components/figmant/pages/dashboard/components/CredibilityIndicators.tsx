
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, Database, TrendingUp, Shield, Clock, CheckCircle } from 'lucide-react';
import { executiveColors, executiveStatus } from './ProfessionalColorScheme';

interface CredibilityIndicatorProps {
  type: 'claude-ai' | 'real-data' | 'projected' | 'verified' | 'real-time' | 'confidence';
  score?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const CredibilityIndicator: React.FC<CredibilityIndicatorProps> = ({
  type,
  score,
  label,
  size = 'md',
  showLabel = true
}) => {
  const getIndicatorConfig = (type: string) => {
    switch (type) {
      case 'claude-ai':
        return {
          icon: Brain,
          label: label || 'Powered by Claude AI',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          iconColor: 'text-purple-600'
        };
      case 'real-data':
        return {
          icon: Database,
          label: label || 'Real Analysis Data',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          iconColor: 'text-blue-600'
        };
      case 'projected':
        return {
          icon: TrendingUp,
          label: label || 'Business Projections',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          iconColor: 'text-emerald-600'
        };
      case 'verified':
        return {
          icon: Shield,
          label: label || 'Verified Methodology',
          color: 'bg-green-100 text-green-800 border-green-200',
          iconColor: 'text-green-600'
        };
      case 'real-time':
        return {
          icon: Clock,
          label: label || 'Live Data',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          iconColor: 'text-orange-600'
        };
      case 'confidence':
        return {
          icon: CheckCircle,
          label: label || `${score?.toFixed(1)}% Confidence`,
          color: score && score >= 85 
            ? 'bg-green-100 text-green-800 border-green-200'
            : score && score >= 70
            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
            : 'bg-red-100 text-red-800 border-red-200',
          iconColor: score && score >= 85 
            ? 'text-green-600'
            : score && score >= 70
            ? 'text-yellow-600'
            : 'text-red-600'
        };
      default:
        return {
          icon: CheckCircle,
          label: label || 'Verified',
          color: 'bg-slate-100 text-slate-800 border-slate-200',
          iconColor: 'text-slate-600'
        };
    }
  };

  const config = getIndicatorConfig(type);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge 
      variant="outline" 
      className={`${config.color} ${sizeClasses[size]} border flex items-center gap-1.5 font-medium`}
    >
      <Icon className={`${iconSizes[size]} ${config.iconColor}`} />
      {showLabel && <span>{config.label}</span>}
    </Badge>
  );
};

interface DataSourceLabelProps {
  source: 'real' | 'projected' | 'hybrid';
  count?: number;
  confidence?: number;
  className?: string;
}

export const DataSourceLabel: React.FC<DataSourceLabelProps> = ({
  source,
  count,
  confidence,
  className = ''
}) => {
  const getSourceConfig = (source: string) => {
    switch (source) {
      case 'real':
        return {
          label: 'Real Analysis Data',
          description: count ? `Based on ${count} actual analyses` : 'Live data from actual analyses',
          color: 'text-blue-700',
          bg: 'bg-blue-50 border-blue-200'
        };
      case 'projected':
        return {
          label: 'Business Projections',
          description: 'AI-powered revenue impact modeling',
          color: 'text-emerald-700',
          bg: 'bg-emerald-50 border-emerald-200'
        };
      case 'hybrid':
        return {
          label: 'Hybrid Analysis',
          description: 'Real data enhanced with AI projections',
          color: 'text-purple-700',
          bg: 'bg-purple-50 border-purple-200'
        };
      default:
        return {
          label: 'Data Source',
          description: 'Methodology not specified',
          color: 'text-slate-700',
          bg: 'bg-slate-50 border-slate-200'
        };
    }
  };

  const config = getSourceConfig(source);

  return (
    <div className={`${config.bg} border rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </div>
          <div className="text-xs text-slate-600">
            {config.description}
          </div>
        </div>
        <div className="flex gap-2">
          {confidence && (
            <CredibilityIndicator 
              type="confidence" 
              score={confidence} 
              size="sm"
              showLabel={false}
            />
          )}
          <CredibilityIndicator 
            type={source === 'real' ? 'real-data' : source === 'projected' ? 'projected' : 'claude-ai'} 
            size="sm"
            showLabel={false}
          />
        </div>
      </div>
    </div>
  );
};

interface MethodologyTooltipProps {
  title: string;
  methodology: string;
  confidence: number;
  dataSources: string[];
  className?: string;
}

export const MethodologyTooltip: React.FC<MethodologyTooltipProps> = ({
  title,
  methodology,
  confidence,
  dataSources,
  className = ''
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-lg p-4 max-w-sm ${className}`}>
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-slate-900 text-sm">{title}</h4>
          <p className="text-xs text-slate-600 mt-1">{methodology}</p>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-700">Confidence Score</span>
            <CredibilityIndicator type="confidence" score={confidence} size="sm" />
          </div>
        </div>
        
        <div>
          <h5 className="text-xs font-medium text-slate-700 mb-2">Data Sources</h5>
          <div className="space-y-1">
            {dataSources.map((source, index) => (
              <div key={index} className="text-xs text-slate-600 flex items-center gap-1">
                <div className="w-1 h-1 bg-slate-400 rounded-full" />
                {source}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
