
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
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 rounded-lg p-1 h-auto">
        <TabsTrigger 
          value="signin" 
          className="rounded-md py-2.5 px-4 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
        >
          Sign In
        </TabsTrigger>
        <TabsTrigger 
          value="signup" 
          className="rounded-md py-2.5 px-4 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
        >
          Sign Up
        </TabsTrigger>
      </TabsList>

      <TabsContent value="signin" className="space-y-6 mt-0">
        <EnhancedSignInForm onForgotPassword={onForgotPassword} />
      </TabsContent>

      <TabsContent value="signup" className="space-y-6 mt-0">
        <EnhancedSignUpForm onSuccess={onSignUpSuccess} />
      </TabsContent>
    </Tabs>
  );
};
