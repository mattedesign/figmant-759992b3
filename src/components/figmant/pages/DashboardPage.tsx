
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, FileText, Clock, Target } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const metrics = [
    {
      title: 'Total Analyses',
      value: '24',
      change: '+12%',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Credits Used',
      value: '60/110',
      change: '45%',
      icon: Target,
      color: 'text-green-600'
    },
    {
      title: 'Success Rate',
      value: '94%',
      change: '+3%',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Avg. Response Time',
      value: '2.3s',
      change: '-0.5s',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  const recentAnalyses = [
    { name: 'E-commerce Homepage', date: '2 hours ago', status: 'Completed', score: '92%' },
    { name: 'Mobile App UI', date: '1 day ago', status: 'Completed', score: '88%' },
    { name: 'Landing Page', date: '2 days ago', status: 'Completed', score: '95%' },
    { name: 'Dashboard Design', date: '3 days ago', status: 'Completed', score: '91%' }
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Overview of your design analysis activities and performance
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className={`text-sm ${metric.color}`}>{metric.change}</p>
                  </div>
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>Your latest design analysis results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnalyses.map((analysis, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{analysis.name}</p>
                      <p className="text-sm text-gray-600">{analysis.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {analysis.status}
                      </span>
                      <p className="text-sm font-medium mt-1">{analysis.score}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Key insights from your analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Usability Score</span>
                    <span className="text-sm text-gray-600">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Accessibility</span>
                    <span className="text-sm text-gray-600">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Visual Design</span>
                    <span className="text-sm text-gray-600">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Performance</span>
                    <span className="text-sm text-gray-600">84%</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium mb-1">New Analysis</h3>
                <p className="text-sm text-gray-600">Start analyzing a new design</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium mb-1">View Reports</h3>
                <p className="text-sm text-gray-600">Check your analysis history</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium mb-1">Share Results</h3>
                <p className="text-sm text-gray-600">Collaborate with your team</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
