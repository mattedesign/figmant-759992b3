
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, TrendingUp, Star, Database, Calculator } from 'lucide-react';
import { executiveStatus } from './ProfessionalColorScheme';

interface CredibilityIndicatorsProps {
  dataSource: 'real' | 'calculated' | 'projected';
  confidence?: number;
  className?: string;
}

export const CredibilityIndicators: React.FC<CredibilityIndicatorsProps> = ({
  dataSource,
  confidence = 85,
  className = ""
}) => {
  const getIndicatorConfig = () => {
    switch (dataSource) {
      case 'real':
        return {
          icon: CheckCircle,
          label: 'Real Data',
          className: executiveStatus.active,
          description: 'Live system data'
        };
      case 'calculated':
        return {
          icon: TrendingUp,
          label: 'Calculated',
          className: executiveStatus.processing,
          description: 'Based on real metrics'
        };
      case 'projected':
        return {
          icon: Shield,
          label: 'Projected',
          className: executiveStatus.inactive,
          description: 'Industry benchmarks'
        };
      default:
        return {
          icon: Shield,
          label: 'Unknown',
          className: executiveStatus.error,
          description: 'Data source unknown'
        };
    }
  };

  const config = getIndicatorConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
      {confidence && (
        <span className="text-xs text-gray-600">
          {confidence}% confidence
        </span>
      )}
    </div>
  );
};

interface CredibilityIndicatorProps {
  type: 'confidence' | 'real-data' | 'projected';
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const CredibilityIndicator: React.FC<CredibilityIndicatorProps> = ({
  type,
  score,
  size = 'md',
  showLabel = true,
  className = ""
}) => {
  const getConfig = () => {
    switch (type) {
      case 'confidence':
        return {
          icon: Star,
          label: `${score}% confidence`,
          className: 'bg-blue-100 text-blue-800',
          color: 'text-blue-600'
        };
      case 'real-data':
        return {
          icon: Database,
          label: 'Real Data',
          className: 'bg-green-100 text-green-800',
          color: 'text-green-600'
        };
      case 'projected':
        return {
          icon: Calculator,
          label: 'Projected',
          className: 'bg-purple-100 text-purple-800',
          color: 'text-purple-600'
        };
      default:
        return {
          icon: Shield,
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800',
          color: 'text-gray-600'
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  return (
    <Badge className={`${config.className} ${sizeClasses[size]} ${className}`}>
      <Icon className={`${iconSizes[size]} mr-1`} />
      {showLabel && config.label}
    </Badge>
  );
};

interface DataSourceLabelProps {
  source: 'real' | 'projected' | 'hybrid';
  confidence?: number;
  className?: string;
}

export const DataSourceLabel: React.FC<DataSourceLabelProps> = ({
  source,
  confidence,
  className = ""
}) => {
  const getSourceConfig = () => {
    switch (source) {
      case 'real':
        return {
          label: 'Live Data',
          className: 'text-green-600'
        };
      case 'projected':
        return {
          label: 'Projected',
          className: 'text-blue-600'
        };
      case 'hybrid':
        return {
          label: 'Mixed Data',
          className: 'text-purple-600'
        };
      default:
        return {
          label: 'Unknown',
          className: 'text-gray-600'
        };
    }
  };

  const config = getSourceConfig();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className={`font-medium ${config.className}`}>
        {config.label}
      </span>
      {confidence && (
        <span className="text-gray-500">
          ({confidence}%)
        </span>
      )}
    </div>
  );
};
