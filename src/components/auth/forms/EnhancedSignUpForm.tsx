
import React from 'react';
import { AuthInput } from '../shared/AuthInput';
import { AuthButton } from '../shared/AuthButton';
import { useSignUpForm } from '@/hooks/auth/useSignUpForm';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';

interface EnhancedSignUpFormProps {
  onSuccess: () => void;
}

export const EnhancedSignUpForm: React.FC<EnhancedSignUpFormProps> = ({ onSuccess }) => {
  const {
    formData,
    errors,
    updateField,
    clearError,
    isSubmitting,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    getPasswordStrength,
    getPasswordStrengthColor,
    handleSubmit
  } = useSignUpForm(onSuccess);

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <AuthInput
          id="signup-name"
          label="Full name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(value) => updateField('fullName', value)}
          onClearError={() => clearError('fullName')}
          error={errors.fullName}
          disabled={isSubmitting}
          icon={User}
        />

        <AuthInput
          id="signup-email"
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

        <div className="space-y-2">
          <AuthInput
            id="signup-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
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
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <AuthInput
          id="signup-confirm-password"
          label="Confirm password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(value) => updateField('confirmPassword', value)}
          onClearError={() => clearError('confirmPassword')}
          error={errors.confirmPassword}
          disabled={isSubmitting}
          icon={Lock}
          rightIcon={
            <div className="flex items-center gap-2">
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          }
        />
      </div>

      <AuthButton
        type="submit"
        loading={isSubmitting}
        loadingText="Creating account..."
        icon={ArrowRight}
        className="w-full"
      >
        Create account
      </AuthButton>
    </form>
  );
};
