
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Users, Zap, TrendingUp, MoreHorizontal, Star, Clock, Calendar, FileText, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export const DashboardPage: React.FC = () => {
  const { profile } = useAuth();

  // Get current date and time
  const now = new Date();
  const currentDate = format(now, 'EEEE, MMMM d');
  const currentHour = now.getHours();

  // Determine greeting based on time of day (Title Case)
  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get user's first name from profile
  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    return 'there'; // fallback if no name available
  };

  const analysisData = [
    {
      id: 1,
      title: "Analysis 1",
      status: "Complete",
      type: "Comprehensive Analysis",
      progress: 62,
      suggestions: 32,
      documents: 2
    },
    {
      id: 2,
      title: "Analysis 1", 
      status: "Completed",
      type: "Comprehensive",
      progress: 30,
      suggestions: 32,
      documents: 2
    },
    {
      id: 3,
      title: "Analysis 1",
      status: "Completed", 
      type: "Comprehensive Analysis",
      progress: 80,
      suggestions: 32,
      documents: 2
    },
    {
      id: 4,
      title: "Analysis 1",
      status: "Completed",
      type: "Comprehensive Analysis", 
      progress: 40,
      suggestions: "6/15",
      documents: 2
    }
  ];

  const insightsData = [
    { id: 1, name: "Insight #1", role: "Data Analyst Lead", change: "+20%", period: "Pre-week", total: 16, running: 12, complete: 4 },
    { id: 2, name: "Insight #2", role: "Product Designer", change: "+20%", period: "Pre-week", total: 16, running: 12, complete: 4 },
    { id: 3, name: "Insight #3", role: "Design/Operation Lead", change: "+20%", period: "Pre-week", total: 16, running: 12, complete: 4 },
    { id: 4, name: "Insight #4", role: "Engineering Lead (Backend)", change: "+20%", period: "Pre-week", total: 16, running: 12, complete: 4 },
    { id: 5, name: "Insight #5", role: "Product Executive", change: "+20%", period: "Pre-week", total: 16, running: 12, complete: 4 }
  ];

  const promptsData = [
    { title: "Figma Design System", subtitle: "Update button component", date: "26 July", status: "Today" },
    { title: "Project management dash...", subtitle: "", date: "Tomorrow", status: "" },
    { title: "Fix errors", subtitle: "", date: "26 July", status: "" },
    { title: "Meeting with dev. team", subtitle: "", date: "26 July", status: "" },
    { title: "Figma Design System", subtitle: "Update button component", date: "26 July", status: "Today" },
    { title: "Fix errors", subtitle: "", date: "25 July", status: "" }
  ];

  const notesData = [
    { title: "Tomorrow Note", items: ["Confirm meeting room booking.", "Bring a laptop and notepad for taking notes.", "Follow up on any action items after the meeting."] },
    { title: "Tomorrow Note", items: ["Confirm meeting room booking.", "Bring a laptop and notepad for taking notes.", "Follow up on any action items after the meeting."] }
  ];

  return (
    <div className="h-full bg-white overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-none p-6 pb-4">
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">{currentDate}</div>
            <h1 className="text-2xl font-semibold text-gray-900">{getGreeting()} {getFirstName()}</h1>
          </div>
        </div>

        {/* Main Content with Custom Styling */}
        <div 
          className="flex-1 overflow-y-auto px-6"
          style={{
            borderRadius: '32px',
            border: '1px solid rgba(10, 12, 17, 0.10)',
            background: '#F9FAFB',
            boxShadow: '0px 0px 0px 1px rgba(255, 255, 255, 0.24), 0px 24px 48px 0px rgba(18, 18, 23, 0.03), 0px 10px 18px 0px rgba(18, 18, 23, 0.03), 0px 5px 8px 0px rgba(18, 18, 23, 0.04), 0px 2px 4px 0px rgba(18, 18, 23, 0.04)'
          }}
        >
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Recent Analysis */}
            <div className="col-span-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Analysis</h2>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  See all
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {analysisData.map((analysis) => (
                  <Card key={analysis.id} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{analysis.title}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Status: {analysis.status}</div>
                        <div className="text-sm text-gray-500">Analysis Type: {analysis.type}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{analysis.progress}%</span>
                          </div>
                          <Progress value={analysis.progress} className="h-2" />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Suggestions: {analysis.suggestions}</span>
                          <span>Documents: {analysis.documents}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Insights Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Insights</h2>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    This month
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-4 text-sm text-gray-500 px-4">
                    <div className="col-span-3">Name & role</div>
                    <div className="col-span-2 text-center">Total task</div>
                    <div className="col-span-2 text-center">Running</div>
                    <div className="col-span-2 text-center">Complete</div>
                    <div className="col-span-3"></div>
                  </div>
                  
                  {insightsData.map((insight, index) => (
                    <div key={insight.id} className="grid grid-cols-12 gap-4 items-center py-3 px-4 hover:bg-gray-50 rounded-lg">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 space-y-6">
              {/* My Prompts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">My Prompts</h3>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    Today
                  </Button>
                </div>
                <div className="space-y-3">
                  {promptsData.map((prompt, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">F</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{prompt.title}</div>
                        {prompt.subtitle && (
                          <div className="text-sm text-gray-600 truncate">{prompt.subtitle}</div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{prompt.date}</span>
                          {prompt.status && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">{prompt.status}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pattern Analysis Chart */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Pattern Analysis</h3>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    This week
                  </Button>
                </div>
                <div className="relative">
                  <div className="w-32 h-32 mx-auto relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="56" 
                        stroke="#10b981" 
                        strokeWidth="12" 
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56 * 0.76} ${2 * Math.PI * 56}`}
                        strokeLinecap="round"
                      />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="56" 
                        stroke="#3b82f6" 
                        strokeWidth="12" 
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56 * 0.16} ${2 * Math.PI * 56}`}
                        strokeDashoffset={`-${2 * Math.PI * 56 * 0.76}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">76%</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Total task</span>
                      </div>
                      <span className="text-sm font-medium">23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Running</span>
                      </div>
                      <span className="text-sm font-medium">16</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Completed</span>
                      </div>
                      <span className="text-sm font-medium">7</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Notes</h3>
                  <Button variant="ghost" size="sm" className="text-blue-600 text-sm">
                    Private
                  </Button>
                </div>
                <div className="space-y-4">
                  {notesData.map((note, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium text-sm">{note.title}</h4>
                      <ul className="space-y-1">
                        {note.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-gray-400 mt-1.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Recent Analysis List */}
          <div className="mt-8 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="font-semibold">Recent</h3>
              <Button variant="ghost" size="sm" className="text-blue-600">
                <Settings className="h-4 w-4 mr-1" />
              </Button>
            </div>
            <div className="space-y-2">
              {["Analysis of something", "Analysis of something", "Analysis of something"].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <Star className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="text-blue-600 text-sm">
                See all
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
