
// Utility function to get user-friendly display names for analysis types
export const getAnalysisDisplayName = (analysisType: string): string => {
  const displayNames: Record<string, string> = {
    // Chat analysis types
    'figmant_chat': 'Chat Analysis',
    'master_ux_analysis': 'Master UX Analysis',
    'competitor_analysis': 'Competitor Analysis',
    'visual_hierarchy_analysis': 'Visual Hierarchy Analysis',
    'copy_messaging_analysis': 'Copy & Messaging Analysis',
    'ecommerce_revenue_analysis': 'E-commerce Revenue Analysis',
    'ab_testing_analysis': 'A/B Testing Analysis',
    'premium_analysis': 'Premium Analysis',
    'wizard': 'Premium Wizard',
    
    // Design analysis types  
    'design_analysis': 'Design Analysis',
    'batch_analysis': 'Batch Analysis',
    'comparative_analysis': 'Comparative Analysis',
    
    // General fallbacks
    'chat': 'Chat Analysis',
    'design': 'Design Analysis',
    'wizard_analysis': 'Wizard Analysis'
  };
  
  // Return the display name or a formatted version of the original type
  return displayNames[analysisType] || 
         analysisType.split('_')
           .map(word => word.charAt(0).toUpperCase() + word.slice(1))
           .join(' ');
};

// Get a short description for analysis types
export const getAnalysisDescription = (analysisType: string): string => {
  const descriptions: Record<string, string> = {
    'master_ux_analysis': 'Comprehensive UX evaluation and recommendations',
    'competitor_analysis': 'Compare design against top performers',
    'visual_hierarchy_analysis': 'Analyze information architecture and flow',
    'copy_messaging_analysis': 'Optimize headlines, CTAs, and messaging',
    'ecommerce_revenue_analysis': 'Predict revenue impact of design changes',
    'ab_testing_analysis': 'Design statistically valid A/B tests',
    'premium_analysis': 'Advanced analysis with detailed insights',
    'design_analysis': 'General design evaluation and feedback',
    'batch_analysis': 'Comparative analysis of multiple designs',
    'figmant_chat': 'Interactive design analysis conversation'
  };
  
  return descriptions[analysisType] || 'Analysis and recommendations';
};
