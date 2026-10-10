export const formatTime = (seconds: number): string => {
  if (!seconds || seconds < 0) return '0:00';

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatProgress = (current: number, total: number): string => {
  if (!total || total <= 0) return '0%';
  return `${Math.round((current / total) * 100)}%`;
};

export const formatRating = (rating: number): string => {
  return rating ? rating.toFixed(1) : '0.0';
};
