
export interface CompleteAnalysisScore {
  // Overall Platform Score (0-1000 points)
  overallPlatformScore: number;
  
  // UC-024: Competitive Intelligence Analysis
  competitiveAnalysis: {
    competitorBenchmarkScore: number;        // 0-100
    marketPositionScore: number;             // 0-100
    competitiveAdvantageScore: number;       // 0-100
    gapAnalysisScore: number;                // 0-100
    competitorTrendScore: number;            // 0-100
  };
  
  // UC-018: E-commerce Revenue Optimization
  revenueOptimization: {
    conversionOptimizationScore: number;     // 0-100
    checkoutFunnelScore: number;             // 0-100
    productPageScore: number;                // 0-100
    trustSignalScore: number;                // 0-100
    revenueGrowthPotential: number;          // 0-100
    estimatedROI: ROIProjection;
  };
  
  // UC-005: A/B Testing & Experimentation
  testingIntelligence: {
    testingReadinessScore: number;           // 0-100
    experimentPotentialScore: number;        // 0-100
    statisticalPowerScore: number;           // 0-100
    variationOpportunityScore: number;       // 0-100
    testingVelocityScore: number;            // 0-100
    suggestedTests: ABTestRecommendation[];
  };
  
  // UC-012: Visual Hierarchy & Design Quality
  visualDesignAnalysis: {
    hierarchyEffectivenessScore: number;     // 0-100
    eyeTrackingSimulationScore: number;      // 0-100
    visualWeightDistributionScore: number;   // 0-100
    readabilityScore: number;                // 0-100
    aestheticQualityScore: number;           // 0-100
    visualFlowAnalysis: VisualFlowData;
  };
  
  // UC-031: Copy & Messaging Optimization
  messagingAnalysis: {
    headlineEffectivenessScore: number;      // 0-100
    ctaOptimizationScore: number;            // 0-100
    valuePropositionScore: number;           // 0-100
    messagingConsistencyScore: number;       // 0-100
    competitorMessageGapScore: number;       // 0-100
    messagingRecommendations: MessagingRecommendation[];
  };
  
  // UC-032: Mobile vs Desktop Optimization
  deviceOptimization: {
    mobileOptimizationScore: number;         // 0-100
    desktopOptimizationScore: number;        // 0-100
    responsiveDesignScore: number;           // 0-100
    touchTargetOptimizationScore: number;    // 0-100
    crossDeviceConsistencyScore: number;     // 0-100
    deviceSpecificRecommendations: DeviceRecommendation[];
  };
  
  // UC-033/UC-040: Accessibility & Legal Compliance
  accessibilityCompliance: {
    wcagComplianceScore: number;             // 0-100
    adaComplianceScore: number;              // 0-100
    legalRiskScore: number;                  // 0-100 (higher = lower risk)
    inclusivityScore: number;                // 0-100
    businessImpactScore: number;             // 0-100
    complianceLevel: 'A' | 'AA' | 'AAA';
    legalRiskAssessment: LegalRiskReport;
  };
  
  // UC-034: Design System Validation
  designSystemHealth: {
    componentConsistencyScore: number;       // 0-100
    systemAdoptionScore: number;             // 0-100
    scalabilityScore: number;                // 0-100
    maintenanceEfficiencyScore: number;      // 0-100
    crossProductConsistencyScore: number;    // 0-100
    systemROIScore: number;                  // 0-100
    migrationPlan: MigrationStrategy;
  };
  
  // UC-035: Seasonal Campaign Intelligence
  campaignIntelligence: {
    seasonalReadinessScore: number;          // 0-100
    trendAlignmentScore: number;             // 0-100
    competitorGapScore: number;              // 0-100
    campaignTimingScore: number;             // 0-100
    predictedPerformanceScore: number;       // 0-100
    seasonalRecommendations: SeasonalStrategy[];
  };
  
  // Cross-Use Case Intelligence
  platformIntelligence: {
    overallDesignMaturity: number;           // 0-100
    businessImpactPotential: number;         // 0-100
    implementationPriority: PriorityMatrix;
    crossUseCaseOpportunities: OpportunityMap;
    platformROIProjection: ROIAnalysis;
  };
}

export interface ROIProjection {
  estimatedLift: number;
  confidenceInterval: [number, number];
  timeToImpact: number; // days
  investmentRequired: number;
  projectedReturn: number;
}

export interface ABTestRecommendation {
  testName: string;
  hypothesis: string;
  expectedLift: number;
  difficulty: 'low' | 'medium' | 'high';
  estimatedDuration: number; // days
  priority: number; // 1-10
}

export interface VisualFlowData {
  heatmapData: HeatmapPoint[];
  scanPath: ScanPathPoint[];
  attentionMetrics: AttentionMetric[];
}

export interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
}

export interface ScanPathPoint {
  x: number;
  y: number;
  order: number;
  duration: number;
}

export interface AttentionMetric {
  element: string;
  attentionScore: number;
  timeToNotice: number;
}

export interface MessagingRecommendation {
  type: 'headline' | 'cta' | 'value-prop' | 'body-copy';
  current: string;
  suggested: string;
  impact: 'high' | 'medium' | 'low';
  reasoning: string;
}

export interface DeviceRecommendation {
  device: 'mobile' | 'tablet' | 'desktop';
  issue: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  implementation: string;
}

export interface LegalRiskReport {
  riskLevel: 'high' | 'medium' | 'low';
  violationTypes: string[];
  remedationSteps: string[];
  estimatedCost: number;
  timelineToComply: number; // days
}

export interface MigrationStrategy {
  phases: MigrationPhase[];
  totalTimelineWeeks: number;
  estimatedEffort: number; // person-weeks
  riskFactors: string[];
}

export interface MigrationPhase {
  name: string;
  duration: number; // weeks
  deliverables: string[];
  dependencies: string[];
}

export interface SeasonalStrategy {
  season: string;
  opportunity: string;
  timeline: string;
  expectedImpact: number;
  implementation: string[];
}

export interface PriorityMatrix {
  highImpactLowEffort: OpportunityItem[];
  highImpactHighEffort: OpportunityItem[];
  lowImpactLowEffort: OpportunityItem[];
  lowImpactHighEffort: OpportunityItem[];
}

export interface OpportunityItem {
  title: string;
  description: string;
  impact: number; // 1-10
  effort: number; // 1-10
  roi: number;
  timeline: string;
}

export interface OpportunityMap {
  crossSellingOpportunities: string[];
  featureGaps: string[];
  integrationNeeds: string[];
  scalingChallenges: string[];
}

export interface ROIAnalysis {
  currentValue: number;
  potentialValue: number;
  investmentRequired: number;
  timeToValue: number; // months
  riskFactors: string[];
}
