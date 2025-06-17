
import { supabase } from '@/integrations/supabase/client';

interface FileItem {
  id: string | null;
  name: string;
  fullPath?: string;
  created_at?: string;
  metadata?: any;
}

export const getAllFilesRecursively = async (prefix = ''): Promise<FileItem[]> => {
  const { data: items, error } = await supabase.storage
    .from('design-uploads')
    .list(prefix, {
      limit: 1000,
      sortBy: { column: 'created_at', order: 'desc' }
    });

  if (error) {
    console.error('Error listing files in', prefix, ':', error);
    return [];
  }

  const allFiles = [];
  
  for (const item of items || []) {
    if (item.id === null) {
      // This is a directory, explore it recursively
      const subPath = prefix ? `${prefix}/${item.name}` : item.name;
      const subFiles = await getAllFilesRecursively(subPath);
      allFiles.push(...subFiles);
    } else {
      // This is a file
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
      allFiles.push({
        ...item,
        fullPath
      });
    }
  }
  
  return allFiles;
};

export const getPublicUrl = (filePath: string) => {
  const { data: urlData } = supabase.storage
    .from('design-uploads')
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
};
