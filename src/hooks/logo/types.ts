
export const DEFAULT_FALLBACK_LOGO = '/lovable-uploads/235bdb67-21d3-44ed-968a-518226eef780.png';

export interface LogoConfig {
  activeLogoUrl: string;
  fallbackLogoUrl: string;
  collapsedLogoUrl?: string; // New optional field for collapsed state
}
