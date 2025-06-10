
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Mail, Key, Gift } from 'lucide-react';

export const TestingGuide: React.FC = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Testing the Free Tier & Password Reset
        </CardTitle>
        <CardDescription>
          New users now get free access! Follow these steps to test the complete authentication flow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex gap-3">
            <Gift className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Free Tier Access</h4>
              <p className="text-sm text-muted-foreground">
                New users automatically get free access to the platform - no payment required!
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Users className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Step 1: Create a Test Account</h4>
              <p className="text-sm text-muted-foreground">
                Use the "Sign Up" tab to create an account with an email you can access
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Mail className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Step 2: Test Password Reset (Optional)</h4>
              <p className="text-sm text-muted-foreground">
                Use the "Forgot your password?" link and enter the same email
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Key className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Step 3: Check Email & Reset (Optional)</h4>
              <p className="text-sm text-muted-foreground">
                Click the reset link in your email and set a new password
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
          <p className="text-sm text-green-800">
            <strong>✅ Free Tier Active:</strong> New users get immediate access with 'free' subscription status!
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Password Reset:</strong> Fully configured with Resend email delivery system.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
