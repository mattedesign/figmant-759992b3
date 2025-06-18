
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Calculator, 
  Target,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RevenueImpactTrackerProps {
  analysisData: Array<{
    id: string;
    confidence_score: number;
    impact_summary?: {
      business_impact?: {
        conversion_potential: number;
      };
    };
    suggestions?: any;
  }>;
  className?: string;
}

interface BusinessMetrics {
  current_traffic: number;
  avg_order_value: number;
  current_conversion_rate: number;
}

interface SuccessMetric {
  metric: 'conversion_rate' | 'click_through' | 'engagement';
  before: number;
  after: number;
  percentage_change: number;
  analysis_id: string;
}

export const RevenueImpactTracker: React.FC<RevenueImpactTrackerProps> = ({
  analysisData = [],
  className
}) => {
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics>({
    current_traffic: 10000,
    avg_order_value: 150,
    current_conversion_rate: 2.5
  });

  const [isEditing, setIsEditing] = useState(false);
  
  // Mock success metrics - in production this would come from user tracking
  const [successMetrics] = useState<SuccessMetric[]>([
    {
      metric: 'conversion_rate',
      before: 2.1,
      after: 2.8,
      percentage_change: 33.3,
      analysis_id: 'recent-analysis'
    },
    {
      metric: 'click_through',
      before: 3.2,
      after: 4.1,
      percentage_change: 28.1,
      analysis_id: 'cta-analysis'
    }
  ]);

  // Calculate ROI based on analysis results
  const roiCalculations = useMemo(() => {
    if (!analysisData.length) {
      return {
        estimated_conversion_improvement: 0,
        monthly_revenue_impact: 0,
        implementation_cost: 0,
        roi_percentage: 0,
        payback_period: 0
      };
    }

    // Get average confidence score and conversion potential
    const avgConfidence = analysisData.reduce((sum, analysis) => 
      sum + (analysis.confidence_score || 0), 0) / analysisData.length;
    
    const avgConversionPotential = analysisData.reduce((sum, analysis) => 
      sum + (analysis.impact_summary?.business_impact?.conversion_potential || 6), 0) / analysisData.length;

    // Calculate improvement potential (conservative estimate)
    const improvement_factor = (avgConfidence * avgConversionPotential) / 100;
    const estimated_conversion_improvement = Math.min(improvement_factor * 0.5, 2.0); // Cap at 2% improvement

    // Calculate revenue impact
    const current_monthly_revenue = businessMetrics.current_traffic * 
      (businessMetrics.current_conversion_rate / 100) * 
      businessMetrics.avg_order_value;
    
    const improved_conversion_rate = businessMetrics.current_conversion_rate + estimated_conversion_improvement;
    const improved_monthly_revenue = businessMetrics.current_traffic * 
      (improved_conversion_rate / 100) * 
      businessMetrics.avg_order_value;
    
    const monthly_revenue_impact = improved_monthly_revenue - current_monthly_revenue;

    // Estimate implementation cost (design + dev time)
    const total_suggestions = analysisData.reduce((sum, analysis) => 
      sum + (analysis.suggestions ? Object.keys(analysis.suggestions).length : 0), 0);
    const implementation_cost = total_suggestions * 500; // $500 per suggestion implementation

    const roi_percentage = implementation_cost > 0 ? 
      ((monthly_revenue_impact * 12 - implementation_cost) / implementation_cost) * 100 : 0;
    
    const payback_period = implementation_cost > 0 ? 
      implementation_cost / monthly_revenue_impact : 0;

    return {
      estimated_conversion_improvement,
      monthly_revenue_impact,
      implementation_cost,
      roi_percentage,
      payback_period,
      current_monthly_revenue,
      improved_monthly_revenue
    };
  }, [analysisData, businessMetrics]);

  const handleMetricsUpdate = (field: keyof BusinessMetrics, value: string) => {
    const numValue = parseFloat(value) || 0;
    setBusinessMetrics(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const suggestions_implemented = successMetrics.length;
  const total_percentage_improvement = successMetrics.reduce((sum, metric) => 
    sum + metric.percentage_change, 0) / successMetrics.length;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Revenue Impact Tracker</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ROI Calculator
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Business Metrics Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Business Metrics</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
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
                  onChange={(e) => handleMetricsUpdate('current_traffic', e.target.value)}
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
                  onChange={(e) => handleMetricsUpdate('avg_order_value', e.target.value)}
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
                  onChange={(e) => handleMetricsUpdate('current_conversion_rate', e.target.value)}
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

        {/* ROI Calculator Results */}
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

        {/* Success Tracking */}
        {successMetrics.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold text-sm">Success Tracking</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Suggestions Implemented</span>
                  <Badge variant="outline">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {suggestions_implemented}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg Improvement</span>
                  <span className="text-sm font-semibold text-green-600">
                    +{total_percentage_improvement.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                {successMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{metric.metric.replace('_', ' ')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {metric.before}% → {metric.after}%
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        +{metric.percentage_change.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {analysisData.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-semibold text-sm mb-2">No Analysis Data</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Run design analyses to see revenue impact projections
            </p>
            <Button size="sm">
              Start Analysis
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
