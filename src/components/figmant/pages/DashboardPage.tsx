
import React from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { RecentAnalysisSection } from './dashboard/RecentAnalysisSection';
import { InsightsSection } from './dashboard/InsightsSection';
import { PatternAnalysisSection } from './dashboard/PatternAnalysisSection';
import { MyPromptsSection } from './dashboard/MyPromptsSection';
import { NotesSection } from './dashboard/NotesSection';

export const DashboardPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-6 py-6 space-y-8">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <RecentAnalysisSection />
            <InsightsSection />
            <PatternAnalysisSection />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <MyPromptsSection />
            <NotesSection />
          </div>
        </div>
      </div>
    </div>
  );
};
