
import React from 'react';

interface SplitScreenLayoutProps {
  children: React.ReactNode;
  backgroundVideo?: string;
  backgroundImage?: string;
  imageAlt: string;
}

export const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = ({
  children,
  backgroundVideo,
  backgroundImage,
  imageAlt
}) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {children}
        </div>
      </div>
      
      {/* Right side - Background Video or Image */}
      <div className="hidden lg:block relative flex-1 rounded-l-[20px] overflow-hidden mt-4 mr-4 mb-4">
        {backgroundVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={backgroundImage}
            alt={imageAlt}
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>
    </div>
  );
};
