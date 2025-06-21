
import React, { useState } from 'react';
import { PremiumAnalysisWizard } from './PremiumAnalysisWizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, MessageSquare, BarChart3, Settings } from 'lucide-react';

export const PremiumAnalysisTabController: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'wizard' | 'advanced'>('wizard');

  console.log('🎯 PREMIUM ANALYSIS TAB CONTROLLER - Mode:', activeMode);

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Mode Selection Header */}
      <div className="px-6 pt-4 pb-2 bg-transparent flex-shrink-0">
        <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'wizard' | 'advanced')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wizard" className="flex items-center space-x-2">
              <Wand2 className="h-4 w-4" />
              <span>Guided Wizard</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Advanced Mode</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wizard" className="mt-4 h-full">
            <div className="h-full flex flex-col min-h-0">
              <PremiumAnalysisWizard />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4 h-full">
            <div className="h-full flex flex-col min-h-0">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Advanced Analysis Configuration</span>
                  </CardTitle>
                  <CardDescription>
                    Configure advanced analysis parameters and batch processing options
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Advanced mode coming soon...</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveMode('wizard')}
                      className="mt-4"
                    >
                      Use Guided Wizard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
