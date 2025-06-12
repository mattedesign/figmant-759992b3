
export interface LogoConfig {
  activeLogoUrl: string;
  fallbackLogoUrl: string;
}

// Updated to use local asset as fallback since public storage access might be limited
export const DEFAULT_FALLBACK_LOGO = '/lovable-uploads/aed59d55-5b0a-4b7b-b82d-340e25b8ca40.png';
