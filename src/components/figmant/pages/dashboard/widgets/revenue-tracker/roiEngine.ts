
// Revenue Projection Engine - Core calculation logic using real Claude analysis data

export interface IndustryBaseline {
  avgConversion: number;
  avgOrderValue?: number;
  avgMRR?: number;
  avgValue?: number;
}

export interface ROIProjection {
  monthlyImpact: number;
  yearlyProjection: number;
  implementationCost: number;
  paybackPeriod: number;
  confidenceLevel: number;
  industryType: string;
  recommendationCount: number;
}

export interface TrendAnalysis {
  analysisFrequency: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  confidenceCorrelation: {
    avgConfidence: number;
    projectedImpact: number;
    correlation: number;
  };
  improvementTrends: {
    period: string;
    improvement: number;
    confidence: number;
  }[];
  valuableAnalysisTypes: {
    type: string;
    avgROI: number;
    frequency: number;
    avgConfidence: number;
  }[];
}

// Industry-specific conversion baselines
const INDUSTRY_BASELINES: Record<string, IndustryBaseline> = {
  'ecommerce': { avgConversion: 0.023, avgOrderValue: 125 },
  'saas': { avgConversion: 0.041, avgMRR: 89 },
  'healthcare': { avgConversion: 0.031, avgValue: 2400 },
  'fintech': { avgConversion: 0.028, avgValue: 890 },
  'education': { avgConversion: 0.035, avgValue: 149 },
  'general': { avgConversion: 0.025, avgOrderValue: 150 } // Fallback
};

export const extractRecommendations = (analysisResults: any): string[] => {
  try {
    // Handle different analysis result structures
    if (typeof analysisResults === 'string') {
      analysisResults = JSON.parse(analysisResults);
    }
    
    const recommendations: string[] = [];
    
    // Extract from suggestions object
    if (analysisResults.suggestions) {
      Object.values(analysisResults.suggestions).forEach((suggestion: any) => {
        if (typeof suggestion === 'string') {
          recommendations.push(suggestion);
        }
      });
    }
    
    // Extract from recommendations array
    if (analysisResults.recommendations && Array.isArray(analysisResults.recommendations)) {
      recommendations.push(...analysisResults.recommendations);
    }
    
    // Extract from impact summary
    if (analysisResults.impact_summary?.recommendations) {
      recommendations.push(...analysisResults.impact_summary.recommendations);
    }
    
    return recommendations.filter(Boolean);
  } catch (error) {
    console.warn('Error extracting recommendations:', error);
    return [];
  }
};

export const extractCriticalIssues = (analysisResults: any): string[] => {
  try {
    if (typeof analysisResults === 'string') {
      analysisResults = JSON.parse(analysisResults);
    }
    
    const criticalIssues: string[] = [];
    
    // Extract critical issues from various structures
    if (analysisResults.critical_issues) {
      criticalIssues.push(...analysisResults.critical_issues);
    }
    
    if (analysisResults.issues && Array.isArray(analysisResults.issues)) {
      const critical = analysisResults.issues.filter((issue: any) => 
        issue.severity === 'critical' || issue.priority === 'high'
      );
      criticalIssues.push(...critical.map((issue: any) => issue.description || issue.title));
    }
    
    return criticalIssues.filter(Boolean);
  } catch (error) {
    console.warn('Error extracting critical issues:', error);
    return [];
  }
};

export const calculatePaybackPeriod = (monthlyRevenue: number, recommendationCount: number): number => {
  const implementationCost = recommendationCount * 1200;
  if (monthlyRevenue <= 0) return 0;
  return Math.ceil(implementationCost / monthlyRevenue);
};

export const detectIndustryType = (analysisResults: any): string => {
  const text = JSON.stringify(analysisResults).toLowerCase();
  
  if (text.includes('ecommerce') || text.includes('shopping') || text.includes('cart')) {
    return 'ecommerce';
  }
  if (text.includes('saas') || text.includes('subscription') || text.includes('dashboard')) {
    return 'saas';
  }
  if (text.includes('healthcare') || text.includes('medical') || text.includes('patient')) {
    return 'healthcare';
  }
  if (text.includes('fintech') || text.includes('financial') || text.includes('banking')) {
    return 'fintech';
  }
  if (text.includes('education') || text.includes('learning') || text.includes('course')) {
    return 'education';
  }
  
  return 'general';
};

export const calculateROI = (analysisResults: any, industryType?: string): ROIProjection => {
  // Parse Claude's actual recommendations
  const recommendations = extractRecommendations(analysisResults);
  const criticalIssues = extractCriticalIssues(analysisResults);
  
  // Auto-detect industry if not provided
  const detectedIndustry = industryType || detectIndustryType(analysisResults);
  const baseline = INDUSTRY_BASELINES[detectedIndustry] || INDUSTRY_BASELINES.general;
  
  // Extract confidence score
  const confidenceLevel = analysisResults.confidence_score || 
                         analysisResults.confidence || 85;
  
  // Calculate impact based on Claude's confidence and recommendation severity
  const recommendationWeight = recommendations.length * 0.008; // 0.8% per recommendation
  const criticalIssueWeight = criticalIssues.length * 0.015; // 1.5% per critical issue
  const confidenceWeight = (confidenceLevel / 100) * 0.02; // Up to 2% based on confidence
  
  const totalImprovementPotential = recommendationWeight + criticalIssueWeight + confidenceWeight;
  
  // Calculate revenue based on industry type
  let monthlyRevenue = 0;
  if (baseline.avgOrderValue) {
    monthlyRevenue = baseline.avgOrderValue * totalImprovementPotential * 1000;
  } else if (baseline.avgMRR) {
    monthlyRevenue = baseline.avgMRR * totalImprovementPotential * 100;
  } else if (baseline.avgValue) {
    monthlyRevenue = baseline.avgValue * totalImprovementPotential * 10;
  }
  
  const yearlyProjection = monthlyRevenue * 12;
  const implementationCost = (recommendations.length + criticalIssues.length) * 1200;
  const paybackPeriod = calculatePaybackPeriod(monthlyRevenue, recommendations.length + criticalIssues.length);
  
  return {
    monthlyImpact: Math.round(monthlyRevenue),
    yearlyProjection: Math.round(yearlyProjection),
    implementationCost,
    paybackPeriod,
    confidenceLevel,
    industryType: detectedIndustry,
    recommendationCount: recommendations.length + criticalIssues.length
  };
};

export const calculateTrendAnalysis = (
  analysisData: any[],
  timeframe: 'week' | 'month' | 'quarter' = 'month'
): TrendAnalysis => {
  const now = new Date();
  const timeframeDays = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
  const cutoffDate = new Date(now.getTime() - timeframeDays * 24 * 60 * 60 * 1000);
  
  // Filter recent data
  const recentAnalyses = analysisData.filter(analysis => 
    new Date(analysis.created_at) >= cutoffDate
  );
  
  // Calculate frequency
  const analysisFrequency = {
    daily: Math.round(recentAnalyses.length / timeframeDays),
    weekly: Math.round(recentAnalyses.length / (timeframeDays / 7)),
    monthly: Math.round(recentAnalyses.length / (timeframeDays / 30))
  };
  
  // Calculate confidence correlation with projected impact
  const confidenceScores = recentAnalyses.map(a => a.confidence_score || 85);
  const avgConfidence = confidenceScores.reduce((sum, c) => sum + c, 0) / confidenceScores.length || 85;
  
  const projectedImpacts = recentAnalyses.map(analysis => {
    const roi = calculateROI(analysis.analysis_results || analysis);
    return roi.monthlyImpact;
  });
  const avgProjectedImpact = projectedImpacts.reduce((sum, p) => sum + p, 0) / projectedImpacts.length || 0;
  
  // Simple correlation calculation
  const correlation = calculateCorrelation(confidenceScores, projectedImpacts);
  
  // Calculate improvement trends (weekly segments)
  const improvementTrends = calculateImprovementTrends(recentAnalyses, timeframeDays);
  
  // Identify valuable analysis types
  const valuableAnalysisTypes = calculateValuableAnalysisTypes(recentAnalyses);
  
  return {
    analysisFrequency,
    confidenceCorrelation: {
      avgConfidence,
      projectedImpact: avgProjectedImpact,
      correlation
    },
    improvementTrends,
    valuableAnalysisTypes
  };
};

const calculateCorrelation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};

const calculateImprovementTrends = (analyses: any[], timeframeDays: number) => {
  const weeksCount = Math.ceil(timeframeDays / 7);
  const trends = [];
  
  for (let i = 0; i < weeksCount; i++) {
    const weekStart = new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
    
    const weekAnalyses = analyses.filter(a => {
      const date = new Date(a.created_at);
      return date >= weekStart && date < weekEnd;
    });
    
    if (weekAnalyses.length > 0) {
      const avgConfidence = weekAnalyses.reduce((sum, a) => sum + (a.confidence_score || 85), 0) / weekAnalyses.length;
      const avgROI = weekAnalyses.reduce((sum, a) => {
        const roi = calculateROI(a.analysis_results || a);
        return sum + roi.monthlyImpact;
      }, 0) / weekAnalyses.length;
      
      trends.push({
        period: `Week ${weeksCount - i}`,
        improvement: avgROI,
        confidence: avgConfidence
      });
    }
  }
  
  return trends.reverse();
};

const calculateValuableAnalysisTypes = (analyses: any[]) => {
  const typeGroups: Record<string, any[]> = {};
  
  // Group by analysis type
  analyses.forEach(analysis => {
    const type = analysis.analysis_type || 'general';
    if (!typeGroups[type]) {
      typeGroups[type] = [];
    }
    typeGroups[type].push(analysis);
  });
  
  // Calculate metrics for each type
  return Object.entries(typeGroups).map(([type, typeAnalyses]) => {
    const avgROI = typeAnalyses.reduce((sum, a) => {
      const roi = calculateROI(a.analysis_results || a);
      return sum + roi.monthlyImpact;
    }, 0) / typeAnalyses.length;
    
    const avgConfidence = typeAnalyses.reduce((sum, a) => sum + (a.confidence_score || 85), 0) / typeAnalyses.length;
    
    return {
      type,
      avgROI: Math.round(avgROI),
      frequency: typeAnalyses.length,
      avgConfidence: Math.round(avgConfidence)
    };
  }).sort((a, b) => b.avgROI - a.avgROI);
};
