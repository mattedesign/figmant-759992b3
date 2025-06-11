
import { BatchUpload } from '@/types/design';

export type BatchUploadResult = {
  uploads: any[];
  batchId: string;
  contextFiles: any[];
};

export type ProcessFileOptions = {
  file: File;
  userId: string;
  useCase: string;
  batchId: string;
  batchName: string | null;
  analysisGoals: string | null;
  analysisPreferences: any;
};

export type ProcessUrlOptions = {
  url: string;
  userId: string;
  useCase: string;
  batchId: string;
  batchName: string | null;
  analysisGoals: string | null;
  analysisPreferences: any;
};

export type ProcessContextFileOptions = {
  file: File;
  userId: string;
  batchId: string;
  uploadId: string;
};

export type BatchUploadOptions = BatchUpload;
