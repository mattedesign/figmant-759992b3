
import React from 'react';
import { AuthInput } from '../shared/AuthInput';
import { AuthButton } from '../shared/AuthButton';
import { useSignInForm } from '@/hooks/auth/useSignInForm';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

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
      <div className="space-y-4">
        <AuthInput
          id="signin-email"
          label="Email address"
          type="email"
          placeholder="Enter your email"
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
          placeholder="Enter your password"
          value={formData.password}
          onChange={(value) => updateField('password', value)}
          onClearError={() => clearError('password')}
          error={errors.password}
          disabled={isSubmitting}
          icon={Lock}
          rightIcon={
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-sm text-primary hover:underline font-medium"
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
        icon={ArrowRight}
        className="w-full"
      >
        Sign in
      </AuthButton>
    </form>
  );
};
