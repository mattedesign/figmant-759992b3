
import React from 'react';
import { EnhancedProfileTab } from './EnhancedProfileTab';

interface ProfileTabProps {
  user: any;
  onUpdateProfile: (data: any) => void;
  onUploadAvatar?: (file: File) => void;
}

export const ProfileTab = ({ user, onUpdateProfile, onUploadAvatar }: ProfileTabProps) => {
  // Fallback for backward compatibility
  const handleUploadAvatar = onUploadAvatar || ((file: File) => {
    console.warn('Avatar upload handler not provided');
  });

  return (
    <EnhancedProfileTab
      user={user}
      onUpdateProfile={onUpdateProfile}
      onUploadAvatar={handleUploadAvatar}
    />
  );
};
