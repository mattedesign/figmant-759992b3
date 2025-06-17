
export interface Asset {
  id: string;
  name: string;
  type: 'logo' | 'image' | 'document' | 'video' | 'other';
  category: 'branding' | 'content' | 'system' | 'user-uploads';
  url: string;
  uploadPath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
  tags: string[];
  isActive: boolean;
}

export interface AssetUploadConfig {
  maxFileSize: number;
  allowedTypes: string[];
  organizationPath: string;
}

export const ASSET_CATEGORIES = {
  BRANDING: 'branding' as const,
  CONTENT: 'content' as const,
  SYSTEM: 'system' as const,
  USER_UPLOADS: 'user-uploads' as const
} as const;

export const ASSET_TYPES = {
  LOGO: 'logo' as const,
  IMAGE: 'image' as const,
  DOCUMENT: 'document' as const,
  VIDEO: 'video' as const,
  OTHER: 'other' as const
} as const;
