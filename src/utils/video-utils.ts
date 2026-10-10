import {MODULE_MODULE_DATA} from '@/data/module-data';
import {ImageRequireSource} from 'react-native';

export interface ActiveVideo {
  id: string;
  title: string;
  author: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl?: string;
  moduleTitle: string;
  progress?: number;
  isActive: boolean;
}

export interface VideoRecommendation {
  id: string;
  title: string;
  author: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl?: string | ImageRequireSource;
  moduleTitle: string;
  reason: string;
  priority: number;
}

export function getActiveVideo(): ActiveVideo | null {
  for (const module of MODULE_MODULE_DATA) {
    for (const video of module.videos) {
      // Check if video has progress or is marked as active
      if (video.id === '1.1' || video.id === '2.1') {
        // Mock active videos
        return {
          id: video.id,
          title: video.title,
          author: video.author,
          duration: video.duration,
          videoUrl: video.videoUrl,
          thumbnailUrl: `https://img.youtube.com/vi/placeholder/maxresdefault.jpg`,
          moduleTitle: module.title,
          progress: video.id === '1.1' ? 65 : 0,
          isActive: true,
        };
      }
    }
  }
  return null;
}

export function getVideoRecommendations(): VideoRecommendation[] {
  const recommendations: VideoRecommendation[] = [];

  // Get first video from each module as recommendations
  MODULE_MODULE_DATA.slice(0, 4).forEach((module, index) => {
    const firstVideo = module.videos[0];
    if (firstVideo) {
      recommendations.push({
        id: firstVideo.id,
        title: firstVideo.title,
        author: firstVideo.author,
        duration: firstVideo.duration,
        videoUrl: firstVideo.videoUrl,
        thumbnailUrl: `https://img.youtube.com/vi/placeholder${index}/maxresdefault.jpg`,
        moduleTitle: module.title,
        reason:
          index === 0
            ? 'Start your journey'
            : index === 1
            ? 'Build your foundation'
            : index === 2
            ? 'Manage emotions'
            : 'Continue learning',
        priority: index + 1,
      });
    }
  });

  return recommendations;
}

export function getAllModules() {
  return MODULE_MODULE_DATA.map(module => ({
    id: module.id,
    title: module.title,
    videoCount: module.videos.length,
    totalDuration: calculateModuleDuration(module.videos),
    completedCount: module.videos.filter(v => v.id === '1.1').length, // Mock completion
    firstVideo: module.videos[0],
    hasActivities: module.videos.some(
      v => v.postActivities && v.postActivities.length > 0,
    ),
  }));
}

function calculateModuleDuration(videos: any[]): string {
  // Mock calculation - in real app, sum actual durations
  const totalMinutes = videos.length * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
