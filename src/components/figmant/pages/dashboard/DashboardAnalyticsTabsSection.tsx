
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Activity, Zap } from 'lucide-react';
import { RevenueImpactTracker } from './widgets/revenue-tracker/RevenueImpactTracker';
import { AnalyticsMetricsGrid } from '../../analytics/components/AnalyticsMetricsGrid';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

interface DashboardAnalyticsTabsSectionProps {
  dataStats: any;
  analysisData: any[];
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  className?: string;
}

export const DashboardAnalyticsTabsSection: React.FC<DashboardAnalyticsTabsSectionProps> = ({
  dataStats,
  analysisData,
  realData,
  className
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const getCardClasses = () => {
    if (isMobile) {
      return "w-full shadow-sm";
    }
    return "w-full";
  };

  const getHeaderClasses = () => {
    if (isMobile) {
      return "pb-3";
    }
    return "";
  };

  const getTitleClasses = () => {
    if (isMobile) {
      return "text-lg font-semibold";
    }
    return "text-lg font-semibold";
  };

  const getTabsListClasses = () => {
    if (isMobile) {
      return "grid w-full grid-cols-2 h-auto";
    }
    if (isTablet) {
      return "grid w-full grid-cols-4 h-auto";
    }
    return "grid w-full grid-cols-4";
  };

  const getTabTriggerClasses = () => {
    if (isMobile) {
      return "flex flex-col items-center gap-1 py-3 px-2 text-xs";
    }
    if (isTablet) {
      return "flex flex-col items-center gap-1 py-3 px-3 text-sm";
    }
    return "flex flex-col items-center gap-2 py-3";
  };

  const getIconSize = () => {
    if (isMobile) {
      return "h-4 w-4";
    }
    return "h-5 w-5";
  };

  const getContentPadding = () => {
    if (isMobile) {
      return "p-3";
    }
    if (isTablet) {
      return "p-4";
    }
    return "p-6";
  };

  // Mobile-specific tab arrangement
  const mobileTabsFirst = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'revenue',
      label: 'Revenue',
      icon: TrendingUp,
      badge: 'ROI'
    }
  ];

  const mobileTabsSecond = [
    {
      id: 'performance',
      label: 'Performance',
      icon: Activity,
      badge: 'Live'
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: Zap,
      badge: 'AI'
    }
  ];

  const allTabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'revenue',
      label: 'Revenue Impact',
      icon: TrendingUp,
      badge: 'ROI'
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: Activity,
      badge: 'Live'
    },
    {
      id: 'insights',
      label: 'AI Insights',
      icon: Zap,
      badge: 'AI'
    }
  ];

  const tabs = isMobile ? [...mobileTabsFirst, ...mobileTabsSecond] : allTabs;

  return (
    <div className={className}>
      <Card className={getCardClasses()}>
        <CardHeader className={getHeaderClasses()}>
          <CardTitle className={getTitleClasses()}>
            {isMobile ? 'Analytics' : 'Business Intelligence Dashboard'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className={getContentPadding()}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={getTabsListClasses()}>
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id} 
                    className={getTabTriggerClasses()}
                  >
                    <div className="flex items-center gap-1">
                      <IconComponent className={getIconSize()} />
                      {tab.badge && (
                        <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                          {tab.badge}
                        </Badge>
                      )}
                    </div>
                    <span className={isMobile ? 'text-xs' : 'text-sm'}>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-4 sm:mt-6">
              <TabsContent value="overview" className="mt-0">
                <AnalyticsMetricsGrid dataStats={dataStats} className="w-full" />
              </TabsContent>

              <TabsContent value="revenue" className="mt-0">
                <RevenueImpactTracker 
                  analysisData={analysisData}
                  realData={realData}
                  className="w-full"
                />
              </TabsContent>

              <TabsContent value="performance" className="mt-0">
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Performance Analytics
                  </h3>
                  <p className="text-gray-600">
                    {isMobile ? 'Coming soon' : 'Real-time performance metrics and analytics coming soon'}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="mt-0">
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI Insights
                  </h3>
                  <p className="text-gray-600">
                    {isMobile ? 'Coming soon' : 'AI-powered insights and recommendations coming soon'}
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
