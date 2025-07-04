
import React from 'react';
import { AuthInput } from '../shared/AuthInput';
import { AuthButton } from '../shared/AuthButton';
import { useSignInForm } from '@/hooks/auth/useSignInForm';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface EnhancedSignInFormProps {
  onForgotPassword: () => void;
  onSuccess?: () => void;
}

export const EnhancedSignInForm: React.FC<EnhancedSignInFormProps> = ({ 
  onForgotPassword, 
  onSuccess 
}) => {
  const {
    formData,
    errors,
    updateField,
    clearError,
    isSubmitting,
    showPassword,
    setShowPassword,
    handleSubmit
  } = useSignInForm(onSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        <AuthInput
          id="signin-email"
          label="Email address"
          type="email"
          placeholder="joe.samberg@minnowtv.com"
          value={formData.email}
          onChange={(value) => updateField('email', value)}
          onClearError={() => clearError('email')}
          error={errors.email}
          disabled={isSubmitting}
          icon={Mail}
        />

        <AuthInput
          id="signin-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          value={formData.password}
          onChange={(value) => updateField('password', value)}
          onClearError={() => clearError('password')}
          error={errors.password}
          disabled={isSubmitting}
          icon={Lock}
          rightIcon={
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          onClick={onForgotPassword}
          disabled={isSubmitting}
        >
          Forgot password?
        </button>
      </div>

      <AuthButton
        type="submit"
        loading={isSubmitting}
        loadingText="Signing in..."
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        Sign in
      </AuthButton>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        disabled={isSubmitting}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign in with Google
      </button>
    </form>
  );
};
