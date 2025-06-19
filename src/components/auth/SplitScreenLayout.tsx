
import React from 'react';

interface SplitScreenLayoutProps {
  children: React.ReactNode;
  backgroundImage: string;
  imageAlt: string;
}

export const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = ({
  children,
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
      
      {/* Right side - Background Image */}
      <div className="hidden lg:block relative flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={backgroundImage}
          alt={imageAlt}
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>
    </div>
  );
};
