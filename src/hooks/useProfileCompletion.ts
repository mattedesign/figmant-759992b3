
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileCompletionStatus {
  personal: boolean;
  contact: boolean;
  address: boolean;
  security: boolean;
  preferences: boolean;
  avatar: boolean;
}

interface ProfileCompletionData {
  completionPercentage: number;
  completedSections: string[];
  missingSections: string[];
  nextSuggestion: string | null;
  completionStatus: ProfileCompletionStatus;
  isComplete: boolean;
}

export const useProfileCompletion = () => {
  const { user, profile } = useAuth();
  const [completionData, setCompletionData] = useState<ProfileCompletionData>({
    completionPercentage: 0,
    completedSections: [],
    missingSections: [],
    nextSuggestion: null,
    completionStatus: {
      personal: false,
      contact: false,
      address: false,
      security: false,
      preferences: false,
      avatar: false
    },
    isComplete: false
  });

  const calculateCompletion = useMemo(() => {
    if (!user || !profile) {
      return {
        completionPercentage: 0,
        completedSections: [],
        missingSections: ['personal', 'contact', 'address', 'security', 'preferences', 'avatar'],
        nextSuggestion: 'personal',
        completionStatus: {
          personal: false,
          contact: false,
          address: false,
          security: false,
          preferences: false,
          avatar: false
        },
        isComplete: false
      };
    }

    const status: ProfileCompletionStatus = {
      personal: !!(profile.full_name && profile.full_name.trim().length > 0),
      contact: !!(user.email && user.email.trim().length > 0) && !!(profile.phone_number && profile.phone_number.trim().length > 0),
      address: !!(profile.address || profile.city || profile.country || profile.state || profile.postal_code),
      security: !!(user.email_confirmed_at), // Basic security - email confirmed
      preferences: true, // Preferences are optional, so consider complete by default
      avatar: !!(profile.avatar_url && profile.avatar_url.trim().length > 0)
    };

    const completedSections = Object.entries(status)
      .filter(([_, isComplete]) => isComplete)
      .map(([section, _]) => section);

    const missingSections = Object.entries(status)
      .filter(([_, isComplete]) => !isComplete)
      .map(([section, _]) => section);

    const completionPercentage = Math.round((completedSections.length / Object.keys(status).length) * 100);

    // Determine next suggestion based on priority
    const suggestionPriority = ['personal', 'avatar', 'contact', 'address', 'security', 'preferences'];
    const nextSuggestion = suggestionPriority.find(section => !status[section as keyof ProfileCompletionStatus]) || null;

    const isComplete = completedSections.length === Object.keys(status).length;

    return {
      completionPercentage,
      completedSections,
      missingSections,
      nextSuggestion,
      completionStatus: status,
      isComplete
    };
  }, [user, profile]);

  useEffect(() => {
    setCompletionData(calculateCompletion);
  }, [calculateCompletion]);

  const getSectionDisplayName = (section: string): string => {
    const displayNames: Record<string, string> = {
      personal: 'Personal Information',
      contact: 'Contact Details',
      address: 'Address Information',
      security: 'Security Settings',
      preferences: 'Preferences',
      avatar: 'Profile Photo'
    };
    return displayNames[section] || section;
  };

  const getSectionDescription = (section: string): string => {
    const descriptions: Record<string, string> = {
      personal: 'Add your full name and basic information',
      contact: 'Verify your email and add contact details',
      address: 'Add your location and address information',
      security: 'Set up security preferences and 2FA',
      preferences: 'Customize your app experience',
      avatar: 'Upload a profile photo'
    };
    return descriptions[section] || '';
  };

  const getCompletionRewards = () => {
    const rewards = [];
    if (completionData.completionPercentage >= 50) {
      rewards.push('Profile Discovery Badge');
    }
    if (completionData.completionPercentage >= 75) {
      rewards.push('Profile Expert Badge');
    }
    if (completionData.isComplete) {
      rewards.push('Profile Master Badge', '+5 Bonus Credits');
    }
    return rewards;
  };

  return {
    ...completionData,
    getSectionDisplayName,
    getSectionDescription,
    getCompletionRewards,
    refresh: () => setCompletionData(calculateCompletion)
  };
};
