
import React, { useState } from 'react';
import { PremiumAnalysisWizard } from './PremiumAnalysisWizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, MessageSquare, BarChart3, Settings } from 'lucide-react';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

export const PremiumAnalysisTabController: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'wizard' | 'advanced'>('wizard');
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  console.log('🎯 PREMIUM ANALYSIS TAB CONTROLLER - Mode:', activeMode);

  const getHeaderClasses = () => {
    if (isMobile) {
      return "px-3 pt-3 pb-2 bg-transparent flex-shrink-0";
    }
    if (isTablet) {
      return "px-4 pt-4 pb-2 bg-transparent flex-shrink-0";
    }
    return "px-6 pt-4 pb-2 bg-transparent flex-shrink-0";
  };

  const getTabsListClasses = () => {
    if (isMobile) {
      return "grid w-full grid-cols-2 h-auto";
    }
    return "grid w-full grid-cols-2";
  };

  const getTabTriggerClasses = () => {
    if (isMobile) {
      return "flex items-center space-x-1 py-3 text-sm";
    }
    return "flex items-center space-x-2";
  };

  const getIconSize = () => {
    if (isMobile) {
      return "h-4 w-4";
    }
    return "h-4 w-4";
  };

  const getCardClasses = () => {
    if (isMobile) {
      return "h-full border-0 shadow-none";
    }
    return "h-full";
  };

  const getCardHeaderClasses = () => {
    if (isMobile) {
      return "pb-3";
    }
    return "";
  };

  const getCardTitleClasses = () => {
    if (isMobile) {
      return "text-lg";
    }
    return "";
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Mode Selection Header */}
      <div className={getHeaderClasses()}>
        <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'wizard' | 'advanced')} className="w-full">
          <TabsList className={getTabsListClasses()}>
            <TabsTrigger value="wizard" className={getTabTriggerClasses()}>
              <Wand2 className={getIconSize()} />
              <span>{isMobile ? 'Wizard' : 'Guided Wizard'}</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className={getTabTriggerClasses()}>
              <Settings className={getIconSize()} />
              <span>{isMobile ? 'Advanced' : 'Advanced Mode'}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wizard" className="mt-3 sm:mt-4 h-full">
            <div className="h-full flex flex-col min-h-0">
              <PremiumAnalysisWizard />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-3 sm:mt-4 h-full">
            <div className="h-full flex flex-col min-h-0">
              <Card className={getCardClasses()}>
                <CardHeader className={getCardHeaderClasses()}>
                  <CardTitle className={`flex items-center space-x-2 ${getCardTitleClasses()}`}>
                    <BarChart3 className={getIconSize()} />
                    <span>{isMobile ? 'Advanced Config' : 'Advanced Analysis Configuration'}</span>
                  </CardTitle>
                  <CardDescription className={isMobile ? 'text-sm' : ''}>
                    {isMobile ? 'Configure advanced parameters' : 'Configure advanced analysis parameters and batch processing options'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className={`text-center ${isMobile ? 'py-8' : 'py-12'}`}>
                    <p className="text-muted-foreground">Advanced mode coming soon...</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveMode('wizard')}
                      className="mt-4"
                      size={isMobile ? "sm" : "default"}
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
