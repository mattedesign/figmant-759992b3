
// Utility function to extract URLs that were analyzed from analysis data
export const getAnalyzedUrls = (analysis: any): string[] => {
  const urls: string[] = [];
  
  try {
    // Check different places where URLs might be stored in analysis results
    const results = analysis.analysis_results || {};
    
    // Check if there are URLs in the analysis response text
    if (results.response) {
      const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
      const foundUrls = results.response.match(urlRegex) || [];
      urls.push(...foundUrls);
    }
    
    // Check if there are explicitly stored URLs
    if (results.analyzed_urls && Array.isArray(results.analyzed_urls)) {
      urls.push(...results.analyzed_urls);
    }
    
    // Check if there are URLs in recommendations
    if (results.recommendations && Array.isArray(results.recommendations)) {
      results.recommendations.forEach((rec: any) => {
        if (rec.reference_url) {
          urls.push(rec.reference_url);
        }
      });
    }
    
    // Remove duplicates and invalid URLs
    return [...new Set(urls)].filter(url => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });
  } catch (error) {
    console.error('Error extracting URLs from analysis:', error);
    return [];
  }
};
