
import React, { useState } from 'react';
import { SplitScreenLayout } from './SplitScreenLayout';
import { ModernSplitSignInForm } from './ModernSplitSignInForm';
import { ModernSplitSignUpForm } from './ModernSplitSignUpForm';
import { PasswordResetForm } from './PasswordResetForm';

export const SplitScreenAuth: React.FC = () => {
  const [view, setView] = useState<'signin' | 'signup' | 'reset'>('signin');

  const handleForgotPassword = () => {
    setView('reset');
  };

  const handleSignUpSuccess = () => {
    setView('signin');
  };

  const handleBackToSignIn = () => {
    setView('signin');
  };

  const getBackgroundMedia = () => {
    if (view === 'signup') {
      return {
        type: 'image' as const,
        url: 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/content/image/2025-06-22/z7ayun9fe_Image-2.svg',
        alt: 'Sign up background'
      };
    }
    
    return {
      type: 'video' as const,
      url: 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/content/video/2025-06-17/clrcpd7ij_Brand.mp4',
      alt: 'Brand video background'
    };
  };

  const renderForm = () => {
    switch (view) {
      case 'signup':
        return (
          <div>
            <ModernSplitSignUpForm onSuccess={handleSignUpSuccess} />
            <div className="mt-4 text-center">
              <button
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                onClick={() => setView('signin')}
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        );
      case 'reset':
        return (
          <div>
            <PasswordResetForm onBackToSignIn={handleBackToSignIn} />
          </div>
        );
      default:
        return (
          <div>
            <ModernSplitSignInForm onForgotPassword={handleForgotPassword} />
            <div className="mt-4 text-center">
              <button
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                onClick={() => setView('signup')}
              >
                Need an account? Sign up
              </button>
            </div>
          </div>
        );
    }
  };

  const backgroundMedia = getBackgroundMedia();

  return (
    <SplitScreenLayout
      backgroundVideo={backgroundMedia.type === 'video' ? backgroundMedia.url : undefined}
      backgroundImage={backgroundMedia.type === 'image' ? backgroundMedia.url : undefined}
      imageAlt={backgroundMedia.alt}
    >
      {renderForm()}
    </SplitScreenLayout>
  );
};
