
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BusinessMetrics } from './types';

interface BusinessMetricsSectionProps {
  businessMetrics: BusinessMetrics;
  isEditing: boolean;
  onToggleEditing: () => void;
  onMetricsUpdate: (field: keyof BusinessMetrics, value: string) => void;
}

export const BusinessMetricsSection: React.FC<BusinessMetricsSectionProps> = ({
  businessMetrics,
  isEditing,
  onToggleEditing,
  onMetricsUpdate
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Business Metrics</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onToggleEditing}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="traffic" className="text-xs">Monthly Traffic</Label>
          {isEditing ? (
            <Input
              id="traffic"
              type="number"
              value={businessMetrics.current_traffic}
              onChange={(e) => onMetricsUpdate('current_traffic', e.target.value)}
              className="h-8 text-sm"
            />
          ) : (
            <div className="text-lg font-semibold">
              {businessMetrics.current_traffic.toLocaleString()}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="aov" className="text-xs">Avg Order Value</Label>
          {isEditing ? (
            <Input
              id="aov"
              type="number"
              value={businessMetrics.avg_order_value}
              onChange={(e) => onMetricsUpdate('avg_order_value', e.target.value)}
              className="h-8 text-sm"
            />
          ) : (
            <div className="text-lg font-semibold">
              ${businessMetrics.avg_order_value}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="conversion" className="text-xs">Conversion Rate</Label>
          {isEditing ? (
            <Input
              id="conversion"
              type="number"
              step="0.1"
              value={businessMetrics.current_conversion_rate}
              onChange={(e) => onMetricsUpdate('current_conversion_rate', e.target.value)}
              className="h-8 text-sm"
            />
          ) : (
            <div className="text-lg font-semibold">
              {businessMetrics.current_conversion_rate}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
