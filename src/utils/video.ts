/**
 * Video utility functions
 */

/**
 * Generate thumbnail URL from video URL
 */
export const generateThumbnailUrl = (videoUrl: string): string => {
  // Extract video ID from various video URL formats
  const youtubeRegex =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = videoUrl.match(youtubeRegex);

  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }

  // Fallback for other video sources
  return '/placeholder.svg?height=180&width=320&text=Video+Thumbnail';
};

/**
 * Validate video URL
 */
export const isValidVideoUrl = (url: string): boolean => {
  try {
    const validDomains = [
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'myteal.s3.ca-central-1.amazonaws.com',
    ];
    return validDomains?.some(domain => url?.includes(domain));
  } catch {
    return false;
  }
};

/**
 * Get video quality from URL
 */
export const getVideoQuality = (url: string): 'HD' | 'SD' | 'Unknown' => {
  if (url.includes('hd') || url.includes('1080') || url.includes('720')) {
    return 'HD';
  }
  if (url.includes('sd') || url.includes('480') || url.includes('360')) {
    return 'SD';
  }
  return 'Unknown';
};

/**
 * Calculate video aspect ratio
 */
export const calculateAspectRatio = (width: number, height: number): number => {
  return width / height;
};

/**
 * Check if video supports captions
 */
export const supportsCaptions = (srtUrl?: string): boolean => {
  return Boolean(srtUrl && srtUrl.trim().length > 0);
};
