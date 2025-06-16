import React from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { RecentAnalysisSection } from './dashboard/RecentAnalysisSection';
import { InsightsSection } from './dashboard/InsightsSection';
import { MyPromptsSection } from './dashboard/MyPromptsSection';
import { PatternAnalysisSection } from './dashboard/PatternAnalysisSection';
import { NotesSection } from './dashboard/NotesSection';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { AnalysisData, InsightData, PromptData, NoteData } from './dashboard/types/dashboard';
export const DashboardPage: React.FC = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const analysisData: AnalysisData[] = [{
    id: 1,
    title: "Analysis 1",
    status: "Complete",
    type: "Comprehensive Analysis",
    progress: 62,
    suggestions: 32,
    documents: 2
  }, {
    id: 2,
    title: "Analysis 1",
    status: "Completed",
    type: "Comprehensive",
    progress: 30,
    suggestions: 32,
    documents: 2
  }, {
    id: 3,
    title: "Analysis 1",
    status: "Completed",
    type: "Comprehensive Analysis",
    progress: 80,
    suggestions: 32,
    documents: 2
  }, {
    id: 4,
    title: "Analysis 1",
    status: "Completed",
    type: "Comprehensive Analysis",
    progress: 40,
    suggestions: "6/15",
    documents: 2
  }];
  const insightsData: InsightData[] = [{
    id: 1,
    name: "Insight #1",
    role: "Data Analyst Lead",
    change: "+20%",
    period: "Pre-week",
    total: 16,
    running: 12,
    complete: 4
  }, {
    id: 2,
    name: "Insight #2",
    role: "Product Designer",
    change: "+20%",
    period: "Pre-week",
    total: 16,
    running: 12,
    complete: 4
  }, {
    id: 3,
    name: "Insight #3",
    role: "Design/Operation Lead",
    change: "+20%",
    period: "Pre-week",
    total: 16,
    running: 12,
    complete: 4
  }, {
    id: 4,
    name: "Insight #4",
    role: "Engineering Lead (Backend)",
    change: "+20%",
    period: "Pre-week",
    total: 16,
    running: 12,
    complete: 4
  }, {
    id: 5,
    name: "Insight #5",
    role: "Product Executive",
    change: "+20%",
    period: "Pre-week",
    total: 16,
    running: 12,
    complete: 4
  }];
  const promptsData: PromptData[] = [{
    title: "Figma Design System",
    subtitle: "Update button component",
    date: "26 July",
    status: "Today"
  }, {
    title: "Project management dash...",
    subtitle: "",
    date: "Tomorrow",
    status: ""
  }, {
    title: "Fix errors",
    subtitle: "",
    date: "26 July",
    status: ""
  }, {
    title: "Meeting with dev. team",
    subtitle: "",
    date: "26 July",
    status: ""
  }, {
    title: "Figma Design System",
    subtitle: "Update button component",
    date: "26 July",
    status: "Today"
  }, {
    title: "Fix errors",
    subtitle: "",
    date: "25 July",
    status: ""
  }];
  const notesData: NoteData[] = [{
    title: "Tomorrow Note",
    items: ["Confirm meeting room booking.", "Bring a laptop and notepad for taking notes.", "Follow up on any action items after the meeting."]
  }, {
    title: "Tomorrow Note",
    items: ["Confirm meeting room booking.", "Bring a laptop and notepad for taking notes.", "Follow up on any action items after the meeting."]
  }];
  return <div className="h-full overflow-hidden" style={{
    background: '#F9FAFB'
  }}>
      <div className="h-full flex flex-col">
        <DashboardHeader />

        {/* Main Content with px-8 padding */}
        <div style={{
        background: '#F9FAFB'
      }} className="flex-1 overflow-y-auto px-[24px]">
          {isMobile ?
        // Mobile: Single column stack layout
        <div className="space-y-6">
              <RecentAnalysisSection analysisData={analysisData} />
              <InsightsSection insightsData={insightsData} />
              <MyPromptsSection promptsData={promptsData} />
              <PatternAnalysisSection />
              <NotesSection notesData={notesData} />
            </div> : isTablet ?
        // Tablet: Optimized 2-column layout for medium screens
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
              {/* Main content takes more space on tablet */}
              <div className="col-span-8 space-y-4">
                <RecentAnalysisSection analysisData={analysisData} />
                <InsightsSection insightsData={insightsData} />
              </div>

              {/* Sidebar content in a more compact layout */}
              <div className="col-span-4 space-y-4">
                <MyPromptsSection promptsData={promptsData} />
                <PatternAnalysisSection />
                <NotesSection notesData={notesData} />
              </div>
            </div> :
        // Desktop: Full grid layout
        <div className="grid grid-cols-12 gap-6">
              <RecentAnalysisSection analysisData={analysisData} />
              <InsightsSection insightsData={insightsData} />

              {/* Right Column */}
              <div className="col-span-4 space-y-6">
                <MyPromptsSection promptsData={promptsData} />
                <PatternAnalysisSection />
                <NotesSection notesData={notesData} />
              </div>
            </div>}
        </div>
      </div>
    </div>;
};