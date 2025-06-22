
// Core interfaces for context-aware analysis results
export interface AnalysisAttachment {
  id: string;
  name: string;
  type: 'image' | 'url' | 'figma' | 'file';
  url?: string;
  thumbnailUrl?: string;
  fileSize?: number;
  mimeType?: string;
  uploadPath?: string;
  metadata?: {
    dimensions?: { width: number; height: number };
    domain?: string; // for URLs
    figmaFileKey?: string; // for Figma files
    screenshots?: {
      desktop?: { url: string; success: boolean };
      mobile?: { url: string; success: boolean };
    };
  };
}

export interface ContextualRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'ux' | 'conversion' | 'accessibility' | 'performance' | 'branding' | 'content';
  priority: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  relatedAttachmentIds: string[];
  specificFindings?: string[];
  suggestedActions?: string[];
  estimatedImpact?: {
    conversionLift?: string;
    userExperience?: string;
    implementation?: 'easy' | 'medium' | 'complex';
  };
}

export interface AnalysisSummaryMetrics {
  totalRecommendations: number;
  highPriorityCount: number;
  averageConfidence: number;
  attachmentsAnalyzed: number;
  categoriesIdentified: string[];
  estimatedImplementationTime?: string;
}

export interface ContextualAnalysisResult {
  id: string;
  summary: string;
  recommendations: ContextualRecommendation[];
  attachments: AnalysisAttachment[];
  metrics: AnalysisSummaryMetrics;
  createdAt: string;
  analysisType: string;
}

// Utility types for component props
export interface RecommendationCardProps {
  recommendation: ContextualRecommendation;
  attachments: AnalysisAttachment[];
  onAttachmentClick?: (attachment: AnalysisAttachment) => void;
  className?: string;
}

export interface AttachmentReferenceProps {
  attachment: AnalysisAttachment;
  onClick?: () => void;
  showPreview?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface AnalysisSummaryProps {
  metrics: AnalysisSummaryMetrics;
  recommendations: ContextualRecommendation[];
  className?: string;
}
