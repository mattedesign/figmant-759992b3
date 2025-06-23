
/**
 * Navigation Migration Utility
 * Handles legacy route redirects to ensure backward compatibility
 */

export const navigationMigrations = {
  // Analysis routes
  'chat': 'competitor-analysis',
  'analysis': 'competitor-analysis',
  
  // Wizard routes
  'wizard': 'wizard-analysis',
  
  // Premium analysis routes
  'revenue-analysis': 'premium-analysis',
  
  // Settings routes
  'preferences': 'settings',
  
  // Search routes
  'search': 'templates',
  
  // Ensure correct mapping for existing routes
  'competitor-analysis': 'competitor-analysis',
  'wizard-analysis': 'wizard-analysis',
  'premium-analysis': 'premium-analysis',
  'dashboard': 'dashboard',
  'insights': 'insights',
  'templates': 'templates',
  'analytics': 'analytics',
  'credits': 'credits',
  'admin': 'admin',
  'settings': 'settings',
  'profile': 'profile',
  'help-support': 'help-support'
} as const;

/**
 * Migrates old navigation routes to new standardized routes
 */
export const migrateNavigationRoute = (oldRoute: string): string => {
  return navigationMigrations[oldRoute as keyof typeof navigationMigrations] || oldRoute;
};

/**
 * Checks if a route needs migration
 */
export const shouldMigrateRoute = (route: string): boolean => {
  return route in navigationMigrations;
};

/**
 * Gets the migration path for debugging/logging
 */
export const getMigrationPath = (oldRoute: string): { from: string; to: string } | null => {
  const newRoute = migrateNavigationRoute(oldRoute);
  if (newRoute !== oldRoute) {
    return { from: oldRoute, to: newRoute };
  }
  return null;
};
