import {mediaApiClient} from '@/services/api/media';
import {MediaGroup, MediaItem} from '@/types/media';
import type {StateCreator} from 'zustand';

interface MediaState {
  groups: MediaGroup[];
  ungrouped: MediaItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  rawItems?: MediaItem[];
}

interface MediaActions {
  loadMedia: () => Promise<void>;
  refreshMedia: () => Promise<void>;
  clearMedia: () => void;
}

export interface MediaSlice {
  media: MediaState & MediaActions;
}

const processMediaItem = (item: {
  link?: string;
  Key?: string;
}): MediaItem | null => {
  if (!item.Key || !item.link) return null;

  const parts = item.Key.split('/').slice(1);
  const title = parts.at(-1)?.replace(/\.(mp4|srt)$/, '') || '';
  const type = item.Key.endsWith('.srt') ? 'subtitle' : 'video';
  const folder = parts.length > 1 ? parts[0] : undefined;

  return {
    id: `${title}-${Date.now()}`,
    url: item.link,
    title,
    type,
    folder,
  };
};

const createMediaSlice: StateCreator<MediaSlice, [], [], MediaSlice> = (
  set,
  get,
) => ({
  media: {
    groups: [],
    ungrouped: [],
    loading: false,
    error: null,
    lastUpdated: null,

    loadMedia: async () => {
      console.log('Loading media...');
      const {lastUpdated, rawItems} = get().media;

      if (rawItems && lastUpdated && Date.now() - lastUpdated < 1000 * 60 * 5) {
        // Use cached data if fetched within 5 minutes
        return;
      }

      set(state => ({
        media: {
          ...state.media,
          loading: true,
          error: null,
        },
      }));

      try {
        const response = await mediaApiClient.fetchMedia();
        console.log('Fetched media:', response);
        const allItems = (response.list || [])
          .map(processMediaItem)
          .filter((item): item is MediaItem => !!item)
          .filter(item => item.url.includes('My Teal'));

        console.log(`=== Media Processing Results ===`);
        console.log(`Processed ${allItems.length} valid "My Teal" items`);
        allItems.forEach((item, index) => {
          console.log(
            `Item ${index + 1}: ${item.title} (${item.type}) - Folder: ${
              item.folder || 'None'
            }`,
          );
        });

        const groupedMap = allItems.reduce<Record<string, MediaItem[]>>(
          (acc, item) => {
            if (item.folder) {
              acc[item.folder] = acc[item.folder] || [];
              acc[item.folder].push(item);
            }
            return acc;
          },
          {},
        );

        const groups: MediaGroup[] = Object.entries(groupedMap).map(
          ([title, items]) => ({
            title,
            items,
          }),
        );

        const ungrouped = allItems.filter(item => !item.folder);

        set(state => ({
          media: {
            ...state.media,
            groups,
            ungrouped,
            loading: false,
            lastUpdated: Date.now(),
            rawItems: allItems,
          },
        }));
      } catch (err) {
        console.error('Failed to load media:', err);
        set(state => ({
          media: {
            ...state.media,
            error: err instanceof Error ? err.message : 'Failed to load media',
            loading: false,
          },
        }));
      }
    },

    refreshMedia: async () => {
      set(state => ({
        media: {
          ...state.media,
          loading: true,
          error: null,
        },
      }));

      try {
        const response = await mediaApiClient.fetchMedia();
        const allItems = (response.list || [])
          .map(processMediaItem)
          .filter((item): item is MediaItem => !!item)
          .filter(item => item.url.includes('My Teal'));

        const groupedMap = allItems.reduce<Record<string, MediaItem[]>>(
          (acc, item) => {
            if (item.folder) {
              acc[item.folder] = acc[item.folder] || [];
              acc[item.folder].push(item);
            }
            return acc;
          },
          {},
        );

        const groups: MediaGroup[] = Object.entries(groupedMap).map(
          ([title, items]) => ({
            title,
            items,
          }),
        );

        const ungrouped = allItems.filter(item => !item.folder);

        set(state => ({
          media: {
            ...state.media,
            groups,
            ungrouped,
            loading: false,
            lastUpdated: Date.now(),
            rawItems: allItems,
          },
        }));
      } catch (err) {
        set(state => ({
          media: {
            ...state.media,
            error:
              err instanceof Error ? err.message : 'Failed to refresh media',
            loading: false,
          },
        }));
      }
    },

    clearMedia: () => {
      mediaApiClient.cancelActiveRequest?.(); // Optional
      set(state => ({
        media: {
          ...state.media,
          groups: [],
          ungrouped: [],
          loading: false,
          error: null,
          lastUpdated: null,
          rawItems: undefined,
        },
      }));
    },
  },
});

export default createMediaSlice;
