
// Re-export all hooks for backward compatibility
export { useDesignUploads } from './useDesignUploads';
export { useDesignUseCases } from './useDesignUseCases';
export { useDesignAnalyses } from './useDesignAnalyses';
export { useDesignBatchAnalyses } from './useDesignBatchAnalyses';
export { useDesignContextFiles, useUploadContextFile, useDeleteContextFile } from './useDesignContextFiles';
export { useUploadDesign } from './useUploadDesign';
export { useAnalyzeDesign, useRetryAnalysis } from './useAnalyzeDesign';
export { useBatchUploadDesign } from './useBatchUploadDesign';
export { triggerBatchAnalysis } from './designAnalysisHelpers';
export { generateImpactSummary, type ImpactSummary } from './batch-upload/impactSummaryGenerator';
