
import { User, Settings, LogOut, CreditCard, Shield, LayoutDashboard, UserCog, Home, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const UserMenu = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [uploading, setUploading] = useState(false);

  const handleSignOut = async () => {
    console.log('UserMenu: Initiating sign out...');
    try {
      await signOut();
      console.log('UserMenu: Sign out successful, navigating to auth');
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('UserMenu: Sign out error:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file || !user) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('design-uploads')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('design-uploads')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast.success('Profile image updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const isOwner = profile?.role === 'owner';
  const isOnOwnerDashboard = location.pathname === '/owner';
  const isOnSubscriberDashboard = location.pathname === '/dashboard';
  const isOnFigmant = location.pathname === '/figmant' || location.pathname === '/';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-accent p-2 rounded-md transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-gray-100">
              <User className="h-4 w-4 text-gray-500" />
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium">
              {profile?.full_name || user?.email?.split('@')[0] || 'User'}
            </div>
            <div className="text-xs text-muted-foreground">
              {user?.email}
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Profile Image Upload */}
        <DropdownMenuItem asChild>
          <label className="cursor-pointer flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            <span>{uploading ? 'Uploading...' : 'Update Profile Image'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Main App - now points to figmant as default */}
        <DropdownMenuItem 
          onClick={() => navigate('/figmant')}
          className={isOnFigmant ? 'bg-accent' : ''}
        >
          <Home className="mr-2 h-4 w-4" />
          Main App
        </DropdownMenuItem>
        
        {/* Dashboard Navigation - Only show for owners or as additional option */}
        {isOwner && (
          <>
            <DropdownMenuItem 
              onClick={() => navigate('/dashboard')}
              className={isOnSubscriberDashboard ? 'bg-accent' : ''}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Subscriber Dashboard
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => navigate('/owner')}
              className={isOnOwnerDashboard ? 'bg-accent' : ''}
            >
              <Shield className="mr-2 h-4 w-4" />
              Owner Dashboard
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={() => navigate('/figmant', { state: { activeSection: 'admin' } })}
              className={isOnFigmant && location.state?.activeSection === 'admin' ? 'bg-accent' : ''}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Admin
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
          </>
        )}

        {/* Regular dashboard link for non-owners */}
        {!isOwner && (
          <DropdownMenuItem onClick={() => navigate('/dashboard')}>
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={() => navigate('/subscription')}>
          <CreditCard className="mr-2 h-4 w-4" />
          Subscription
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
