
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { EnhancementSettings, CostCalculation } from '@/types/enhancement';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { isValidEnhancementSettings } from '@/utils/typeUtils';

export const AIEnhancementSettings: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<EnhancementSettings>({
    googleVision: { enabled: false, apiKeySet: false, creditCostMultiplier: 2 },
    openaiVision: { enabled: false, apiKeySet: false, creditCostMultiplier: 1.5 },
    amazonRekognition: { enabled: false, apiKeySet: false, creditCostMultiplier: 2.5 },
    microsoftFormRecognizer: { enabled: false, apiKeySet: false, creditCostMultiplier: 3 },
    tier: 'basic',
    autoEnhance: false
  });

  const [costPreview, setCostPreview] = useState<CostCalculation>({
    baseCredits: 5,
    enhancementCredits: 0,
    totalCredits: 5,
    breakdown: []
  });

  const [loading, setLoading] = useState(false);

  // Calculate cost preview when settings change
  useEffect(() => {
    const breakdown = [];
    let enhancementCredits = 0;

    if (settings.googleVision.enabled) {
      const credits = Math.ceil(5 * settings.googleVision.creditCostMultiplier);
      breakdown.push({ service: 'Google Vision (Accessibility)', credits });
      enhancementCredits += credits;
    }

    if (settings.openaiVision.enabled) {
      const credits = Math.ceil(5 * settings.openaiVision.creditCostMultiplier);
      breakdown.push({ service: 'OpenAI (Secondary Analysis)', credits });
      enhancementCredits += credits;
    }

    if (settings.amazonRekognition.enabled) {
      const credits = Math.ceil(5 * settings.amazonRekognition.creditCostMultiplier);
      breakdown.push({ service: 'Amazon Rekognition (Diversity)', credits });
      enhancementCredits += credits;
    }

    if (settings.microsoftFormRecognizer.enabled) {
      const credits = Math.ceil(5 * settings.microsoftFormRecognizer.creditCostMultiplier);
      breakdown.push({ service: 'Microsoft Form Recognizer', credits });
      enhancementCredits += credits;
    }

    setCostPreview({
      baseCredits: 5,
      enhancementCredits,
      totalCredits: 5 + enhancementCredits,
      breakdown
    });
  }, [settings]);

  const handleSaveSettings = async () => {
    if (!user || profile?.role !== 'owner') {
      toast({
        title: "Access Denied",
        description: "Only owners can modify AI enhancement settings.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: 'ai_enhancement_settings',
          setting_value: settings as any, // Type assertion for JSON compatibility
          updated_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "AI enhancement settings have been updated successfully."
      });
    } catch (error) {
      console.error('Failed to save AI enhancement settings:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTierDescription = (tier: string) => {
    switch (tier) {
      case 'basic':
        return 'Single AI enhancement per analysis';
      case 'professional':
        return 'Up to 2 AI enhancements per analysis';
      case 'enterprise':
        return 'All AI enhancements available';
      default:
        return '';
    }
  };

  const canEnableService = (serviceKey: keyof Omit<EnhancementSettings, 'tier' | 'autoEnhance'>) => {
    const enabledCount = Object.values(settings).filter(
      (service, index, array) => {
        const keys = Object.keys(settings);
        const currentKey = keys[index];
        return ['googleVision', 'openaiVision', 'amazonRekognition', 'microsoftFormRecognizer'].includes(currentKey) &&
               typeof service === 'object' && 
               service && 
               'enabled' in service && 
               service.enabled;
      }
    ).length;

    const currentService = settings[serviceKey];
    const isCurrentEnabled = typeof currentService === 'object' && currentService && 'enabled' in currentService && currentService.enabled;

    if (settings.tier === 'basic' && enabledCount >= 1 && !isCurrentEnabled) {
      return false;
    }
    if (settings.tier === 'professional' && enabledCount >= 2 && !isCurrentEnabled) {
      return false;
    }
    return true;
  };

  const updateServiceSetting = (serviceKey: keyof Omit<EnhancementSettings, 'tier' | 'autoEnhance'>, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      [serviceKey]: { ...prev[serviceKey], enabled }
    }));
  };

  if (profile?.role !== 'owner') {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">Owner Only</Badge>
              AI Enhancement Settings
            </CardTitle>
            <CardDescription>
              This feature is only available to application owners.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">AI Analysis Enhancement Layer</h2>
        <p className="text-muted-foreground">
          Add multi-AI intelligence to enhance your existing Claude analysis results without replacing them.
        </p>
      </div>

      {/* Enhancement Tier Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Enhancement Tier</CardTitle>
          <CardDescription>
            Choose how many AI services can be used simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(['basic', 'professional', 'enterprise'] as const).map((tier) => (
            <div key={tier} className="flex items-center space-x-3">
              <input
                type="radio"
                id={tier}
                name="tier"
                checked={settings.tier === tier}
                onChange={() => setSettings(prev => ({ ...prev, tier }))}
                className="h-4 w-4"
              />
              <label htmlFor={tier} className="flex-1 cursor-pointer">
                <div className="font-medium capitalize">{tier}</div>
                <div className="text-sm text-muted-foreground">
                  {getTierDescription(tier)}
                </div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Services Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>AI Services</CardTitle>
          <CardDescription>
            Configure additional AI services to enhance your analysis results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Vision - Accessibility */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Google Vision API</div>
              <div className="text-sm text-muted-foreground">
                Accessibility analysis, contrast ratios, ADA compliance
              </div>
              <Badge variant="outline">+{settings.googleVision.creditCostMultiplier}x credits</Badge>
            </div>
            <Switch
              checked={settings.googleVision.enabled}
              onCheckedChange={(enabled) => 
                canEnableService('googleVision') && updateServiceSetting('googleVision', enabled)
              }
              disabled={!canEnableService('googleVision')}
            />
          </div>

          <Separator />

          {/* OpenAI Vision - Secondary Analysis */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">OpenAI Vision</div>
              <div className="text-sm text-muted-foreground">
                Secondary business analysis, alternative ROI projections
              </div>
              <Badge variant="outline">+{settings.openaiVision.creditCostMultiplier}x credits</Badge>
            </div>
            <Switch
              checked={settings.openaiVision.enabled}
              onCheckedChange={(enabled) => 
                canEnableService('openaiVision') && updateServiceSetting('openaiVision', enabled)
              }
              disabled={!canEnableService('openaiVision')}
            />
          </div>

          <Separator />

          {/* Amazon Rekognition - Diversity */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Amazon Rekognition</div>
              <div className="text-sm text-muted-foreground">
                Visual diversity analysis, demographic representation scoring
              </div>
              <Badge variant="outline">+{settings.amazonRekognition.creditCostMultiplier}x credits</Badge>
            </div>
            <Switch
              checked={settings.amazonRekognition.enabled}
              onCheckedChange={(enabled) => 
                canEnableService('amazonRekognition') && updateServiceSetting('amazonRekognition', enabled)
              }
              disabled={!canEnableService('amazonRekognition')}
            />
          </div>

          <Separator />

          {/* Microsoft Form Recognizer */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Microsoft Form Recognizer</div>
              <div className="text-sm text-muted-foreground">
                Form optimization, conversion flow analysis
              </div>
              <Badge variant="outline">+{settings.microsoftFormRecognizer.creditCostMultiplier}x credits</Badge>
            </div>
            <Switch
              checked={settings.microsoftFormRecognizer.enabled}
              onCheckedChange={(enabled) => 
                canEnableService('microsoftFormRecognizer') && updateServiceSetting('microsoftFormRecognizer', enabled)
              }
              disabled={!canEnableService('microsoftFormRecognizer')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Auto-Enhancement Setting */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Enhancement</CardTitle>
          <CardDescription>
            Automatically apply enhancements to all new analyses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Enable Auto-Enhancement</div>
              <div className="text-sm text-muted-foreground">
                When enabled, all new analyses will automatically include selected AI enhancements
              </div>
            </div>
            <Switch
              checked={settings.autoEnhance}
              onCheckedChange={(autoEnhance) => setSettings(prev => ({ ...prev, autoEnhance }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cost Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Cost Preview</CardTitle>
          <CardDescription>
            Estimated credits per enhanced analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Base Claude Analysis:</span>
            <Badge variant="secondary">{costPreview.baseCredits} credits</Badge>
          </div>
          
          {costPreview.breakdown.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm">{item.service}:</span>
              <Badge variant="outline">+{item.credits} credits</Badge>
            </div>
          ))}
          
          <Separator />
          
          <div className="flex justify-between items-center font-medium">
            <span>Total per Analysis:</span>
            <Badge variant="default">{costPreview.totalCredits} credits</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings} 
          disabled={loading}
          className="min-w-[120px]"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};
