
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ZoomIn, Download, ExternalLink, Trophy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { supabase } from '@/integrations/supabase/client';

interface DesignScreenshotProps {
  imageUrl?: string;
  fileName?: string;
  uploadId?: string;
  overallScore: number;
  isWinner?: boolean;
}

export const DesignScreenshot: React.FC<DesignScreenshotProps> = ({
  imageUrl,
  fileName,
  uploadId,
  overallScore,
  isWinner = false
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);
  const { data: uploads } = useDesignUploads();

  // Find the upload details if uploadId is provided
  const upload = uploadId ? uploads?.find(u => u.id === uploadId) : null;
  const displayImageUrl = imageUrl || fullImageUrl;
  const displayFileName = fileName || upload?.file_name || 'Design';

  React.useEffect(() => {
    const loadImageUrl = async () => {
      if (!upload?.file_path || upload.source_type !== 'file') return;

      try {
        const { data, error } = await supabase.storage
          .from('design-uploads')
          .createSignedUrl(upload.file_path, 3600);

        if (error) {
          console.error('Error getting signed URL:', error);
          setImageError(true);
          return;
        }

        setFullImageUrl(data.signedUrl);
      } catch (error) {
        console.error('Error loading image:', error);
        setImageError(true);
      }
    };

    if (uploadId && !imageUrl) {
      loadImageUrl();
    }
  }, [uploadId, imageUrl, upload]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 8) return 'default';
    if (score >= 6) return 'secondary';
    return 'destructive';
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  const handleDownload = async () => {
    if (!displayImageUrl) return;

    try {
      const response = await fetch(displayImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = displayFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (!displayImageUrl && !upload) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Image Display */}
          <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
            {imageError ? (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {upload?.source_type === 'url' ? 'Website Analysis' : 'Image unavailable'}
                </p>
                {upload?.source_url && (
                  <p className="text-xs text-blue-600 mt-1 truncate max-w-48">
                    {upload.source_url}
                  </p>
                )}
              </div>
            ) : displayImageUrl ? (
              <>
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-lg bg-gray-300 h-12 w-12"></div>
                    </div>
                  </div>
                )}
                <img
                  src={displayImageUrl}
                  alt={displayFileName}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isImageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </>
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-sm text-muted-foreground">Loading design...</p>
              </div>
            )}

            {/* Score Overlay */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              {isWinner && (
                <Badge variant="default" className="bg-yellow-500 text-white flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  Winner
                </Badge>
              )}
              <Badge variant={getScoreBadgeVariant(overallScore)} className="font-bold">
                {overallScore}/10
              </Badge>
            </div>

            {/* Progress Bar Overlay */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="h-2 bg-black bg-opacity-20">
                <div 
                  className={`h-full transition-all duration-500 ${getScoreColor(overallScore)}`}
                  style={{ width: `${overallScore * 10}%` }}
                />
              </div>
            </div>
          </div>

          {/* Info Bar */}
          <div className="p-3 bg-white border-t flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayFileName}</p>
              <p className="text-xs text-muted-foreground">
                {upload?.source_type === 'url' ? 'Website' : 'Image'} • Score: {overallScore}/10
              </p>
            </div>
            <div className="flex items-center gap-2 ml-3">
              {displayImageUrl && (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <ZoomIn className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                      <DialogHeader className="p-4 pb-2">
                        <DialogTitle>{displayFileName}</DialogTitle>
                      </DialogHeader>
                      <div className="p-4 pt-0">
                        <img
                          src={displayImageUrl}
                          alt={displayFileName}
                          className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0"
                    onClick={handleDownload}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </>
              )}
              {upload?.source_url && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 w-8 p-0"
                  onClick={() => window.open(upload.source_url, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
