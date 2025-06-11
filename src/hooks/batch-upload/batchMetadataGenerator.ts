
export const useBatchMetadataGenerator = () => {
  const generateBatchId = (): string => {
    return crypto.randomUUID();
  };

  const generateBatchMetadata = (
    files: File[],
    urls: string[],
    contextFiles: File[],
    batchName?: string
  ) => {
    const timestamp = new Date().toLocaleDateString();
    const defaultBatchName = `Batch ${timestamp}`;
    
    return {
      batchId: generateBatchId(),
      batchName: batchName || defaultBatchName,
      totalItems: files.length + urls.length,
      contextFilesCount: contextFiles.length,
      timestamp
    };
  };

  const logBatchInfo = (metadata: any, analysisGoals?: string, analysisPreferences?: any, useCaseId?: string) => {
    console.log('Starting batch upload...', { 
      filesCount: metadata.totalItems - metadata.contextFilesCount,
      urlsCount: 0, // Will be calculated in processor
      contextFilesCount: metadata.contextFilesCount,
      batchId: metadata.batchId,
      useCaseId,
      useCaseType: useCaseId?.startsWith('figmant_') ? 'Figmant Template' : 'Standard Use Case',
      analysisGoals,
      analysisPreferences
    });
  };

  return {
    generateBatchId,
    generateBatchMetadata,
    logBatchInfo
  };
};
