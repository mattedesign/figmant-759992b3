
export type LogoType = 'icon' | 'brand';

export interface LogoConfig {
  activeLogoUrl: string;
  fallbackLogoUrl: string;
  iconLogoUrl?: string;
  brandLogoUrl?: string;
}

export interface LogoContextConfig {
  type: LogoType;
  size: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LOGO_CONTEXTS = {
  NAVIGATION: { type: 'icon' as LogoType, size: 'sm' as const },
  AUTH: { type: 'brand' as LogoType, size: 'lg' as const },
  HEADER: { type: 'brand' as LogoType, size: 'md' as const },
  SIDEBAR: { type: 'icon' as LogoType, size: 'sm' as const }
} as const;

export const DEFAULT_FALLBACK_LOGO = '/lovable-uploads/235bdb67-21d3-44ed-968a-518226eef780.png';
