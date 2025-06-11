
import { extractTextPreview, generateContextFilePath, generateFilePath, uploadFile } from './fileUploadHelpers';
import { insertContextFile, insertDesignUpload } from './databaseHelpers';
import { BatchUploadOptions, BatchUploadResult, ProcessContextFileOptions, ProcessFileOptions, ProcessUrlOptions } from './batchUploadTypes';

export const processFileUpload = async ({
  file,
  userId,
  useCase,
  batchId,
  batchName,
  analysisGoals,
  analysisPreferences
}: ProcessFileOptions) => {
  console.log('Processing file:', file.name);
  
  const filePath = generateFilePath(userId, file);
  await uploadFile(file, userId, filePath);

  return insertDesignUpload(
    userId,
    file.name,
    filePath,
    file.size,
    file.type,
    useCase,
    'file',
    null,
    batchId,
    batchName,
    analysisGoals,
    analysisPreferences
  );
};

export const processUrlUpload = async ({
  url,
  userId,
  useCase,
  batchId,
  batchName,
  analysisGoals,
  analysisPreferences
}: ProcessUrlOptions) => {
  console.log('Processing URL:', url);
  
  try {
    new URL(url); // Validate URL format
  } catch {
    throw new Error(`Invalid URL format: ${url}`);
  }

  return insertDesignUpload(
    userId,
    new URL(url).hostname,
    null,
    null,
    null,
    useCase,
    'url',
    url,
    batchId,
    batchName,
    analysisGoals,
    analysisPreferences
  );
};

export const processContextFile = async ({
  file,
  userId,
  batchId,
  uploadId
}: ProcessContextFileOptions) => {
  console.log('Processing context file:', file.name);
  
  const filePath = generateContextFilePath(userId, file, batchId);
  await uploadFile(file, userId, filePath);

  // Get text content preview for supported file types
  const contentPreview = await extractTextPreview(file);

  return insertContextFile(
    userId,
    uploadId,
    file.name,
    filePath,
    file.type,
    file.size,
    contentPreview
  );
};

export const processBatchUpload = async (options: BatchUploadOptions): Promise<BatchUploadResult> => {
  const { files, urls, contextFiles = [], useCase, batchName, analysisGoals, analysisPreferences } = options;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const batchId = crypto.randomUUID();
  const uploads = [];
  const contextFileUploads = [];

  console.log('Starting batch upload...', { 
    filesCount: files.length, 
    urlsCount: urls.length,
    contextFilesCount: contextFiles.length,
    batchId,
    analysisGoals,
    analysisPreferences
  });

  // Process file uploads
  for (const file of files) {
    const upload = await processFileUpload({
      file,
      userId: user.id,
      useCase,
      batchId,
      batchName,
      analysisGoals,
      analysisPreferences
    });
    uploads.push(upload);
  }

  // Process URL uploads
  for (const url of urls) {
    const upload = await processUrlUpload({
      url,
      userId: user.id,
      useCase,
      batchId,
      batchName,
      analysisGoals,
      analysisPreferences
    });
    uploads.push(upload);
  }

  // Process context files
  for (const contextFile of contextFiles) {
    try {
      const contextFileData = await processContextFile({
        file: contextFile,
        userId: user.id,
        batchId,
        uploadId: uploads[0]?.id || batchId
      });
      if (contextFileData) {
        contextFileUploads.push(contextFileData);
      }
    } catch (error) {
      console.error('Context file processing error:', error);
      // Don't fail the whole upload for context file issues
    }
  }

  console.log('Batch upload completed:', uploads.length, 'items,', contextFileUploads.length, 'context files');
  return { uploads, batchId, contextFiles: contextFileUploads };
};

// Fix the missing import
import { supabase } from '@/integrations/supabase/client';
