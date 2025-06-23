
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
};

export const safeJsonStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj);
  } catch {
    return '{}';
  }
};

export const isValidEnhancementSettings = (obj: any): obj is import('@/types/enhancement').EnhancementSettings => {
  return obj && 
    typeof obj === 'object' &&
    obj.googleVision && 
    obj.openaiVision && 
    obj.amazonRekognition && 
    obj.microsoftFormRecognizer &&
    ['basic', 'professional', 'enterprise'].includes(obj.tier);
};
