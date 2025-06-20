
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CredibilityIndicator, DataSourceLabel } from './CredibilityIndicators';
import { executiveColors, executiveTypography, executiveCards } from './ProfessionalColorScheme';

interface ExecutiveMetricsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ComponentType<{ className?: string }>;
  confidence?: number;
  dataSource: 'real' | 'projected' | 'hybrid';
  methodology?: string;
  subtitle?: string;
  format?: 'currency' | 'percentage' | 'number' | 'duration';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ExecutiveMetricsCard: React.FC<ExecutiveMetricsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  confidence = 85,
  dataSource,
  methodology,
  subtitle,
  format = 'number',
  size = 'md',
  className = ''
}) => {
  const formatValue = (val: string | number, fmt: string) => {
    if (typeof val === 'string') return val;
    
    switch (fmt) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'duration':
        return `${val} days`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const sizeClasses = {
    sm: {
      card: 'p-4',
      value: 'text-xl font-bold',
      title: 'text-sm font-medium',
      icon: 'h-5 w-5'
    },
    md: {
      card: 'p-6',
      value: 'text-2xl font-bold',
      title: 'text-sm font-medium',
      icon: 'h-6 w-6'
    },
    lg: {
      card: 'p-8',
      value: 'text-3xl font-bold',
      title: 'text-base font-medium',
      icon: 'h-8 w-8'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <Card className={`${executiveCards.primary} ${className}`}>
      <CardContent className={currentSize.card}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon className={`${currentSize.icon} text-blue-600`} />
                </div>
              )}
              <div>
                <h3 className={`${currentSize.title} text-slate-700`}>
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <CredibilityIndicator 
                type="confidence" 
                score={confidence} 
                size="sm"
              />
              <CredibilityIndicator 
                type={dataSource === 'real' ? 'real-data' : 'projected'} 
                size="sm"
                showLabel={false}
              />
            </div>
          </div>

          {/* Value */}
          <div className="space-y-2">
            <div className={`${currentSize.value} text-slate-900`}>
              {formatValue(value, format)}
            </div>
            
            {/* Change indicator */}
            {change && (
              <div className="flex items-center gap-2">
                {getTrendIcon(change.trend)}
                <span className={`text-sm font-medium ${getTrendColor(change.trend)}`}>
                  {change.trend === 'up' ? '+' : change.trend === 'down' ? '-' : ''}
                  {Math.abs(change.value)}% {change.period}
                </span>
              </div>
            )}
          </div>

          {/* Data source */}
          <DataSourceLabel 
            source={dataSource}
            confidence={confidence}
            className="text-xs"
          />

          {/* Methodology tooltip trigger */}
          {methodology && (
            <div className="text-xs text-slate-500 border-t pt-2">
              <span className="font-medium">Methodology:</span> {methodology}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ExecutiveMetricsGridProps {
  metrics: Array<{
    id: string;
    title: string;
    value: string | number;
    change?: {
      value: number;
      period: string;
      trend: 'up' | 'down' | 'neutral';
    };
    icon?: React.ComponentType<{ className?: string }>;
    confidence?: number;
    dataSource: 'real' | 'projected' | 'hybrid';
    methodology?: string;
    subtitle?: string;
    format?: 'currency' | 'percentage' | 'number' | 'duration';
  }>;
  columns?: 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ExecutiveMetricsGrid: React.FC<ExecutiveMetricsGridProps> = ({
  metrics,
  columns = 4,
  size = 'md',
  className = ''
}) => {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6 ${className}`}>
      {metrics.map((metric) => (
        <ExecutiveMetricsCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
          confidence={metric.confidence}
          dataSource={metric.dataSource}
          methodology={metric.methodology}
          subtitle={metric.subtitle}
          format={metric.format}
          size={size}
        />
      ))}
    </div>
  );
};
