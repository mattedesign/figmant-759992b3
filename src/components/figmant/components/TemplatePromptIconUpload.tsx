
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface TemplatePromptIconUploadProps {
  promptId?: string;
  currentIcon?: string;
  onIconUpdate?: (iconUrl: string) => void;
  defaultOwnerIcon?: boolean;
}

export const TemplatePromptIconUpload: React.FC<TemplatePromptIconUploadProps> = ({
  promptId,
  currentIcon,
  onIconUpdate,
  defaultOwnerIcon = false
}) => {
  const [uploading, setUploading] = useState(false);
  const { profile } = useAuth();

  const getDefaultIcon = () => {
    if (defaultOwnerIcon && profile?.role === 'owner') {
      return <Settings className="h-6 w-6 text-blue-600" />;
    }
    return <Image className="h-6 w-6 text-gray-500" />;
  };

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `prompt-icon-${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `prompt-icons/${fileName}`;

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

      // If we have a promptId, update the claude_prompt_examples table
      if (promptId) {
        const { error: updateError } = await supabase
          .from('claude_prompt_examples')
          .update({ 
            metadata: {
              icon_url: publicUrl
            }
          })
          .eq('id', promptId);

        if (updateError) {
          throw updateError;
        }
      }

      // Call the callback if provided
      if (onIconUpdate) {
        onIconUpdate(publicUrl);
      }

      toast.success('Icon uploaded successfully');
    } catch (error) {
      console.error('Error uploading icon:', error);
      toast.error('Failed to upload icon');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        {currentIcon ? (
          <img src={currentIcon} alt="Prompt icon" className="w-full h-full object-cover" />
        ) : (
          getDefaultIcon()
        )}
      </div>
      <label className="cursor-pointer">
        <Button variant="outline" size="sm" disabled={uploading}>
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Icon'}
        </Button>
        <input
          type="file"
          accept="image/*"
          onChange={handleIconUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
};
