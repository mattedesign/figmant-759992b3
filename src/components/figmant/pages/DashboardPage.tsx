
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  FileText, 
  Clock, 
  Star,
  ArrowRight,
  Activity,
  BarChart3,
  Users,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useDesignUploads } from '@/hooks/useDesignUploads';

export const DashboardPage: React.FC = () => {
  const { data: analyses = [] } = useDesignAnalyses();
  const { data: uploads = [] } = useDesignUploads();

  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Mock data for the dashboard
  const recentAnalyses = [
    {
      id: 1,
      title: 'Analysis 1',
      status: 'Complete',
      type: 'Comprehensive Analysis',
      score: 62,
      suggestions: 32,
      documents: 2,
      progress: 100
    },
    {
      id: 2,
      title: 'Analysis 1',
      status: 'Completed',
      type: 'Comprehensive',
      score: 30,
      suggestions: 32,
      documents: 2,
      progress: 100
    },
    {
      id: 3,
      title: 'Analysis 1',
      status: 'Completed',
      type: 'Comprehensive Analysis',
      score: 80,
      suggestions: 32,
      documents: 2,
      progress: 100
    },
    {
      id: 4,
      title: 'Analysis 1',
      status: 'Completed',
      type: 'Comprehensive Analysis',
      score: 40,
      suggestions: 6,
      documents: 2,
      progress: 100
    }
  ];

  const insights = [
    {
      id: 1,
      title: 'Insight #1',
      role: 'Data Analyst Lead',
      change: '+20%',
      totalTask: 16,
      running: 12,
      complete: 4,
      avatar: '👤'
    },
    {
      id: 2,
      title: 'Insight #2',
      role: 'Product Designer',
      change: '+20%',
      totalTask: 16,
      running: 12,
      complete: 4,
      avatar: '👤'
    },
    {
      id: 3,
      title: 'Insight #3',
      role: 'Design Operation Lead',
      change: '+20%',
      totalTask: 16,
      running: 12,
      complete: 4,
      avatar: '👩'
    },
    {
      id: 4,
      title: 'Insight #4',
      role: 'Engineering Lead (Backend)',
      change: '+20%',
      totalTask: 16,
      running: 12,
      complete: 4,
      avatar: '👤'
    },
    {
      id: 5,
      title: 'Insight #5',
      role: 'Product Executive',
      change: '+20%',
      totalTask: 16,
      running: 12,
      complete: 4,
      avatar: '👤'
    }
  ];

  const myPrompts = [
    {
      id: 1,
      title: 'Figma Design System',
      subtitle: 'Update button component',
      date: '26 July',
      status: 'Today'
    },
    {
      id: 2,
      title: 'Project management dash...',
      subtitle: 'Fix errors',
      date: '25 July',
      status: 'Tomorrow'
    },
    {
      id: 3,
      title: 'Meeting with dev. team',
      date: '26 July',
      status: ''
    },
    {
      id: 4,
      title: 'Figma Design System',
      subtitle: 'Update button component',
      date: '26 July',
      status: 'Today'
    },
    {
      id: 5,
      title: 'Fix errors',
      date: '25 July',
      status: ''
    }
  ];

  const notes = [
    {
      title: 'Tomorrow Note',
      items: [
        'Confirm meeting room booking.',
        'Bring a laptop and notepad for taking notes.',
        'Follow up on any action items after the meeting.'
      ]
    },
    {
      title: 'Tomorrow Note',
      items: [
        'Confirm meeting room booking.',
        'Bring a laptop and notepad for taking notes.',
        'Follow up on any action items after the meeting.'
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-gradient-to-r from-green-400 to-blue-500';
    if (score >= 50) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-pink-500';
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600 mb-2">{dateString}</p>
          <h1 className="text-3xl font-bold text-gray-900">Good afternoon, Zakir Hossen</h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recent Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Analysis Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Analysis</h2>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  See all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentAnalyses.map((analysis) => (
                  <Card key={analysis.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">{analysis.title}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className="text-gray-900">{analysis.status}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Analysis Type:</span>
                        <span className="text-gray-900">{analysis.type}</span>
                      </div>
                    </div>

                    <div className="relative mb-3">
                      <div className={`h-2 rounded-full ${getScoreColor(analysis.score)}`} />
                      <div className="absolute right-0 -top-6 text-sm font-medium">
                        {analysis.score}%
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Suggestions: {analysis.suggestions}</span>
                      <span>Documents: {analysis.documents}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Insights and Pattern Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Insights */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Insights</CardTitle>
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      This month
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-600 border-b pb-2">
                      <span>Name & role</span>
                      <span>Total task</span>
                      <span>Running</span>
                      <span>Complete</span>
                    </div>
                    {insights.map((insight) => (
                      <div key={insight.id} className="grid grid-cols-4 gap-4 items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs">{insight.avatar}</span>
                          </div>
                          <div>
                            <div className="font-medium">{insight.title}</div>
                            <div className="text-gray-600 text-xs">{insight.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{insight.totalTask}</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            {insight.change}
                          </Badge>
                        </div>
                        <span>{insight.running}</span>
                        <span>{insight.complete}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pattern Analysis Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Pattern Analysis</CardTitle>
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      This week
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-32">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="2"
                          strokeDasharray="76, 100"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold">76%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span>Total task</span>
                      </div>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span>Running</span>
                      </div>
                      <span className="font-medium">16</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full" />
                        <span>Completed</span>
                      </div>
                      <span className="font-medium">7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* My Prompts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Prompts</CardTitle>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    Today
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myPrompts.map((prompt) => (
                    <div key={prompt.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{prompt.title}</div>
                        {prompt.subtitle && (
                          <div className="text-xs text-gray-600 truncate">{prompt.subtitle}</div>
                        )}
                        <div className="text-xs text-gray-500">{prompt.date}</div>
                      </div>
                      {prompt.status && (
                        <Badge variant="secondary" className={
                          prompt.status === 'Today' ? 'bg-red-100 text-red-800' :
                          prompt.status === 'Tomorrow' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {prompt.status}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Notes</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    Private
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notes.map((note, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-sm mb-2">{note.title}</h4>
                      <ul className="space-y-1">
                        {note.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
