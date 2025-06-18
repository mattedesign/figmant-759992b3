
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  dataStats: any;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdated
}) => {
  const { profile } = useAuth();
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'EEEE, MMMM d');

  // Get time-based greeting
  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get time-based image
  const getTimeBasedImage = () => {
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const timeInMinutes = hour * 60 + minute;

    // 6am to 8am (360 to 480 minutes)
    if (timeInMinutes >= 360 && timeInMinutes <= 480) {
      return {
        src: 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/content/image/2025-06-17/zr6geoc2i_Sunrise.svg',
        alt: 'Sunrise'
      };
    }
    // 8:01am to 5:00pm (481 to 1020 minutes)
    if (timeInMinutes >= 481 && timeInMinutes <= 1020) {
      return {
        src: 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/content/image/2025-06-17/km8946rzr_Day.svg',
        alt: 'Day'
      };
    }
    // 5:01pm to 7:30pm (1021 to 1170 minutes)
    if (timeInMinutes >= 1021 && timeInMinutes <= 1170) {
      return {
        src: 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/content/image/2025-06-17/3yi4dyxol_Sunset.svg',
        alt: 'Sunset'
      };
    }
    // 7:31pm to 8:45pm (1171 to 1245 minutes)
    if (timeInMinutes >= 1171 && timeInMinutes <= 1245) {
      return {
        src: 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/content/image/2025-06-17/q6hty7yfd_Dusk.svg',
        alt: 'Dusk'
      };
    }
    // 8:46pm to 5:59am (1246+ minutes or 0-359 minutes) - Good evening period
    return {
      src: 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/content/image/2025-06-17/jv746fkjt_Night2.svg',
      alt: 'Night'
    };
  };

  // Extract first name from full_name or use a fallback with debugging
  const getFirstName = () => {
    console.log('DashboardHeader - Profile data:', profile);
    console.log('DashboardHeader - Profile full_name:', profile?.full_name);
    console.log('DashboardHeader - Profile email:', profile?.email);

    // Return early if no profile data is loaded yet
    if (!profile) {
      console.log('DashboardHeader - No profile data yet, showing loading state');
      return null; // This will trigger loading state
    }

    if (profile.full_name && profile.full_name.trim()) {
      const firstName = profile.full_name.split(' ')[0].trim();
      console.log('DashboardHeader - Extracted firstName from full_name:', firstName);
      return firstName || 'there';
    }
    // If no full_name, try to extract from email
    if (profile.email) {
      const emailName = profile.email.split('@')[0];
      console.log('DashboardHeader - Extracted emailName:', emailName);
      // Capitalize first letter and return if it looks like a name
      if (emailName && emailName.length > 0) {
        const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        console.log('DashboardHeader - Capitalized email name:', capitalizedName);
        return capitalizedName;
      }
    }
    console.log('DashboardHeader - Falling back to "there"');
    return 'there';
  };

  const firstName = getFirstName();
  const timeBasedImage = getTimeBasedImage();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-[12px] pt-2">
      <div className="flex items-center gap-4 h-full">
        {/* Time-based Image - fills height of container */}
        <div className="flex-shrink-0 h-full flex items-center">
          <img 
            src={timeBasedImage.src}
            alt={timeBasedImage.alt}
            className="h-full max-h-16 w-auto object-contain"
          />
        </div>
        
        <div>
          <div className="text-sm text-gray-500 mb-1">{formattedDate}</div>
          {firstName === null ? (
            // Loading state while profile is being fetched
            <h1 className="text-[24px] text-gray-900">
              <span className="font-normal">{getGreeting()}</span>...
            </h1>
          ) : (
            <h1 className="text-[24px] text-gray-900">
              <span className="font-normal">{getGreeting()}</span>, <span className="font-bold">{firstName}</span>
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};
