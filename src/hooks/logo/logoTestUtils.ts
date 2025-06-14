
export const testImageLoad = async (url: string): Promise<boolean> => {
  const DEFAULT_FALLBACK_LOGO = '/lovable-uploads/235bdb67-21d3-44ed-968a-518226eef780.png';
  
  console.log('Testing image load for URL:', url);
  
  if (!url || url === DEFAULT_FALLBACK_LOGO) {
    console.log('Using default fallback logo, considering as valid');
    return true; // Default fallback is always considered valid
  }

  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      console.warn('Image load test timeout for:', url);
      resolve(false);
    }, 5000);

    img.onload = () => {
      console.log('Image load test successful for:', url);
      clearTimeout(timeout);
      resolve(true);
    };

    img.onerror = () => {
      console.error('Image load test failed for:', url);
      clearTimeout(timeout);
      resolve(false);
    };

    // Set crossOrigin for Supabase storage URLs
    if (url.includes('supabase')) {
      img.crossOrigin = 'anonymous';
    }

    img.src = url;
  });
};
