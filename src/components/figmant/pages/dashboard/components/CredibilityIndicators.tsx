
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, TrendingUp } from 'lucide-react';
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
