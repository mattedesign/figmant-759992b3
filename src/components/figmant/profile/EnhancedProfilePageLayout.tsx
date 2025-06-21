
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileSidebar } from './components/ProfileSidebar';
import { ProfileMainContent } from './components/ProfileMainContent';
import { useIsMobile } from '@/hooks/use-mobile';

export const EnhancedProfilePageLayout: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');
  const isMobile = useIsMobile();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="min-h-full">
          <ProfileHeader user={user} profile={profile} />
          <div className="px-4 pb-6">
            <ProfileSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              isMobile={true}
            />
            <div className="mt-6">
              <ProfileMainContent activeSection={activeSection} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden bg-gray-50">
      <div className="h-full flex flex-col">
        <ProfileHeader user={user} profile={profile} />
        
        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white">
            <ProfileSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              isMobile={false}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              <ProfileMainContent activeSection={activeSection} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
