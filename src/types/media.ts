export type MediaType = 'video' | 'subtitle';

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  type: MediaType;
  folder?: string;
}

export interface MediaGroup {
  title: string;
  items: MediaItem[];
}

export type MediaState = {
  groups: MediaGroup[];
  ungrouped: MediaItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
};

export type MediaActions = {
  loadMedia: () => Promise<void>;
  refreshMedia: () => Promise<void>;
  clearMedia: () => void;
};

export type MediaStore = MediaState & MediaActions;
