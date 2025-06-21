
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const WizardPage: React.FC = () => {
  console.log('🧙 WIZARD ANALYSIS PAGE - Rendering wizard placeholder');

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 min-h-0 overflow-hidden p-6">
        <Card>
          <CardHeader>
            <CardTitle>Wizard Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Wizard analysis functionality is currently being restructured. Please use the Quick Analysis feature for now.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
