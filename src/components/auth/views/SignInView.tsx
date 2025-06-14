
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedSignInForm } from '../forms/EnhancedSignInForm';
import { EnhancedSignUpForm } from '../forms/EnhancedSignUpForm';

interface SignInViewProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onForgotPassword: () => void;
  onSignUpSuccess: () => void;
}

export const SignInView: React.FC<SignInViewProps> = ({
  activeTab,
  onTabChange,
  onForgotPassword,
  onSignUpSuccess
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted rounded-xl p-1">
        <TabsTrigger 
          value="signin" 
          className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          Sign In
        </TabsTrigger>
        <TabsTrigger 
          value="signup" 
          className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          Sign Up
        </TabsTrigger>
      </TabsList>

      <TabsContent value="signin" className="space-y-6">
        <EnhancedSignInForm onForgotPassword={onForgotPassword} />
      </TabsContent>

      <TabsContent value="signup" className="space-y-6">
        <EnhancedSignUpForm onSuccess={onSignUpSuccess} />
      </TabsContent>
    </Tabs>
  );
};
