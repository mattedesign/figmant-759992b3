
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAuthForm } from './useAuthForm';

interface SignInFormData {
  email: string;
  password: string;
}

const validationRules = {
  email: (value: string) => {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
    return undefined;
  },
  password: (value: string) => {
    if (!value) return 'Password is required';
    return undefined;
  }
};

export const useSignInForm = (onSuccess?: () => void) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useAuthForm<SignInFormData>(
    { email: '', password: '' },
    validationRules
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await signIn(form.formData.email, form.formData.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'Sign in failed',
            description: 'Invalid email or password. Please try again.',
            variant: 'destructive',
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: 'Email not confirmed',
            description: 'Please check your email and click the confirmation link.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Sign in failed',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have been successfully signed in.',
        });
        onSuccess?.();
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
    handleSubmit
  };
};
