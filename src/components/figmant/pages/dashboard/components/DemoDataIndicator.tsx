
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Database, TrendingUp, Target } from 'lucide-react';

interface DemoDataIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export const DemoDataIndicator: React.FC<DemoDataIndicatorProps> = ({
  showDetails = false,
  className = ""
}) => {
  const dataSourceBreakdown = [
    {
      category: 'AI Performance',
      source: 'Real Supabase Data',
      description: 'Claude analysis results, confidence scores, processing times',
      icon: Database,
      color: 'text-green-600'
    },
    {
      category: 'Business Projections',
      source: 'Calculated from Real Data',
      description: 'ROI projections based on actual AI analysis depth and confidence',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      category: 'Industry Benchmarks',
      source: 'Market Research',
      description: 'UX optimization benchmarks from industry studies',
      icon: Target,
      color: 'text-purple-600'
    }
  ];

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Info className="h-4 w-4 text-blue-600" />
        <span className="text-sm text-gray-600">
          Demo uses real AI data + calculated business projections
        </span>
        <Badge className="bg-blue-100 text-blue-800 text-xs">
          Live + Calculated
        </Badge>
      </div>
    );
  }

  return (
    <Card className={`border-l-4 border-l-blue-500 ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">
              Demo Data Strategy
            </h4>
            <Badge className="bg-blue-100 text-blue-800">
              Executive Ready
            </Badge>
          </div>
          
          <p className="text-sm text-gray-700 leading-relaxed">
            This dashboard demonstrates a production-ready approach that combines real AI performance 
            data with calculated business impact projections, creating compelling executive presentations 
            perfect for prospect demonstrations and stakeholder reporting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {dataSourceBreakdown.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  <span className="font-medium text-sm">{item.category}</span>
                </div>
                <div className="text-xs text-gray-600 mb-1 font-medium">
                  {item.source}
                </div>
                <div className="text-xs text-gray-500">
                  {item.description}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-sm font-medium text-green-800 mb-1">
              Perfect for Sales Demonstrations
            </div>
            <div className="text-xs text-green-700">
              Real AI accuracy metrics + calculated business value = compelling ROI story for prospects
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
