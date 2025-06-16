
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  Star,
  ArrowRight,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useDesignUploads } from '@/hooks/useDesignUploads';

export const DashboardPage: React.FC = () => {
  const { data: analyses = [] } = useDesignAnalyses();
  const { data: uploads = [] } = useDesignUploads();

  const recentAnalyses = analyses.slice(0, 3);
  const completedAnalyses = analyses.filter(a => a.confidence_score && a.confidence_score > 0.7).length;
  const averageScore = analyses.length > 0 
    ? analyses.reduce((acc, a) => acc + (a.confidence_score || 0), 0) / analyses.length 
    : 0;

  const stats = [
    {
      title: 'Total Analyses',
      value: analyses.length.toString(),
      description: 'Completed this month',
      icon: FileText,
      trend: '+12%'
    },
    {
      title: 'Avg. Score',
      value: `${Math.round(averageScore * 100)}%`,
      description: 'Design quality score',
      icon: TrendingUp,
      trend: '+5%'
    },
    {
      title: 'Completed',
      value: completedAnalyses.toString(),
      description: 'High-quality analyses',
      icon: Target,
      trend: '+8%'
    },
    {
      title: 'Credits Used',
      value: '47',
      description: 'This billing cycle',
      icon: Zap,
      trend: '23 remaining'
    }
  ];

  const quickActions = [
    {
      title: 'New Analysis',
      description: 'Start analyzing a new design',
      icon: FileText,
      color: 'bg-blue-500',
      action: () => console.log('New analysis')
    },
    {
      title: 'Premium Analysis',
      description: 'Get advanced insights',
      icon: Star,
      color: 'bg-purple-500',
      action: () => console.log('Premium analysis')
    },
    {
      title: 'View Templates',
      description: 'Browse analysis templates',
      icon: Award,
      color: 'bg-green-500',
      action: () => console.log('Templates')
    }
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's an overview of your design analysis activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-600">{stat.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={action.action}
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-4`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-gray-500">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Analyses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Analyses</CardTitle>
                <CardDescription>Your latest design evaluations</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnalyses.length > 0 ? (
                  recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {analysis.analysis_type} Analysis
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {Math.round((analysis.confidence_score || 0) * 100)}%
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No analyses yet</p>
                    <p className="text-sm text-gray-400">Start your first analysis to see it here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Your analysis quality trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Quality Score</span>
                  <span>{Math.round(averageScore * 100)}%</span>
                </div>
                <Progress value={averageScore * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completion Rate</span>
                  <span>{analyses.length > 0 ? Math.round((completedAnalyses / analyses.length) * 100) : 0}%</span>
                </div>
                <Progress 
                  value={analyses.length > 0 ? (completedAnalyses / analyses.length) * 100 : 0} 
                  className="h-2" 
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span>This Month's Progress</span>
                  <Badge variant="secondary">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15%
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  You're improving! Keep up the great work.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights & Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              AI Insights & Tips
            </CardTitle>
            <CardDescription>Personalized recommendations based on your analysis patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Design Consistency</h4>
                <p className="text-sm text-blue-700">
                  Your recent analyses show strong typography choices. Consider exploring color harmony in your next designs.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Premium Opportunity</h4>
                <p className="text-sm text-green-700">
                  You're ready for premium analysis! Get 3x more detailed insights and competitive analysis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
