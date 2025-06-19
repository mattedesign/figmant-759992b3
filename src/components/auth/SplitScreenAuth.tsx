
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

  const getBackgroundImage = () => {
    if (view === 'signup') {
      return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3';
    }
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3';
  };

  const getImageAlt = () => {
    if (view === 'signup') {
      return 'Desert landscape with geometric architecture';
    }
    return 'Ethereal figure with horse in desert landscape';
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

  return (
    <SplitScreenLayout
      backgroundImage={getBackgroundImage()}
      imageAlt={getImageAlt()}
    >
      {renderForm()}
    </SplitScreenLayout>
  );
};
