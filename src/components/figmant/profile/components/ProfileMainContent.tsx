
import React from 'react';
import { SimplifiedProfile } from '@/components/dashboard/settings/SimplifiedProfile';

interface ProfileMainContentProps {
  activeSection: string;
}

export const ProfileMainContent: React.FC<ProfileMainContentProps> = ({ activeSection }) => {
  return <SimplifiedProfile />;
};
