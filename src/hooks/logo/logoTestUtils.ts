
export const testImageLoad = async (url: string): Promise<boolean> => {
  const DEFAULT_FALLBACK_LOGO = '/lovable-uploads/aed59d55-5b0a-4b7b-b82d-340e25b8ca40.png';
  
  if (!url || url === DEFAULT_FALLBACK_LOGO) {
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

    img.src = url;
  });
};
