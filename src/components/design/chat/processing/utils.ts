
export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const formatTime = (seconds: number) => {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  return `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(0)}s`;
};

export const getEstimatedTimeRemaining = (job: { speed?: number; progress: number; fileSize: number }) => {
  if (!job.speed || job.progress === 0) return 'Calculating...';
  const remainingBytes = job.fileSize * (1 - job.progress / 100);
  const remainingSeconds = remainingBytes / job.speed;
  return formatTime(remainingSeconds);
};
