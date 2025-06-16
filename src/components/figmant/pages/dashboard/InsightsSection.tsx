
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { InsightData } from './types/dashboard';

interface InsightsSectionProps {
  insightsData: InsightData[];
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ insightsData }) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  return (
    <div className={`mb-6 ${isMobile ? 'w-full' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-semibold ${isTablet ? 'text-base' : 'text-lg'}`}>Insights</h2>
        <Button variant="ghost" size="sm" className="text-gray-500">
          This month
        </Button>
      </div>
      
      <div className="space-y-3">
        {!isMobile && !isTablet && (
          <div className="grid grid-cols-12 gap-4 text-sm text-gray-500 px-4">
            <div className="col-span-3">Name & role</div>
            <div className="col-span-2 text-center">Total task</div>
            <div className="col-span-2 text-center">Running</div>
            <div className="col-span-2 text-center">Complete</div>
            <div className="col-span-3"></div>
          </div>
        )}
        
        {insightsData.map((insight, index) => (
          <div 
            key={insight.id} 
            className={`items-center py-3 px-4 hover:bg-gray-50 rounded-lg ${
              isMobile 
                ? 'flex flex-col space-y-2 border border-gray-200 rounded-lg' 
                : isTablet
                ? 'flex items-center justify-between border border-gray-200 rounded-lg py-2'
                : 'grid grid-cols-12 gap-4'
            }`}
          >
            {isMobile ? (
              // Mobile layout: stacked content
              <>
                <div className="flex items-center gap-3 w-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-orange-500' :
                    index === 2 ? 'bg-blue-500' :
                    index === 3 ? 'bg-gray-500' : 'bg-purple-500'
                  }`}>
                    {insight.name.split(' ')[1].slice(-1)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{insight.name}</div>
                    <div className="text-xs text-gray-500">{insight.role}</div>
                  </div>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {insight.change}
                  </div>
                </div>
                <div className="flex justify-between w-full text-sm">
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Total</div>
                    <div className="font-medium">{insight.total}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Running</div>
                    <div className="font-medium">{insight.running}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Complete</div>
                    <div className="font-medium">{insight.complete}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Period</div>
                    <div className="text-xs">{insight.period}</div>
                  </div>
                </div>
              </>
            ) : isTablet ? (
              // Tablet layout: horizontal compact
              <>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-orange-500' :
                    index === 2 ? 'bg-blue-500' :
                    index === 3 ? 'bg-gray-500' : 'bg-purple-500'
                  }`}>
                    {insight.name.split(' ')[1].slice(-1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{insight.name}</div>
                    <div className="text-xs text-gray-500 truncate">{insight.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-gray-600">{insight.total}</span>
                  <span className="text-gray-600">{insight.running}</span>
                  <span className="text-gray-600">{insight.complete}</span>
                  <div className="flex items-center text-green-600 font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {insight.change}
                  </div>
                </div>
              </>
            ) : (
              // Desktop layout: grid
              <>
                <div className="col-span-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-orange-500' :
                    index === 2 ? 'bg-blue-500' :
                    index === 3 ? 'bg-gray-500' : 'bg-purple-500'
                  }`}>
                    {insight.name.split(' ')[1].slice(-1)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{insight.name}</div>
                    <div className="text-xs text-gray-500">{insight.role}</div>
                  </div>
                </div>
                <div className="col-span-2 text-center font-medium">{insight.total}</div>
                <div className="col-span-2 text-center font-medium">{insight.running}</div>
                <div className="col-span-2 text-center font-medium">{insight.complete}</div>
                <div className="col-span-3 flex items-center gap-2">
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {insight.change}
                  </div>
                  <span className="text-xs text-gray-500">{insight.period}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
