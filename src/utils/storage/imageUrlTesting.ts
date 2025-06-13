
export const testImageUrl = async (url: string): Promise<boolean> => {
  try {
    console.log('Testing image URL accessibility:', url);
    
    // For Supabase storage URLs, try to fetch with proper headers
    if (url.includes('supabase.co/storage')) {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'cors'
      });
      
      console.log('Image URL response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      return response.ok;
    }
    
    // For other URLs or local assets, use image loading test
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        console.warn('Image URL test timeout for:', url);
        resolve(false);
      }, 5000);
      
      img.onload = () => {
        clearTimeout(timeout);
        console.log('Image URL test successful for:', url);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        console.error('Image URL test failed for:', url);
        resolve(false);
      };
      
      // Set crossOrigin for Supabase storage URLs
      if (url.includes('supabase')) {
        img.crossOrigin = 'anonymous';
      }
      
      img.src = url;
    });
    
  } catch (error) {
    console.error('Image URL test error:', error);
    return false;
  }
};
