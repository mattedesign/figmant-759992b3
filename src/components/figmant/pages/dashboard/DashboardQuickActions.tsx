
import React from 'react';
import { Upload, TrendingUp, Eye, Users, FileText, Palette } from 'lucide-react';

interface QuickActionItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  variant: 'primary' | 'secondary';
}

export const DashboardQuickActions: React.FC = () => {
  const quickActions: QuickActionItem[] = [
    {
      title: 'Upload & Analyze',
      description: 'Start a new design analysis with AI insights',
      icon: Upload,
      action: () => {
        // Navigate to upload tab
        const uploadTab = document.querySelector('[data-tab="upload"]') as HTMLElement;
        uploadTab?.click();
      },
      variant: 'primary'
    },
    {
      title: 'Competitor Analysis', 
      description: 'Compare your design against competitors',
      icon: TrendingUp,
      action: () => {
        console.log('Navigate to competitor analysis');
      },
      variant: 'secondary'
    },
    {
      title: 'Visual Hierarchy',
      description: 'Analyze visual flow and attention patterns',
      icon: Eye,
      action: () => {
        console.log('Navigate to visual hierarchy');
      },
      variant: 'secondary'
    },
    {
      title: 'User Testing',
      description: 'Create A/B tests for your designs',
      icon: Users,
      action: () => {
        console.log('Navigate to user testing');
      },
      variant: 'secondary'
    }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
        <p className="text-gray-600 text-sm">
          Common design analysis tasks to get you started quickly
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const isPrimary = action.variant === 'primary';
          
          return (
            <button
              key={action.title}
              onClick={action.action}
              className={`
                p-4 rounded-xl text-left transition-all duration-200 border
                ${isPrimary 
                  ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  isPrimary ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <div>
                  <div className="font-medium text-sm mb-1">{action.title}</div>
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {action.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
