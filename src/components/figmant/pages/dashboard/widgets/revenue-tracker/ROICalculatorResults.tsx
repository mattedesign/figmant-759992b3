
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, Sparkles } from 'lucide-react';
import { ROICalculations } from './types';

interface ROICalculatorResultsProps {
  roiCalculations: ROICalculations;
}

export const ROICalculatorResults: React.FC<ROICalculatorResultsProps> = ({
  roiCalculations
}) => {
  return (
    <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="h-4 w-4 text-green-600" />
        <h3 className="font-semibold text-sm">Projected Impact</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            +{roiCalculations.estimated_conversion_improvement.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">Conversion Boost</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            ${Math.round(roiCalculations.monthly_revenue_impact).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Monthly Revenue</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {roiCalculations.roi_percentage.toFixed(0)}%
          </div>
          <div className="text-xs text-muted-foreground">Annual ROI</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {roiCalculations.payback_period.toFixed(1)}
          </div>
          <div className="text-xs text-muted-foreground">Months Payback</div>
        </div>
      </div>

      {roiCalculations.monthly_revenue_impact > 0 && (
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="text-sm text-muted-foreground">
            Implementation cost: ${roiCalculations.implementation_cost.toLocaleString()}
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Sparkles className="h-4 w-4 mr-2" />
            Implement Suggestions
          </Button>
        </div>
      )}
    </div>
  );
};
