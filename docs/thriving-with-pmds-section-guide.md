## System Architecture

The "Thriving with PMDs" section uses a **hybrid architecture** that combines:

- **Dynamic video content** from a CDN (Content Delivery Network)
- **Static activity templates** hardcoded in the app

```
CDN Videos + Hardcoded Activities = Complete Learning Modules
```

### File Locations

```
src/screens/learn/Learn.tsx          # Main component
src/hooks/use-media.ts               # CDN data fetching hook
src/core/stores/slices/media.slice.ts # Media state management
src/types/media.ts                   # Type definitions
```

## Data Flow

### 1. Initial Load Process

```
App Starts → useMedia Hook → Media Store → CDN API → Video Data
     ↓
Video Data + Activity Templates → Module Generation → UI Render
```

### 2. Step-by-Step Flow

1. **Component Mount**: `Learn.tsx` component mounts
2. **Hook Activation**: `useMedia()` hook is called
3. **Store Check**: Media store checks for cached data (5-minute cache)
4. **API Call**: If no cache, calls CDN API via `mediaApiClient.fetchMedia()`
5. **Data Processing**: Raw CDN data is filtered and organized
6. **Module Creation**: Videos are combined with hardcoded activities
7. **UI Rendering**: Modules are displayed as cards

## Key Components

### 1. useMedia Hook (`src/hooks/use-media.ts`)

```typescript
export const useMedia = () => {
  const {
    groups, // Organized video groups from CDN
    ungrouped, // Videos without folder structure
    loading, // Loading state
    error, // Error state
    lastUpdated, // Cache timestamp
    loadMedia, // Function to load data
    refreshMedia, // Function to refresh data
    clearMedia, // Function to clear cache
  } = useAppStore(useShallow(state => state.media));

  return {
    groups,
    ungrouped,
    loading,
    error,
    lastUpdated,
    refreshMedia,
    clearMedia,
    hasData: groups.length > 0 || ungrouped.length > 0,
  };
};
```

**Purpose**: Provides a React hook interface to access CDN video data and loading states.

### 2. Media Store (`src/core/stores/slices/media.slice.ts`)

**Key Functions**:

- `loadMedia()`: Fetches video data from CDN
- `processMediaItem()`: Converts raw CDN data to app format
- `refreshMedia()`: Forces refresh of CDN data
- `clearMedia()`: Clears cached data

**Data Processing**:

```typescript
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
```

## The Hybrid Approach

### Why Hybrid?

The system uses a hybrid approach because:

- **Videos**: Need to be updated frequently by content creators (stored on CDN)
- **Activities**: Are structured interactions that rarely change (hardcoded for stability)
- **Flexibility**: Videos can be added/removed without app updates
- **Reliability**: Activities don't depend on network connectivity

### How It Works

1. **Videos from CDN**:

   - Fetched dynamically
   - Organized by folder structure
   - Can be updated without app release

2. **Activities from Templates**:
   - Stored in `moduleActivityTemplates` object
   - Mapped to specific modules and video positions
   - Require app update to change

## Module Structure

### CDN Folder Structure Expected

```
1. Know Thyself/
   ├── video1.mp4
   ├── video2.mp4
   └── video3.mp4

2. Creating a Safety Plan/
   ├── video1.mp4
   ├── video2.mp4
   ├── video3.mp4
   ├── video4.mp4
   └── video5.mp4

3. Coping with Anger and Irritability/
   ├── video1.mp4
   ├── video2.mp4
   ├── video3.mp4
   ├── video4.mp4
   ├── video5.mp4
   └── video6.mp4
```

### Module Parsing Logic

```typescript
const folderMatch = folder.match(/^(\d+)\.\s*(.+)/);
//                    ^    ^      ^
//                    |    |      Module title
//                    |    Space after dot
//                    Module number
```

**Example**:

- Folder: `"1. Know Thyself"`
- Parsed: `moduleId = "1"`, `moduleTitle = "Know Thyself"`

## Activity Templates

### Structure

```typescript
const moduleActivityTemplates = {
  '1': {    // Module ID
    0: [    // Video index (first video = 0)
      {
        id: 'activity_1_1',
        type: 'Activity: Calendar',
        question: 'Your Cycle',
        description: 'Here is a prediction of your menstrual cycle',
        responseType: 'review',
        tags: ['calendar', 'predictions'],
        thumbnailUrl: null, // Set dynamically
      },
    ],
    1: [ ... ], // Second video activities
    2: [ ... ], // Third video activities
  },
  '2': { ... }, // Module 2 activities
  '3': { ... }, // Module 3 activities
};
```

### Activity Types

1. **Calendar Activities**: `'Activity: Calendar'`
2. **Text Input**: `'Activity: text input'`
3. **Multiple Choice**: `'Activity: multiple choice'`
4. **Text List**: `'Activity: text list'`
5. **Review Cards**: `'Activity: review card'`
6. **Contact Review**: `'Activity: contact review'`
7. **Support Resources**: `'Activity: support resources'`

### Adding New Activities

To add activities for a new video:

```typescript
// If adding to module 1, video 4 (index 3)
'1': {
  // ... existing videos
  3: [  // Fourth video activities
    {
      id: 'activity_1_4',
      type: 'Activity: text input',
      question: 'Your new question here',
      description: 'Description of what the user should do',
      responseType: 'text_input',
      tags: ['new_tag', 'category'],
      thumbnailUrl: null,
    },
  ],
},
```

## Video Processing

### CDN Data → App Data

1. **Raw CDN Response**:

```json
{
  "list": [
    {
      "Key": "folder/1. Know Thyself/intro-video.mp4",
      "link": "https://cdn.example.com/path/to/video.mp4"
    }
  ]
}
```

2. **Processed Data**:

```typescript
{
  id: "intro-video-1638360000000",
  url: "https://cdn.example.com/path/to/video.mp4",
  title: "intro-video",
  type: "video",
  folder: "1. Know Thyself"
}
```

3. **Final Module Structure**:

```typescript
{
  id: "1",
  title: "Know Thyself",
  videos: [
    {
      id: "intro-video-1638360000000",
      title: "intro-video",
      videoUrl: "https://cdn.example.com/path/to/video.mp4",
      srtUrl: "https://cdn.example.com/path/to/video.mp4.srt",
      author: "Dr. Jennifer Gordon",
      duration: "5-10 mins",
      thumbnailUrl: IMAGES.articleCover1,
      description: "Video from CDN: intro-video",
      folder: "1. Know Thyself",
      postActivities: [/* activities for this video */]
    }
  ],
  thumbnail: IMAGES.articleCover1,
  description: "Know Thyself - Content from CDN"
}
```

## Rendering Logic

### Component Structure

```typescript
// In Learn.tsx render method
<ContentSection title="Thriving with PMDs">
  {mediaData.loading ? (
    <LoadingIndicator />
  ) : cdnModules.length > 0 ? (
    cdnModules
      .filter(item => ['1', '2', '3'].includes(item.id)) // Only modules 1-3
      .map(item => (
        <ContentCard
          key={item.id}
          title={item.title}
          subtitle="Dr. Jennifer Gordon"
          image={item.thumbnail}
          tag="Mental Health"
          onPress={() =>
            navigation.navigate('LearnModuleShowcase', {module: item})
          }
        />
      ))
  ) : (
    <PlaceholderMessage />
  )}
</ContentSection>
```

### Thumbnail Assignment

Thumbnails are assigned cyclically from `articleCovers` array:

```typescript
const moduleNum = parseInt(moduleId);
const thumbnailIndex = Math.max(0, (moduleNum - 1) % articleCovers.length);
moduleGroups[moduleId] = {
  title: moduleTitle,
  videos: [],
  thumbnail: articleCovers[thumbnailIndex], // Module thumbnail
};
```

For individual videos:

```typescript
const videoThumbnailIndex = Math.max(0, videoIndex % articleCovers.length);
thumbnailUrl: articleCovers[videoThumbnailIndex];
```

## Navigation

### User Flow

1. **Learn Screen**: User sees module cards
2. **Tap Module**: Navigate to `'LearnModuleShowcase'` with module data
3. **Module Details**: User sees videos and activities for the module
4. **Video Selection**: User can watch videos and complete activities

### Navigation Code

```typescript
onPress={() =>
  navigation.navigate('LearnModuleShowcase', {
    module: item  // Complete module object with videos and activities
  })
}
```

## Troubleshooting

### Common Issues

#### 1. No Modules Showing

**Symptoms**: Empty section or "Please Wait..." message persists

**Debugging**:

```typescript
// Check console logs for:
console.log('Videos from CDN - Loading:', mediaData.loading);
console.log('Videos from CDN - Has data:', mediaData.hasData);
console.log('Total CDN groups:', mediaData.groups.length);
```

**Possible Causes**:

- CDN API is down
- Network connectivity issues
- CDN data doesn't match expected format
- No videos have "My Teal" in the URL

#### 2. Activities Not Showing

**Symptoms**: Videos load but no activities appear

**Debugging**:

```typescript
// Check if activities are being attached:
cdnModules.forEach(module => {
  const totalActivities = module.videos.reduce(
    (sum, video) => sum + (video.postActivities?.length || 0),
    0,
  );
  console.log(`Module ${module.id}: ${totalActivities} activities`);
});
```

**Possible Causes**:

- Module ID doesn't match `moduleActivityTemplates` keys
- Video index exceeds available activity templates
- Activity template structure is incorrect

#### 3. Wrong Module Order

**Symptoms**: Modules appear in wrong sequence

**Fix**: Check the sorting logic:

```typescript
return Object.entries(moduleGroups)
  .sort(([a], [b]) => parseInt(a) - parseInt(b)) // Sorts by module ID numerically
  .map(([moduleId, moduleData]) => ({ ... }));
```

#### 4. Videos Not Loading

**Symptoms**: Module cards show but videos don't play

**Debugging**:

- Check video URLs in console logs
- Verify CDN permissions
- Check if video format is supported

## Maintenance Guide

### Adding a New Module

1. **CDN Structure**: Create folder like `"4. New Module Name"`
2. **Add Activities**: Add to `moduleActivityTemplates`:

```typescript
const moduleActivityTemplates = {
  // ... existing modules
  '4': {
    0: [
      {
        id: 'activity_4_1',
        type: 'Activity: text input',
        question: 'Your question',
        description: 'Activity description',
        responseType: 'text_input',
        tags: ['new_module'],
        thumbnailUrl: null,
      },
    ],
  },
};
```

3. **Update Filter**: Modify the filter to include new module:

```typescript
.filter(item => ['1', '2', '3', '4'].includes(item.id))
```

### Adding Videos to Existing Module

1. **Upload to CDN**: Add video to appropriate folder
2. **Add Activities**: Add new video index to module activities:

```typescript
'1': {
  0: [ /* existing */ ],
  1: [ /* existing */ ],
  2: [ /* existing */ ],
  3: [ /* NEW VIDEO ACTIVITIES */ ],
},
```

### Updating Activity Content

1. **Find Activity**: Locate in `moduleActivityTemplates`
2. **Update Properties**: Modify question, description, options, etc.
3. **Test**: Verify changes appear correctly in app

### Changing Video Sources

1. **Update CDN**: Replace video files maintaining same folder structure
2. **Clear Cache**: Call `clearMedia()` to force refresh
3. **Test**: Verify new videos load correctly

### Performance Optimization

#### Cache Management

The system caches CDN data for 5 minutes:

```typescript
if (rawItems && lastUpdated && Date.now() - lastUpdated < 1000 * 60 * 5) {
  return; // Use cached data
}
```

**To adjust cache duration**:

```typescript
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes
if (rawItems && lastUpdated && Date.now() - lastUpdated < CACHE_DURATION) {
  return;
}
```

#### Loading States

The component handles loading gracefully:

```typescript
{
  mediaData.loading ? (
    <LoadingIndicator />
  ) : cdnModules.length > 0 ? (
    <ModuleCards />
  ) : (
    <EmptyState />
  );
}
```

### Error Handling

#### Network Errors

```typescript
try {
  const response = await mediaApiClient.fetchMedia();
  // ... process response
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
```

#### Data Validation

The system filters invalid items:

```typescript
const allItems = (response.list || [])
  .map(processMediaItem)
  .filter((item): item is MediaItem => !!item) // Remove null items
  .filter(item => item.url.includes('My Teal')); // Only My Teal content
```

### Testing

#### Manual Testing Checklist

1. **Module Loading**: Verify all 3 modules appear
2. **Video Count**: Check each module has expected video count
3. **Activity Attachment**: Verify activities are attached to videos
4. **Navigation**: Test tapping modules navigates correctly
5. **Offline Behavior**: Test with no network connection
6. **Cache Behavior**: Test cache expiration and refresh

#### Debug Console Commands

```javascript
// In browser/debugger console:

// Check current media state
console.log(mediaStore.getState().media);

// Force refresh
mediaStore.getState().media.refreshMedia();

// Clear cache
mediaStore.getState().media.clearMedia();
```

### Future Improvements

1. **Error Recovery**: Add retry mechanisms for failed CDN requests
2. **Progressive Loading**: Load modules individually as needed
3. **Offline Support**: Cache videos locally for offline viewing
4. **Dynamic Activities**: Move activities to CDN for easier updates
5. **Analytics**: Track module engagement and completion rates

---

## Summary

The "Thriving with PMDs" section is a sophisticated hybrid system that combines dynamic video content from a CDN with static activity templates. Understanding this architecture is key to maintaining and extending the system effectively. The separation of concerns allows for flexible content updates while maintaining stable interactive features.

For questions or issues not covered in this guide, check the console logs first, then review the data flow from CDN → Store → Component → UI to identify where the issue occurs.
