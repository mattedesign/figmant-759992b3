
import React from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { SimplifiedProfile } from '@/components/dashboard/settings/SimplifiedProfile';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <SimplifiedProfile />
      </main>
    </div>
  );
};

export default ProfilePage;
