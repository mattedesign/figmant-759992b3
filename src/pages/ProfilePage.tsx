
import React from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { SettingsContainer } from '@/components/dashboard/settings/SettingsContainer';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <SettingsContainer />
      </main>
    </div>
  );
};

export default ProfilePage;
