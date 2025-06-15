
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, MousePointer, Upload, Activity, Eye, CreditCard, CheckCircle } from 'lucide-react';
import { useUserJourneyAnalytics } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

const stepConfig: { [key: string]: { icon: React.ElementType; color: string; avgTime: string } } = {
  'Landing': { icon: MousePointer, color: 'bg-blue-500', avgTime: '45s' },
  'Dashboard': { icon: Activity, color: 'bg-teal-500', avgTime: '1m 10s' },
  'Upload': { icon: Upload, color: 'bg-green-500', avgTime: '2m 30s' },
  'Analysis': { icon: CreditCard, color: 'bg-yellow-500', avgTime: '3m 15s' },
  'View Result': { icon: Eye, color: 'bg-orange-500', avgTime: '1m 20s' },
  'Purchase': { icon: CheckCircle, color: 'bg-purple-500', avgTime: '2m 10s' },
};

export const UserJourneyMap = () => {
  const { data: rawJourneyData, isLoading } = useUserJourneyAnalytics();

  const journeySteps = (rawJourneyData || [])
    .map((step, index, arr) => {
      const totalUsers = arr[0]?.user_count || 0;
      const previousStepUsers = index > 0 ? arr[index - 1].user_count : step.user_count;
      
      const config = stepConfig[step.step_name] || { icon: MousePointer, color: 'bg-gray-500', avgTime: 'N/A' };
      
      return {
        step: step.step_name,
        icon: config.icon,
        users: step.user_count,
        conversionRate: totalUsers > 0 ? Math.round((step.user_count / totalUsers) * 100) : 0,
        avgTime: config.avgTime,
        dropoffRate: previousStepUsers > 0 && index > 0 && previousStepUsers > step.user_count ? Math.round(((previousStepUsers - step.user_count) / previousStepUsers) * 100) : 0,
        color: config.color,
      };
    });

  const painPoints = [];
  if (journeySteps.length > 1) {
    for (let i = 0; i < journeySteps.length - 1; i++) {
      const dropoff = journeySteps[i+1].dropoffRate;
      if (dropoff > 25) {
        let severity = 'medium';
        if (dropoff > 50) severity = 'critical';
        else if (dropoff > 35) severity = 'high';

        painPoints.push({
          step: `${journeySteps[i].step} → ${journeySteps[i+1].step}`,
          issue: `High dropoff (${dropoff}%)`,
          suggestion: `Investigate user behavior between these steps. Consider simplifying the flow or providing clearer instructions.`,
          severity,
        });
      }
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Journey Flow</CardTitle>
          <CardDescription>
            Complete path from landing to conversion with key metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between overflow-x-auto pb-4">
              {journeySteps.map((step, index) => (
                <div key={step.step} className="flex items-center">
                  <div className="flex flex-col items-center space-y-2 min-w-[120px]">
                    <div className={`p-3 rounded-full text-white ${step.color}`}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{step.step}</div>
                      <div className="text-2xl font-bold">{step.users}</div>
                      <div className="text-xs text-muted-foreground">{step.conversionRate}%</div>
                    </div>
                    <div className="text-xs text-center">
                      <div>Avg: {step.avgTime}</div>
                      {step.dropoffRate > 0 && (
                        <div className="text-red-500">-{step.dropoffRate}%</div>
                      )}
                    </div>
                  </div>
                  
                  {index < journeySteps.length - 1 && (
                    <div className="mx-4 flex flex-col items-center">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                      {journeySteps[index + 1].dropoffRate > 0 &&
                        <div className="text-xs text-red-500 mt-1">
                          -{journeySteps[index + 1].dropoffRate}%
                        </div>
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel Analysis</CardTitle>
          <CardDescription>
            Step-by-step conversion rates and optimization opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journeySteps.map((step) => (
              <div key={step.step} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{step.step}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{step.users} users</span>
                    <span className="text-sm text-muted-foreground">
                      ({step.conversionRate}%)
                    </span>
                  </div>
                </div>
                <Progress value={step.conversionRate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Identified Pain Points</CardTitle>
          <CardDescription>
            Areas with high dropoff rates and optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {painPoints.length > 0 ? painPoints.map((point, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{point.step}</h4>
                  <Badge variant="secondary" className={getSeverityColor(point.severity)}>
                    {point.severity}
                  </Badge>
                </div>
                <p className="text-sm text-red-600">{point.issue}</p>
                <p className="text-sm text-muted-foreground">{point.suggestion}</p>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">No significant pain points identified. Great job!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
