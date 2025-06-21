
/**
 * Navigation Migration Utility
 * Handles legacy route redirects to ensure backward compatibility
 */

export const navigationMigrations = {
  // Legacy chat/analysis routes -> Analysis
  'chat': 'analysis',
  'competitor-analysis': 'analysis',
  
  // Legacy wizard routes -> Wizard Analysis (direct to stepped process)
  'wizard': 'wizard-analysis',
  
  // Revenue analysis -> Premium Analysis (new standardized name)
  'revenue-analysis': 'premium-analysis',
  
  // Preferences -> Settings
  'preferences': 'settings',
  
  // Legacy search -> Templates (search within templates)
  'search': 'templates',
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
