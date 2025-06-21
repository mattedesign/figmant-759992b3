
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export interface ProfileUpdateData {
  full_name?: string;
  bio?: string;
  website?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  avatar_url?: string;
}

export class ProfileService {
  private static instance: ProfileService;
  private profileUpdateListeners: Set<(profile: UserProfile) => void> = new Set();

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  // Subscribe to profile updates
  onProfileUpdate(callback: (profile: UserProfile) => void): () => void {
    this.profileUpdateListeners.add(callback);
    return () => {
      this.profileUpdateListeners.delete(callback);
    };
  }

  // Notify all listeners of profile updates
  private notifyProfileUpdate(profile: UserProfile): void {
    this.profileUpdateListeners.forEach(callback => {
      try {
        callback(profile);
      } catch (error) {
        console.error('Error in profile update listener:', error);
      }
    });
  }

  // Validate profile data
  private validateProfileData(data: ProfileUpdateData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.full_name !== undefined && data.full_name.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }

    if (data.website && !this.isValidUrl(data.website)) {
      errors.push('Website must be a valid URL');
    }

    if (data.phone_number && !this.isValidPhoneNumber(data.phone_number)) {
      errors.push('Phone number format is invalid');
    }

    if (data.postal_code && data.postal_code.length > 20) {
      errors.push('Postal code is too long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Basic phone number validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  // Update profile with validation and real-time refresh
  async updateProfile(userId: string, data: ProfileUpdateData): Promise<{ success: boolean; errors?: string[]; profile?: UserProfile }> {
    try {
      console.log('ProfileService: Updating profile for user:', userId, data);

      // Validate data
      const validation = this.validateProfileData(data);
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      // Clean data - remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );

      // Update profile in database
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(cleanData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('ProfileService: Update error:', error);
        return { success: false, errors: [error.message] };
      }

      if (!updatedProfile) {
        return { success: false, errors: ['Failed to update profile'] };
      }

      console.log('ProfileService: Profile updated successfully:', updatedProfile);
      
      // Notify listeners
      this.notifyProfileUpdate(updatedProfile as UserProfile);

      return { success: true, profile: updatedProfile as UserProfile };
    } catch (error) {
      console.error('ProfileService: Unexpected error:', error);
      return { success: false, errors: ['An unexpected error occurred'] };
    }
  }

  // Get current profile
  async getProfile(userId: string): Promise<{ profile: UserProfile | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('ProfileService: Get profile error:', error);
        return { profile: null, error: error.message };
      }

      return { profile: data as UserProfile };
    } catch (error) {
      console.error('ProfileService: Unexpected get profile error:', error);
      return { profile: null, error: 'Failed to fetch profile' };
    }
  }

  // Upload avatar image
  async uploadAvatar(userId: string, file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'Please select an image file' };
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return { success: false, error: 'Image size must be less than 5MB' };
      }

      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('design-uploads')
        .upload(filePath, file);

      if (uploadError) {
        console.error('ProfileService: Upload error:', uploadError);
        return { success: false, error: uploadError.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('design-uploads')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const updateResult = await this.updateProfile(userId, { avatar_url: publicUrl });
      
      if (!updateResult.success) {
        return { success: false, error: updateResult.errors?.[0] || 'Failed to update profile' };
      }

      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('ProfileService: Avatar upload error:', error);
      return { success: false, error: 'Failed to upload avatar' };
    }
  }

  // Refresh profile data
  async refreshProfile(userId: string): Promise<UserProfile | null> {
    const result = await this.getProfile(userId);
    if (result.profile) {
      this.notifyProfileUpdate(result.profile);
    }
    return result.profile;
  }
}

export const profileService = ProfileService.getInstance();
