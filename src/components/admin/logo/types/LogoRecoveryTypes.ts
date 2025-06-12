
export interface LogoTestResults {
  activeLogoAccessible: boolean | null;
  fallbackLogoAccessible: boolean | null;
  storageAccessible: boolean | null;
}

export type RecoveryStatus = 'idle' | 'testing' | 'recovering' | 'complete';
