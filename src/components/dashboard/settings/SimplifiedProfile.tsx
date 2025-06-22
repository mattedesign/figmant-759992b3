
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface ProfileData {
  full_name: string;
  email: string;
  phone_number: string;
  notification_preferences: {
    email_notifications: boolean;
    push_notifications: boolean;
    marketing_emails: boolean;
  };
  billing_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export const SimplifiedProfile: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone_number: '',
    notification_preferences: {
      email_notifications: true,
      push_notifications: false,
      marketing_emails: false,
    },
    billing_address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
    },
  });

  const loadUserProfile = async () => {
    try {
      console.log('🔍 Starting loadUserProfile...');
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 Auth user:', user);
      
      if (!user) {
        console.log('❌ No authenticated user found');
        setLoading(false);
        return;
      }

      console.log('🔎 Querying profiles table for user ID:', user.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('📊 Database query result:', { profile, error });

      if (error) {
        console.error('❌ Database error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        });
        setLoading(false);
        return;
      }

      if (profile) {
        console.log('✅ Profile data received:', profile);
        
        // Debug the JSON parsing
        console.log('🔍 Raw notification_preferences:', profile.notification_preferences);
        console.log('🔍 Raw billing_address:', profile.billing_address);
        
        // Safe parsing of JSON fields with fallbacks
        const notificationPrefs = profile.notification_preferences as any;
        const billingAddr = profile.billing_address as any;
        
        console.log('🔄 Parsed notification_preferences:', notificationPrefs);
        console.log('🔄 Parsed billing_address:', billingAddr);
        
        const newProfileData = {
          full_name: profile.full_name || '',
          email: profile.email || '',
          phone_number: profile.phone_number || '',
          notification_preferences: {
            email_notifications: notificationPrefs?.email_notifications ?? true,
            push_notifications: notificationPrefs?.push_notifications ?? false,
            marketing_emails: notificationPrefs?.marketing_emails ?? false,
          },
          billing_address: {
            street: billingAddr?.street || '',
            city: billingAddr?.city || '',
            state: billingAddr?.state || '',
            zip: billingAddr?.zip || '',
            country: billingAddr?.country || 'United States',
          },
        };
        
        console.log('🎯 Final profileData being set:', newProfileData);
        setProfileData(newProfileData);
      } else {
        console.log('❌ No profile data found');
      }
    } catch (error) {
      console.error('💥 Error in loadUserProfile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile data",
      });
    } finally {
      console.log('🏁 loadUserProfile completed, setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const updateBillingAddress = (field: keyof ProfileData['billing_address'], value: string) => {
    setProfileData(prev => ({
      ...prev,
      billing_address: {
        ...prev.billing_address,
        [field]: value,
      },
    }));
  };

  const updateNotificationPreferences = (field: keyof ProfileData['notification_preferences'], value: boolean) => {
    setProfileData(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No authenticated user found",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone_number: profileData.phone_number,
          notification_preferences: profileData.notification_preferences as any,
          billing_address: profileData.billing_address as any,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving profile:', error);
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "There was an error saving your profile. Please try again.",
        });
        return;
      }

      setLastSaved(new Date());
      toast({
        title: "✅ Profile Updated",
        description: "Your profile has been saved successfully.",
        duration: 4000,
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "There was an error saving your profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading profile...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* DEBUG INFO - Remove after fixing */}
      {!loading && (
        <div className="mb-4 p-4 bg-gray-100 rounded text-xs">
          <details>
            <summary>🐛 Debug Info (Click to expand)</summary>
            <pre className="mt-2 text-xs">
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <Card className={`transition-all duration-300 ${saving ? 'opacity-75' : ''}`}>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profileData.email}
                  disabled
                  placeholder="Email cannot be changed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                value={profileData.phone_number}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone_number: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <Separator />

          {/* Notification Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via email
                  </p>
                </div>
                <Switch
                  checked={profileData.notification_preferences.email_notifications}
                  onCheckedChange={(checked) => updateNotificationPreferences('email_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive real-time notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={profileData.notification_preferences.push_notifications}
                  onCheckedChange={(checked) => updateNotificationPreferences('push_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and promotions
                  </p>
                </div>
                <Switch
                  checked={profileData.notification_preferences.marketing_emails}
                  onCheckedChange={(checked) => updateNotificationPreferences('marketing_emails', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Billing Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Billing Address</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={profileData.billing_address.street}
                  onChange={(e) => updateBillingAddress('street', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileData.billing_address.city}
                    onChange={(e) => updateBillingAddress('city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profileData.billing_address.state}
                    onChange={(e) => updateBillingAddress('state', e.target.value)}
                    placeholder="State"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={profileData.billing_address.zip}
                    onChange={(e) => updateBillingAddress('zip', e.target.value)}
                    placeholder="ZIP"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={profileData.billing_address.country}
                  onChange={(e) => updateBillingAddress('country', e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Save Section */}
          <div>
            {/* Last Saved Indicator */}
            {lastSaved && (
              <div className="flex justify-end mb-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                </div>
              </div>
            )}

            {/* Save Button with Enhanced Feedback */}
            <div className="flex justify-end space-x-3">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="flex items-center space-x-2 min-w-[140px]"
                variant={saving ? "secondary" : "default"}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
