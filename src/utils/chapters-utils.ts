import {
  MODULE_MODULE_DATA,
  type Topic,
  type VideoData,
} from '@/data/module-data';

// Enhanced types for chapters
export interface Chapter {
  id: string;
  title: string;
  videoCount: number;
  totalDuration: string;
  completedCount: number;
  completionPercentage: number;
  hasActivities: boolean;
  averageRating: number;
  totalReviews: number;
  description: string;
  thumbnailUrl: string;
  recentVideo: {
    id: string;
    title: string;
    duration: string;
    thumbnailUrl: string;
    isCompleted: boolean;
    isActive: boolean;
  };
}

export interface ChapterVideo {
  id: string;
  title: string;
  author: string;
  authorImageUri: string;
  reviewStars: number;
  reviewCount: number;
  publishDate: string;
  duration: string;
  description: string;
  videoUrl: string;
  srtUrl: string;
  folder: string;
  postActivities?: any[];
  checkingYourself?: any;
  moduleSummary?: any;
  moduleId: string;
  moduleTitle: string;
  completed: boolean;
  isActive: boolean;
}

// Get all chapters/modules with recent video info
export const getAllChapters = (): Chapter[] => {
  return MODULE_MODULE_DATA.map((module, moduleIndex) => {
    const totalMinutes = module.videos.reduce((acc, video) => {
      const [minutes, seconds] = video.duration.split(':').map(Number);
      return acc + minutes + (seconds || 0) / 60;
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    const totalDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    // Simulate completion status - some videos completed, some in progress
    const completedCount = Math.floor(
      module.videos.length * (0.3 + Math.random() * 0.4),
    );
    const completionPercentage = Math.round(
      (completedCount / module.videos.length) * 100,
    );

    const totalRating = module.videos.reduce(
      (acc, video) => acc + video.reviewStars,
      0,
    );
    const averageRating = totalRating / module.videos.length;

    const totalReviews = module.videos.reduce(
      (acc, video) => acc + video.reviewCount,
      0,
    );

    const hasActivities = module.videos.some(
      video => video.postActivities && video.postActivities.length > 0,
    );

    // Get recent/current video (either in progress or next to watch)
    const recentVideoIndex = Math.min(completedCount, module.videos.length - 1);
    const recentVideo = module.videos[recentVideoIndex];

    return {
      id: module.id,
      title: module.title,
      videoCount: module.videos.length,
      totalDuration,
      completedCount,
      completionPercentage,
      hasActivities,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
      description: `${
        module.videos.length
      } comprehensive lessons covering ${module.title.toLowerCase()}`,
      thumbnailUrl: `https://picsum.photos/400/240?random=${module.id}`,
      recentVideo: {
        id: recentVideo.id,
        title: recentVideo.title,
        duration: recentVideo.duration,
        thumbnailUrl: `https://picsum.photos/320/180?random=${recentVideo.id}`,
        isCompleted: recentVideoIndex < completedCount,
        isActive: recentVideoIndex === completedCount,
      },
    };
  });
};

// Get chapter by ID
export const getChapterById = (chapterId: string): Chapter | undefined => {
  const chapters = getAllChapters();
  return chapters.find(chapter => chapter.id === chapterId);
};

// Get videos for a specific chapter as topics
export const getTopicsForChapter = (chapterId: string): Topic[] => {
  const module = MODULE_MODULE_DATA.find(m => m.id === chapterId);
  if (!module) return [];

  return module.videos.map((video, index) => ({
    id: video.id,
    title: video.title,
    duration: video.duration,
    completed: Math.random() > 0.4, // Simulate completion
    hasActivity: (video.postActivities?.length || 0) > 0,
    isActive: index === 0, // First video is active by default
  }));
};

// Get video data for chapter
export const getVideoDataForChapter = (chapterId: string): VideoData | null => {
  const module = MODULE_MODULE_DATA.find(m => m.id === chapterId);
  if (!module || module.videos.length === 0) return null;

  const firstVideo = module?.videos?.[0];
  if (!firstVideo) return null;

  return {
    id: firstVideo.id,
    title: firstVideo.title,
    author: firstVideo.author,
    authorImage: firstVideo.authorImageUri,
    rating: firstVideo.reviewStars,
    reviewCount: firstVideo?.reviewCount?.toString(),
    description: firstVideo.description,
    videoUrl: firstVideo.videoUrl,
    thumbnailUrl: `https://picsum.photos/800/450?random=${firstVideo.id}`,
    hasPostActivity: (firstVideo.postActivities?.length || 0) > 0,
    activityCompleted: Math.random() > 0.5,
  };
};

// Get overall statistics
export const getOverallStatistics = () => {
  const chapters = getAllChapters();

  const totalVideos = chapters.reduce(
    (acc, chapter) => acc + chapter.videoCount,
    0,
  );
  const totalDuration = chapters.reduce((acc, chapter) => {
    const [hours, minutes] = chapter.totalDuration.includes('h')
      ? chapter.totalDuration
          .split('h')
          .map(s => Number.parseInt(s.replace('m', '')))
      : [0, Number.parseInt(chapter.totalDuration.replace('m', ''))];
    return acc + hours * 60 + minutes;
  }, 0);

  const totalCompleted = chapters.reduce(
    (acc, chapter) => acc + chapter.completedCount,
    0,
  );
  const overallCompletion = Math.round((totalCompleted / totalVideos) * 100);

  const totalHours = Math.floor(totalDuration / 60);
  const remainingMinutes = totalDuration % 60;

  return {
    totalChapters: chapters.length,
    totalVideos,
    totalDuration:
      totalHours > 0
        ? `${totalHours}h ${remainingMinutes}m`
        : `${remainingMinutes}m`,
    overallCompletion,
    totalCompleted,
    chaptersWithActivities: chapters.filter(c => c.hasActivities).length,
  };
};

// Search chapters
export const searchChapters = (query: string): Chapter[] => {
  const chapters = getAllChapters();
  const lowerQuery = query.toLowerCase();

  return chapters.filter(
    chapter =>
      chapter.title.toLowerCase().includes(lowerQuery) ||
      chapter.description.toLowerCase().includes(lowerQuery),
  );
};
