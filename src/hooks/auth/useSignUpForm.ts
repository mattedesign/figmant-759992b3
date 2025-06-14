
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAuthForm } from './useAuthForm';

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

const validationRules = {
  fullName: (value: string) => {
    if (!value.trim()) return 'Full name is required';
    return undefined;
  },
  email: (value: string) => {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
    return undefined;
  },
  password: (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return undefined;
  },
  confirmPassword: (value: string, formData?: SignUpFormData) => {
    if (!value) return 'Please confirm your password';
    if (formData && value !== formData.password) return 'Passwords do not match';
    return undefined;
  }
};

export const useSignUpForm = (onSuccess: () => void) => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useAuthForm<SignUpFormData>(
    { email: '', password: '', confirmPassword: '', fullName: '' },
    validationRules
  );

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string | undefined } = {};
    
    Object.entries(validationRules).forEach(([field, validator]) => {
      const error = field === 'confirmPassword' 
        ? validator(form.formData[field as keyof SignUpFormData], form.formData)
        : validator(form.formData[field as keyof SignUpFormData]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    form.setFormData(prev => prev); // Trigger re-render with errors
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await signUp(
        form.formData.email, 
        form.formData.password, 
        form.formData.fullName
      );
      
      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: 'Account already exists',
            description: 'An account with this email already exists. Please sign in instead.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Sign up failed',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Account created successfully!',
          description: 'Please check your email to verify your account.',
        });
        onSuccess();
      }
    } catch (err) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...form,
    isSubmitting,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    getPasswordStrength,
    getPasswordStrengthColor,
    handleSubmit,
    validateForm
  };
};
