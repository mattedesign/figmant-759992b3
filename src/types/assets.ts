
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
  BRANDING: 'branding',
  CONTENT: 'content',
  SYSTEM: 'system',
  USER_UPLOADS: 'user-uploads'
} as const;

export const ASSET_TYPES = {
  LOGO: 'logo',
  IMAGE: 'image',
  DOCUMENT: 'document',
  VIDEO: 'video',
  OTHER: 'other'
} as const;
