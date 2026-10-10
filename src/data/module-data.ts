import {transformToChapters} from '@/core/stores/slices/playlist/helpers';
import {VideoActivity} from '@/core/stores/slices/playlist/types';
import {
  AdConfig,
  AudioTrack,
  BufferConfig,
  Chapters,
  DebugConfig,
  Drm,
  OnBufferData,
  OnLoadData,
  OnProgressData,
  OnReceiveAdEventData,
  OnSeekData,
  OnVideoErrorData,
  ReactVideoPoster,
  ReactVideoSource,
  SelectedAudioTrack,
  SelectedTextTrack,
  SelectedVideoTrack,
  SubtitleStyle,
  VideoMetadata,
  VideoTrack,
} from 'react-native-video';
import {ImageRequireSource} from 'react-native';

type Float = number;

export interface CheckingYourself {
  question: string;
  yesText: string;
  noText: string;
}

export type VideoData = {
  id: string;
  title: string;
  thumbnailUrl: string | ImageRequireSource;
  endThumbnailUrl: string | ImageRequireSource;
  author?: string;
  authorImageUri?: string;
  reviewStars?: number;
  reviewCount?: number;
  publishDate?: string;
  duration?: string | number;
  description?: string;
  videoUrl: string;
  srtUrl?: string;
  folder?: string;
  completed?: boolean;
  hasActivity?: boolean;
  postActivities?: VideoActivity[];
  checkingYourself?: CheckingYourself;
  moduleSummary?: {
    moduleId: string;
    title: string;
    description: string;
    includeActivities: string[];
    ezModeAccess: boolean;
    editOption: boolean;
    shareOption?: boolean;
  };

  // Playback state
  currentTime?: number;
  progress?: number;
  videoFinished?: boolean;
  isBuffering?: boolean;
  isLoaded?: boolean;
  textTracks?: boolean;
  paused?: boolean;
  muted?: boolean;
  repeat?: boolean;
  volume?: number;
  playbackSpeed?: number;
  fullscreen?: boolean;
  error?: OnVideoErrorData | null;

  // Tracks & selection
  audioTracks?: AudioTrack[];
  videoTracks?: VideoTrack[];
  selectedTextTrack?: SelectedTextTrack;
  selectedAudioTrack?: SelectedAudioTrack;
  selectedVideoTrack?: SelectedVideoTrack;
  subtitlesEnabled?: boolean;
  subtitleStyle?: SubtitleStyle;

  // DRM & Ads & Buffering
  drm?: Drm;
  adConfig?: AdConfig;
  bufferConfig?: BufferConfig;
  debugConfig?: DebugConfig;

  // Extra metadata
  metadata?: VideoMetadata;
  chapters?: Chapters[];

  // Event logs
  lastLoadEvent?: OnLoadData;
  lastProgressEvent?: OnProgressData;
  lastBufferEvent?: OnBufferData;
  lastSeekEvent?: OnSeekData;
  lastAdEvent?: OnReceiveAdEventData;

  // Chapters
  chaptersEnabled?: boolean;
  onChapterNext?: () => void;
  onChapterPrev?: () => void;
  source?: ReactVideoSource;
  poster?: ReactVideoPoster;

  // Animations (future)
  shouldAnimateProgress?: boolean;
  progressAnimationDuration?: number;
};

export interface Module {
  id: string;
  title: string;
  thumbnail?: string;
  videos: VideoData[];
}

export interface Topic extends VideoData {}

// --- THEME & ANIMATION CONSTANTS ---

export const MEDIA_CHAPTER_THEME = {
  colors: {
    primary: '#2D7D7A',
    primaryDark: '#1A5A57',
    primaryDarker: '#0D3D3A',
    primaryLight: 'rgba(45, 125, 122, 0.1)',
    secondary: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    errorLight: 'rgba(244, 67, 54, 0.1)',
    success: '#4CAF50',
    accent: '#FF9800',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceElevated: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    textLight: '#999999',
    overlay: 'rgba(0, 0, 0, 0.4)',
    blur: 'rgba(45, 125, 122, 0.05)',
    border: '#E0E0E0',
    borderLight: '#F0F0F0',
  },
  gradients: {
    primary: ['#1A5A57', '#0D3D3A', '#2D7D7A'],
    status: ['#151515', '#4A4A4A', '#151515'],
    bottomOverlay: [
      'transparent',
      'rgba(255,255,255,0.3)',
      'rgba(255,255,255,0.7)',
      'rgba(255,255,255,0.9)',
      '#ffffff',
    ],
  },
  spacing: {xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32},
  borderRadius: {sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 9999},
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
  },
} as const;

export const moduleData = [
  {
    id: '1',
    title: 'Know Thyself',
    thumbnail:
      'https://images.ctfassets.net/juauvlea4rbf/593eAQtb8kg4MkgIqE4wsy/268de97d4da2d772287405a56cd71806/Irregular_cycles_text_fb_2x.png',
    videos: [
      {
        id: '1.1',
        title: 'Menstrual Cycle Overview',
        thumbnailUrl: require('../assets/images/articles-cover/2.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/2.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.8,
        reviewCount: 1200,
        publishDate: '2025-01-15',
        duration: '12:30',
        description:
          'Welcome to My Teal! Learn about the menstrual cycle and how it affects your body and mind throughout the month.',
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/1.%20Know%20Thyself/1.%20Menstrual%20Cycle%20Overview.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/1.%20Know%20Thyself/1.%20Menstrual%20Cycle%20Overview.srt',
        folder: '1. Know Thyself',
        postActivities: [
          {
            id: '1.1.1',
            type: 'Activity: Calendar',
            question: 'Your Cycle',
            description: 'Here is a prediction of your menstrual cycle',
            responseType: 'review',
            tags: ['calendar', 'predictions'],
            thumbnailUrl: require('../assets/images/articles-cover/4.png'),
          },
        ],
      },
      {
        id: '1.2',
        title: 'Hormones and Mood',
        thumbnailUrl: require('../assets/images/articles-cover/5.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/5.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.6,
        reviewCount: 950,
        publishDate: '2025-01-16',
        duration: '14:45',
        description:
          'Understanding how hormonal fluctuations impact your mood, emotions, and behavior throughout your cycle.',
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/1.%20Know%20Thyself/2.%20Hormones%20and%20Mood.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/1.%20Know%20Thyself/2.%20Hormones%20and%20Mood.srt',
        folder: '1. Know Thyself',
        postActivities: [
          {
            id: '1.2.1',
            type: 'Activity: mental health symptom review',
            question: 'Review Your Mental Health Symptoms',
            description:
              'Review the mental health symptoms you chose in the onboarding and rate how much they annoy you.',
            responseType: 'rating',
            scaleRange: {
              min: 1,
              max: 5,
              minLabel: 'Not at all',
              maxLabel: 'Extremely',
            },
            tags: [
              'mental_health_review',
              'symptom_rating',
              'onboarding_review',
            ],
            thumbnailUrl: require('../assets/images/articles-cover/6.png'),
          },
        ],
      },
      {
        id: '1.3',
        title: 'Understanding Symptom Patterns',
        thumbnailUrl: require('../assets/images/articles-cover/1.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/1.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.7,
        reviewCount: 880,
        publishDate: '2025-01-17',
        duration: '16:20',
        description:
          'Learn to identify, track, and understand your unique symptom patterns across different cycle phases.',
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/1.%20Know%20Thyself/3.%20Understanding%20Symptom%20Patterns.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/1.%20Know%20Thyself/3.%20Understanding%20Symptom%20Patterns.srt',
        folder: '1. Know Thyself',
        checkingYourself: {
          question:
            'Do you feel ready to move on to creating a safety plan, or would you like to review the cycle information again?',
          yesText: 'Continue to Safety Plan',
          noText: 'Review Cycle Info',
        },
        postActivities: [
          {
            id: '1.3.1',
            type: 'Activity: review card',
            question: 'Your Symptom Patterns and High-Risk Days',
            description:
              'Based on your information available in this app, your symptom patterns and high-risk days are shown below.',
            responseType: 'review',
            tags: ['insight_card', 'high_risk_days', 'predictions'],
            thumbnailUrl: require('../assets/images/articles-cover/6.png'),
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Creating a Safety Plan',
    thumbnail:
      'https://images.everydayhealth.com/images/sleep-disorders/sleep/circadian-rhythm-and-how-it-affects-your-sleep-1440x810.jpg?sfvrsn=7aecd958_5',
    videos: [
      {
        id: '2.1',
        title: 'Warning Signs',
        thumbnailUrl: require('../assets/images/articles-cover/6.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/6.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.5,
        reviewCount: 750,
        publishDate: '2025-01-20',
        duration: '11:15',
        description:
          'Identify personal warning signs that indicate you may be entering a crisis state.',
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/2.%20Creating%20a%20Safety%20Plan/1.%20Warning%20Signs.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/2.%20Creating%20a%20Safety%20Plan/1.%20Warning%20Signs.srt',
        folder: '2. Creating a Safety Plan',
        postActivities: [
          {
            id: '2.1.1',
            type: 'Activity: text',
            question: 'What are your personal warning signs?',
            description:
              'Identify the thoughts, feelings, and behaviors that indicate you may be entering a crisis state.',
            responseType: 'text',
            examples: [
              "Thoughts: Everything is hopeless, I can't handle this anymore",
              'Feelings: Overwhelming sadness, intense anger, numbness',
              'Behaviors: Isolating from others, not eating, sleeping too much or too little',
            ],
            tags: ['warning_signs', 'crisis_identification'],
            thumbnailUrl: require('../assets/images/articles-cover/4.png'),
          },
        ],
      },
      {
        id: '2.2',
        title: 'Distraction Strategies',
        thumbnailUrl: require('../assets/images/articles-cover/3.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/3.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.4,
        reviewCount: 690,
        publishDate: '2025-01-21',
        duration: '13:30',
        description:
          'Learn healthy and effective distraction techniques to help you through difficult moments.',
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/2.%20Creating%20a%20Safety%20Plan/2.%20Distraction%20Strategies.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/2.%20Creating%20a%20Safety%20Plan/2.%20Distraction%20Strategies.srt',
        folder: '2. Creating a Safety Plan',
        postActivities: [
          {
            id: '2.2.1',
            type: 'Activity: checklist',
            question: 'Which grounding techniques would you find helpful?',
            description:
              'Try to select a range of approaches that you could use in different settings. Select at least five:',
            responseType: 'multiple',
            minSelections: 5,
            options: [
              {
                id: 'stimulating_senses_1',
                text: 'Suck and really savor a sour or mint-flavored candy',
                category: 'Stimulating the Five Senses',
              },
              {
                id: 'stimulating_senses_2',
                text: 'Stroke something soft',
                category: 'Stimulating the Five Senses',
              },
              {
                id: 'body_temp_1',
                text: 'Hold an ice cube in your hand',
                category: "Changing my Body's Temperature",
              },
              {
                id: 'exercise_1',
                text: 'Do jumping jacks or burpees',
                category: 'Intense Exercise',
              },
              {
                id: 'distraction_1',
                text: 'Watch a funny video',
                category: 'Distracting Myself',
              },
              {
                id: 'mindfulness_1',
                text: 'Paced breathing: breathe in through your nose for 5 seconds, out through your mouth for 6',
                category: 'Mindfulness Activities',
              },
            ],
            hasAddMore: true,
            tags: [
              'grounding_techniques',
              'distraction_strategies',
              'safety_plan',
            ],
            thumbnailUrl: require('../assets/images/articles-cover/5.png'),
          },
          {
            id: '2.2.2',
            type: 'Activity: question',
            question: 'What are my reasons for living?',
            description:
              'Some people also find it helpful to remind themselves of their reasons for living',
            responseType: 'text',
            tags: ['reasons_for_living', 'safety_plan'],
            thumbnailUrl: require('../assets/images/articles-cover/2.png'),
          },
        ],
      },
      {
        id: '2.3',
        title: 'People Who Can Help',
        thumbnailUrl: require('../assets/images/articles-cover/1.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/1.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.6,
        reviewCount: 720,
        publishDate: '2025-01-22',
        duration: '10:45',
        description:
          'Identify trusted people in your support network who can help during difficult times.',
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/2.%20Creating%20a%20Safety%20Plan/2.3.%20People%20Who%20Can%20Help.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/2.%20Creating%20a%20Safety%20Plan/2.3.%20People%20Who%20Can%20Help.srt',
        folder: '2. Creating a Safety Plan',
        postActivities: [
          {
            id: '2.3.1',
            type: 'Activity: text',
            question: 'Who are the people in your support network?',
            description:
              'List trusted friends, family members, or professionals who you can reach out to during difficult times.',
            responseType: 'text',
            tags: ['support_network', 'crisis_contacts'],
            thumbnailUrl: require('../assets/images/articles-cover/3.png'),
          },
        ],
      },
      {
        id: '2.4',
        title: 'Make My Space Safe',
        thumbnailUrl: require('../assets/images/articles-cover/7.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/7.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.3,
        reviewCount: 580,
        publishDate: '2025-01-23',
        duration: '9:20',
        description:
          'Learn how to create a safe physical environment by removing or securing potentially harmful items.',
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/2.%20Creating%20a%20Safety%20Plan/2.4.%20Make%20My%20Space%20Safe.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/2.%20Creating%20a%20Safety%20Plan/2.4.%20Make%20My%20Space%20Safe.srt',
        folder: '2. Creating a Safety Plan',
        postActivities: [
          {
            id: '2.4.1',
            type: 'Activity: checklist',
            question: 'What steps can you take to make your space safer?',
            description:
              'Select actions you can take to reduce access to potentially harmful items during crisis moments.',
            responseType: 'multiple',
            options: [
              {
                id: 'remove_medications',
                text: 'Store medications in a locked box or give to trusted person',
                category: 'Medication Safety',
              },
              {
                id: 'remove_sharp_objects',
                text: 'Remove or secure sharp objects',
                category: 'Physical Safety',
              },
              {
                id: 'remove_alcohol',
                text: 'Remove alcohol from easily accessible areas',
                category: 'Substance Safety',
              },
            ],
            hasAddMore: true,
            tags: ['environment_safety', 'harm_reduction'],
            thumbnailUrl: require('../assets/images/articles-cover/4.png'),
          },
        ],
      },
      {
        id: '2.5',
        title: 'Example',
        thumbnailUrl: require('../assets/images/articles-cover/2.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/2.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.7,
        reviewCount: 810,
        publishDate: '2025-01-24',
        duration: '15:30',
        description:
          "See a complete safety plan example that brings together all the elements you've learned.",
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/2.%20Creating%20a%20Safety%20Plan/2.5.%20Example.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/2.%20Creating%20a%20Safety%20Plan/2.5.%20Example.srt',
        folder: '2. Creating a Safety Plan',
        checkingYourself: {
          question:
            'Do you feel ready to move on to coping with anger and irritability, or would you like to review your safety plan?',
          yesText: 'Continue to Anger Management',
          noText: 'Review Safety Plan',
        },
        postActivities: [
          {
            id: '2.5.1',
            type: 'Activity: review card',
            question: 'Your Complete Safety Plan',
            description:
              'Review all components of your personalized safety plan and make any final adjustments.',
            responseType: 'review',
            tags: ['safety_plan_summary', 'review_card'],
            thumbnailUrl: require('../assets/images/articles-cover/5.png'),
          },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Coping with Anger and Irritability',
    thumbnail:
      'https://health.calm.com/wp-content/uploads/2024/02/GettyImages-1353607852-1-scaled-343x193-c-center.jpg',
    videos: [
      {
        id: '3.1',
        title: 'Hormones, Anger and Irritability',
        thumbnailUrl: require('../assets/images/articles-cover/7.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/7.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.5,
        reviewCount: 650,
        publishDate: '2025-01-27',
        duration: '17:25',
        description:
          'Understand the biological connection between hormones and feelings of anger and irritability.',
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/3.%20Coping%20with%20Anger%20and%20Irritability/1.%20Hormones,%20Anger%20and%20Irritability.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/3.%20Coping%20with%20Anger%20and%20Irritability/1.%20Hormones,%20Anger%20and%20Irritability.srt',
        folder: '3. Coping with Anger and Irritability',
        postActivities: [
          {
            id: '3.1.1',
            type: 'Activity: text',
            question:
              'Take a moment to reflect on the impact that PMD-related anger and irritability have had on your life',
            responseType: 'Activity: self reflection',
            tags: ['reflection', 'anger_impact'],
            thumbnailUrl: require('../assets/images/articles-cover/4.png'),
          },
        ],
      },
      {
        id: '3.2',
        title: 'Identify High Risk Days and Times',
        thumbnailUrl: require('../assets/images/articles-cover/2.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/2.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.4,
        reviewCount: 590,
        publishDate: '2025-01-28',
        duration: '13:15',
        description:
          'Learn to identify specific days and times when you are most vulnerable to anger and irritability.',
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/3.%20Coping%20with%20Anger%20and%20Irritability/3.2.%20Identify%20High%20Risk%20Days%20and%20Times.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/3.%20Coping%20with%20Anger%20and%20Irritability/3.2.%20Identify%20High%20Risk%20Days%20and%20Times.srt',
        folder: '3. Coping with Anger and Irritability',
        postActivities: [
          {
            id: '3.2.1',
            type: 'Activity: review card',
            question: 'Your High-Risk Times for Anger and Irritability',
            description:
              'Review your cycle data to identify patterns in anger and irritability symptoms.',
            responseType: 'review',
            tags: ['high_risk_analysis', 'anger_patterns'],
            thumbnailUrl: require('../assets/images/articles-cover/3.png'),
          },
          {
            id: '3.2.2',
            type: 'Activity: text input',
            question: 'When are you likely to be more irritable?',
            description:
              'Reflect on specific times of day, situations, or circumstances when you tend to feel more irritable.',
            responseType: 'text_input',
            examples: [
              'Morning when rushing to get ready',
              "After work when I'm tired",
              "When I'm hungry between meals",
              'During stressful conversations',
              "Late at night when I'm overtired",
            ],
            tags: ['time_patterns', 'irritability_triggers'],
            thumbnailUrl: require('../assets/images/articles-cover/3.png'),
          },
        ],
      },
      {
        id: '3.3',
        title: 'Signs of Irritation',
        thumbnailUrl: require('../assets/images/articles-cover/6.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/6.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.6,
        reviewCount: 670,
        publishDate: '2025-01-29',
        duration: '11:45',
        description:
          'Recognize the early warning signs that you are becoming irritated or angry.',
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/3.%20Coping%20with%20Anger%20and%20Irritability/3.3.%20Signs%20of%20Irritation.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/3.%20Coping%20with%20Anger%20and%20Irritability/3.3.%20Signs%20of%20Irritation.srt',
        folder: '3. Coping with Anger and Irritability',
        postActivities: [
          {
            id: '3.3.1',
            type: 'Activity: text',
            question: 'What are your personal signs of irritation?',
            description:
              'Identify your physical, emotional, and behavioral signs that indicate rising irritation.',
            responseType: 'text',
            examples: [
              'Physical: Tense shoulders, clenched jaw, rapid heartbeat',
              'Emotional: Feeling overwhelmed, impatient, frustrated',
              'Behavioral: Speaking more quickly, avoiding eye contact, fidgeting',
            ],
            tags: ['irritation_signs', 'self_awareness'],
            thumbnailUrl: require('../assets/images/articles-cover/1.png'),
          },
        ],
      },
      {
        id: '3.4',
        title: 'Point of Intervention',
        thumbnailUrl: require('../assets/images/articles-cover/5.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/5.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.5,
        reviewCount: 620,
        publishDate: '2025-01-30',
        duration: '14:20',
        description:
          'Learn to identify the optimal moment to intervene before anger escalates.',
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/3.%20Coping%20with%20Anger%20and%20Irritability/3.4.%20Point%20of%20Intervention.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/3.%20Coping%20with%20Anger%20and%20Irritability/3.4.%20Point%20of%20Intervention.srt',
        folder: '3. Coping with Anger and Irritability',
        postActivities: [
          {
            id: '3.4.1',
            type: 'Activity: text',
            question: 'When is your optimal point of intervention?',
            description:
              'Describe the moment when you can most effectively interrupt the anger escalation process.',
            responseType: 'text',
            tags: ['intervention_timing', 'anger_management'],
            thumbnailUrl: require('../assets/images/articles-cover/7.png'),
          },
        ],
      },
      {
        id: '3.5',
        title: 'Share Solutions with Loved Ones',
        thumbnailUrl: require('../assets/images/articles-cover/3.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/3.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.7,
        reviewCount: 740,
        publishDate: '2025-01-31',
        duration: '12:50',
        description:
          'Learn how to communicate your anger management strategies with family and friends.',
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/3.%20Coping%20with%20Anger%20and%20Irritability/3.5.%20Share%20Solutions%20with%20Loved%20Ones.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/3.%20Coping%20with%20Anger%20and%20Irritability/3.5.%20Share%20Solutions%20with%20Loved%20Ones.srt',
        folder: '3. Coping with Anger and Irritability',
        postActivities: [
          {
            id: '3.5.1',
            type: 'Activity: text',
            question: 'How will you share your strategies with loved ones?',
            description:
              'Plan how to communicate your anger management strategies and needs to your support network.',
            responseType: 'text',
            tags: ['communication_plan', 'support_network'],
            thumbnailUrl: require('../assets/images/articles-cover/4.png'),
          },
        ],
      },
      {
        id: '3.6',
        title: 'Overall Module Example',
        thumbnailUrl: require('../assets/images/articles-cover/1.png'),
        endThumbnailUrl: require('../assets/images/articles-cover/1.png'),
        author: 'Dr. Jennifer Gordon',
        authorImageUri: 'https://randomuser.me/api/portraits/women/35.jpg',
        reviewStars: 4.8,
        reviewCount: 850,
        publishDate: '2025-02-01',
        duration: '18:30',
        description:
          'See a comprehensive example that brings together all anger and irritability management strategies.',
        videoUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/3.%20Coping%20with%20Anger%20and%20Irritability/3.6.%20Overall%20Module%20Example.mp4',
        srtUrl:
          'https://myteal.s3.ca-central-1.amazonaws.com/3.%20Coping%20with%20Anger%20and%20Irritability/3.6.%20Overall%20Module%20Example.srt',
        folder: '3. Coping with Anger and Irritability',
        checkingYourself: {
          question:
            'Do you feel ready to move to the next module, or would you like to review anger management strategies?',
          yesText: 'Continue to Next Module',
          noText: 'Review Anger Strategies',
        },
        postActivities: [
          {
            id: '3.6.1',
            type: 'Activity: review card',
            question: 'Your Anger and Irritability Management Plan',
            description:
              'Review your complete strategy for managing anger and irritability throughout your cycle.',
            responseType: 'review',
            tags: ['anger_management_summary', 'review_card'],
            thumbnailUrl: require('../assets/images/articles-cover/6.png'),
          },
        ],
      },
    ],
  },
];

// Export with new names (replacing media with module)
export {moduleData as MODULE_DATA};
export const MODULE_MODULE_DATA = transformToChapters();
