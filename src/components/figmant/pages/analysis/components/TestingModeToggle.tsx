
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bug, X } from 'lucide-react';
import { TestingPage } from '../TestingPage';

export const TestingModeToggle: React.FC = () => {
  const [showTesting, setShowTesting] = useState(false);

  if (showTesting) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <TestingPage onBack={() => setShowTesting(false)} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => setShowTesting(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Bug className="h-4 w-4" />
        Testing Mode
      </Button>
      <Badge variant="secondary" className="text-xs">
        Development
      </Badge>
    </div>
  );
};
