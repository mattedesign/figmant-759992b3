
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, MousePointer, ShoppingCart, CreditCard, CheckCircle } from 'lucide-react';

export const UserJourneyMap = () => {
  const journeySteps = [
    {
      step: 'Landing',
      icon: MousePointer,
      users: 1000,
      conversionRate: 100,
      avgTime: '45s',
      dropoffRate: 0,
      color: 'bg-blue-500'
    },
    {
      step: 'Browse',
      icon: MousePointer,
      users: 850,
      conversionRate: 85,
      avgTime: '2m 30s',
      dropoffRate: 15,
      color: 'bg-green-500'
    },
    {
      step: 'Product View',
      icon: MousePointer,
      users: 680,
      conversionRate: 68,
      avgTime: '3m 15s',
      dropoffRate: 20,
      color: 'bg-yellow-500'
    },
    {
      step: 'Add to Cart',
      icon: ShoppingCart,
      users: 340,
      conversionRate: 34,
      avgTime: '1m 20s',
      dropoffRate: 50,
      color: 'bg-orange-500'
    },
    {
      step: 'Checkout',
      icon: CreditCard,
      users: 238,
      conversionRate: 24,
      avgTime: '4m 45s',
      dropoffRate: 30,
      color: 'bg-red-500'
    },
    {
      step: 'Purchase',
      icon: CheckCircle,
      users: 190,
      conversionRate: 19,
      avgTime: '2m 10s',
      dropoffRate: 20,
      color: 'bg-purple-500'
    }
  ];

  const painPoints = [
    {
      step: 'Product View → Add to Cart',
      issue: 'High dropoff (50%)',
      suggestion: 'Simplify add-to-cart process, improve product information',
      severity: 'critical'
    },
    {
      step: 'Add to Cart → Checkout',
      issue: 'Medium dropoff (30%)',
      suggestion: 'Reduce checkout form complexity, add guest checkout',
      severity: 'high'
    },
    {
      step: 'Checkout → Purchase',
      issue: 'Payment friction (20%)',
      suggestion: 'Add more payment options, improve trust signals',
      severity: 'medium'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

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
                      <div className="text-xs text-red-500 mt-1">
                        -{journeySteps[index + 1].dropoffRate}%
                      </div>
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
            {journeySteps.map((step, index) => (
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
            {painPoints.map((point, index) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
