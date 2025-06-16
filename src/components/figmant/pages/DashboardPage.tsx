
import React from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { RecentAnalysisSection } from './dashboard/RecentAnalysisSection';
import { InsightsSection } from './dashboard/InsightsSection';
import { MyPromptsSection } from './dashboard/MyPromptsSection';
import { PatternAnalysisSection } from './dashboard/PatternAnalysisSection';
import { NotesSection } from './dashboard/NotesSection';
import { RecentSection } from './dashboard/RecentSection';
import { AnalysisData, InsightData, PromptData, NoteData } from './dashboard/types/dashboard';

export const DashboardPage: React.FC = () => {
  const analysisData: AnalysisData[] = [
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

  const insightsData: InsightData[] = [
    { id: 1, name: "Insight #1", role: "Data Analyst Lead", change: "+20%", period: "Pre-week", total: 16, running: 12, complete: 4 },
    { id: 2, name: "Insight #2", role: "Product Designer", change: "+20%", period: "Pre-week", total: 16, running: 12, complete: 4 },
    { id: 3, name: "Insight #3", role: "Design/Operation Lead", change: "+20%", period: "Pre-week", total: 16, running: 12, complete: 4 },
    { id: 4, name: "Insight #4", role: "Engineering Lead (Backend)", change: "+20%", period: "Pre-week", total: 16, running: 12, complete: 4 },
    { id: 5, name: "Insight #5", role: "Product Executive", change: "+20%", period: "Pre-week", total: 16, running: 12, complete: 4 }
  ];

  const promptsData: PromptData[] = [
    { title: "Figma Design System", subtitle: "Update button component", date: "26 July", status: "Today" },
    { title: "Project management dash...", subtitle: "", date: "Tomorrow", status: "" },
    { title: "Fix errors", subtitle: "", date: "26 July", status: "" },
    { title: "Meeting with dev. team", subtitle: "", date: "26 July", status: "" },
    { title: "Figma Design System", subtitle: "Update button component", date: "26 July", status: "Today" },
    { title: "Fix errors", subtitle: "", date: "25 July", status: "" }
  ];

  const notesData: NoteData[] = [
    { title: "Tomorrow Note", items: ["Confirm meeting room booking.", "Bring a laptop and notepad for taking notes.", "Follow up on any action items after the meeting."] },
    { title: "Tomorrow Note", items: ["Confirm meeting room booking.", "Bring a laptop and notepad for taking notes.", "Follow up on any action items after the meeting."] }
  ];

  return (
    <div className="h-full bg-white overflow-hidden">
      <div className="h-full flex flex-col">
        <DashboardHeader />

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
            <RecentAnalysisSection analysisData={analysisData} />
            <InsightsSection insightsData={insightsData} />

            {/* Right Column */}
            <div className="col-span-4 space-y-6">
              <MyPromptsSection promptsData={promptsData} />
              <PatternAnalysisSection />
              <NotesSection notesData={notesData} />
            </div>
          </div>

          <RecentSection />
        </div>
      </div>
    </div>
  );
};
