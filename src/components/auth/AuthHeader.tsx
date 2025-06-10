
import React from 'react';
import { Brain } from 'lucide-react';

export const AuthHeader: React.FC = () => {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center space-x-2">
        <Brain className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">UX Analytics AI</h1>
      </div>
      <p className="text-muted-foreground">
        Access your AI-powered UX analytics dashboard
      </p>
    </div>
  );
};
