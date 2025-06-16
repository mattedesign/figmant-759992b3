
import React from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { RecentAnalysisSection } from './dashboard/RecentAnalysisSection';
import { InsightsSection } from './dashboard/InsightsSection';
import { PatternAnalysisSection } from './dashboard/PatternAnalysisSection';
import { MyPromptsSection } from './dashboard/MyPromptsSection';
import { NotesSection } from './dashboard/NotesSection';
import { AnalysisData, InsightData, PromptData, NoteData } from './dashboard/types/dashboard';

export const DashboardPage: React.FC = () => {
  // Sample data for dashboard sections
  const analysisData: AnalysisData[] = [
    {
      id: 1,
      title: "E-commerce Landing Page",
      status: "Completed",
      type: "UX Analysis",
      progress: 100,
      suggestions: 8,
      documents: 3
    },
    {
      id: 2,
      title: "Mobile App Wireframes",
      status: "In Progress",
      type: "Visual Hierarchy",
      progress: 75,
      suggestions: 12,
      documents: 5
    }
  ];

  const insightsData: InsightData[] = [
    {
      id: 1,
      name: "Sarah Wilson",
      role: "UX Designer",
      change: "+12%",
      period: "This week",
      total: 24,
      running: 8,
      complete: 16
    },
    {
      id: 2,
      name: "Alex Chen",
      role: "Product Manager",
      change: "+8%",
      period: "This week",
      total: 18,
      running: 5,
      complete: 13
    },
    {
      id: 3,
      name: "Maria Garcia",
      role: "Visual Designer",
      change: "+15%",
      period: "This week",
      total: 32,
      running: 12,
      complete: 20
    }
  ];

  const promptsData: PromptData[] = [
    {
      title: "Competitor Analysis Template",
      subtitle: "Analyze competitor design patterns",
      date: "2 hours ago",
      status: "Active"
    },
    {
      title: "Visual Hierarchy Review",
      subtitle: "Check information hierarchy",
      date: "5 hours ago",
      status: "Completed"
    },
    {
      title: "A/B Testing Framework",
      subtitle: "Design variation testing",
      date: "1 day ago",
      status: "Draft"
    }
  ];

  const notesData: NoteData[] = [
    {
      title: "Design System Updates",
      items: [
        "Update color palette for accessibility",
        "Review typography scale consistency",
        "Document component spacing rules"
      ]
    },
    {
      title: "User Research Insights",
      items: [
        "Users prefer larger clickable areas",
        "Mobile navigation needs simplification",
        "Loading states should be more informative"
      ]
    }
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-6 py-6 space-y-8">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <RecentAnalysisSection analysisData={analysisData} />
            <InsightsSection insightsData={insightsData} />
            <PatternAnalysisSection />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <MyPromptsSection promptsData={promptsData} />
            <NotesSection notesData={notesData} />
          </div>
        </div>
      </div>
    </div>
  );
};
