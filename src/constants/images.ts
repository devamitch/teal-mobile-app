import {ImageRequireSource} from 'react-native';

/**
 * Comprehensive type-safe image registry for the application
 * Each image is explicitly typed and organized by category
 */

// Authentication & Social Login Images
export const authImages = {
  apple_black:
    require('../assets/images/apple_black.png') as ImageRequireSource,
  apple: require('../assets/images/apple.png') as ImageRequireSource,
  google: require('../assets/images/google.png') as ImageRequireSource,
} as const;

// Navigation & UI Control Images
export const navigationImages = {
  backArrow: require('../assets/images/back.png') as ImageRequireSource,
  nextArrow: require('../assets/images/next.png') as ImageRequireSource,
  downArrow: require('../assets/images/down.png') as ImageRequireSource,
  upArrow: require('../assets/images/up.png') as ImageRequireSource,
} as const;

// Tab Bar & Main Navigation Images
export const tabImages = {
  home: require('../assets/images/bottomTabNavIcons/home.svg') as ImageRequireSource,
  user: require('../assets/images/bottomTabNavIcons/user.svg') as ImageRequireSource,
  learn:
    require('../assets/images/bottomTabNavIcons/book.svg') as ImageRequireSource,
} as const;

export const emojiFilledType = {
  emoji_e1: require('../assets/images/emoji/e1.svg') as ImageRequireSource,
  emoji_e2: require('../assets/images/emoji/e2.png') as ImageRequireSource,
  emoji_e3: require('../assets/images/emoji/e3.svg') as ImageRequireSource,
  emoji_e4: require('../assets/images/emoji/e4.svg') as ImageRequireSource,
  emoji_e5: require('../assets/images/emoji/e5.svg') as ImageRequireSource,
  emoji_e6: require('../assets/images/emoji/e6.svg') as ImageRequireSource,
} as const;

// Mental Health & Mood State Images
export const moodImages = {
  depression: require('../assets/images/depression.png') as ImageRequireSource,
  irritable: require('../assets/images/Irritable.png') as ImageRequireSource,
  moodSwings: require('../assets/images/mood-swings.png') as ImageRequireSource,
  selfHarm: require('../assets/images/self-harm.png') as ImageRequireSource,
  sos: require('../assets/images/sos.png') as ImageRequireSource,
  suicidal: require('../assets/images/suicidal.png') as ImageRequireSource,
  sadness: require('../assets/images/sadness.png') as ImageRequireSource,
  contact: require('../assets/images/user.png') as ImageRequireSource,
  cramps: require('../assets/images/cramps.png') as ImageRequireSource,
  insomnia: require('../assets/images/insomnia.png') as ImageRequireSource,
  fatigue: require('../assets/images/fatigue.png') as ImageRequireSource,
} as const;

// Social Features & Communication Images
export const socialImages = {
  peerSupport: require('../assets/images/support.png') as ImageRequireSource,
  share: require('../assets/images/share.png') as ImageRequireSource,
  send: require('../assets/images/send.png') as ImageRequireSource,
} as const;

// Core UI & Branding Images
export const uiImages = {
  square: require('../assets/images/square.png') as ImageRequireSource,
  logo: require('../assets/images/logo.png') as ImageRequireSource,
  learn: require('../assets/images/learn.png') as ImageRequireSource,
  eModeLogo: require('../assets/images/eModeLogo.png') as ImageRequireSource,
  plus: require('../assets/images/plus.png') as ImageRequireSource,
  starred: require('../assets/images/starred.png') as ImageRequireSource,
  flow: require('../assets/images/flow.png') as ImageRequireSource,
  mood: require('../assets/images/mood.png') as ImageRequireSource,
  symptom: require('../assets/images/symptom.png') as ImageRequireSource,
  emo_scale_1:
    require('../assets/images/emoji_scale/emoji_scale_1.png') as ImageRequireSource,
  emo_scale_2:
    require('../assets/images/emoji_scale/emoji_scale_2.png') as ImageRequireSource,
  emo_scale_3:
    require('../assets/images/emoji_scale/emoji_scale_3.png') as ImageRequireSource,
  emo_scale_4:
    require('../assets/images/emoji_scale/emoji_scale_4.png') as ImageRequireSource,
  emo_scale_5:
    require('../assets/images/emoji_scale/emoji_scale_5.png') as ImageRequireSource,
  emo_scale_6:
    require('../assets/images/emoji_scale/emoji_scale_6.png') as ImageRequireSource,
  medication:
    require('../assets/images/quiz_icons/medication.png') as ImageRequireSource,
  menopause:
    require('../assets/images/quiz_icons/menopause.png') as ImageRequireSource,
  personal_info:
    require('../assets/images/quiz_icons/personal-info.png') as ImageRequireSource,
  personalization:
    require('../assets/images/quiz_icons/personalization.png') as ImageRequireSource,
  self_harm:
    require('../assets/images/quiz_icons/self_harm.png') as ImageRequireSource,
  quiz_symptom:
    require('../assets/images/quiz_icons/symptom.png') as ImageRequireSource,
} as const;

// Profile & Personal Information Images
export const profileImages = {
  birthday: require('../assets/images/cake.png') as ImageRequireSource,
  email: require('../assets/images/email.png') as ImageRequireSource,
  height: require('../assets/images/height.png') as ImageRequireSource,
  map: require('../assets/images/map.png') as ImageRequireSource,
  phone: require('../assets/images/phone.png') as ImageRequireSource,
  camera: require('../assets/images/camera.png') as ImageRequireSource,
  weight: require('../assets/images/weight.png') as ImageRequireSource,
} as const;

// Learning Resources & Educational Content Images
export const learningImages = {
  learnings1: require('../assets/images/images.jpeg') as ImageRequireSource,
  learnings2: require('../assets/images/images2.jpeg') as ImageRequireSource,
  learnings3: require('../assets/images/images3.jpeg') as ImageRequireSource,
  learnings4: require('../assets/images/images4.jpeg') as ImageRequireSource,
} as const;

// Article Cover Images
export const articleCoverImages = {
  articleCover1:
    require('../assets/images/articles-cover/1.png') as ImageRequireSource,
  articleCover2:
    require('../assets/images/articles-cover/2.png') as ImageRequireSource,
  articleCover3:
    require('../assets/images/articles-cover/3.png') as ImageRequireSource,
  articleCover4:
    require('../assets/images/articles-cover/4.png') as ImageRequireSource,
  articleCover5:
    require('../assets/images/articles-cover/5.png') as ImageRequireSource,
  articleCover6:
    require('../assets/images/articles-cover/6.png') as ImageRequireSource,
  articleCover7:
    require('../assets/images/articles-cover/7.png') as ImageRequireSource,
  womenTinking:
    require('../assets/images/women-thinking.png') as ImageRequireSource,
} as const;

// Feature & Tool Images
export const featureImages = {
  safetyplan: require('../assets/images/safety.png') as ImageRequireSource,
  strategies: require('../assets/images/strategies.png') as ImageRequireSource,
} as const;

// Onboarding & Tutorial Images
export const onboardingImages = {
  onabording1:
    require('@/assets/images/onboarding/onboarding-one.png') as ImageRequireSource,
  onabording2:
    require('../assets/images/onboarding/onboarding-two.png') as ImageRequireSource,
  onabording3:
    require('../assets/images/onboarding/onboarding-three.png') as ImageRequireSource,
} as const;

//Miscellaneous Images
export const miscImages = {
  crown: require('../assets/images/crown.png') as ImageRequireSource,
  timeline: require('../assets/images/timeline.png') as ImageRequireSource,
};

export const partnerLogos = {
  AuraCore:
    require('../assets/images/logos/AuraCore.png') as ImageRequireSource,
  iapmd:
    require('../assets/images/logos/IAPMD-white.png') as ImageRequireSource,
  rmh: require('../assets/images/logos/RMH.png') as ImageRequireSource,
  shrf: require('../assets/images/logos/SHRF.png') as ImageRequireSource,
  ur: require('../assets/images/logos/UR.png') as ImageRequireSource,
};

/**
 * Master Images object containing all categorized images
 * Provides a single source of truth for all application images
 */
const IMAGES = {
  ...authImages,
  ...navigationImages,
  ...tabImages,
  ...moodImages,
  ...socialImages,
  ...uiImages,
  ...profileImages,
  ...learningImages,
  ...articleCoverImages,
  ...featureImages,
  ...onboardingImages,
  ...miscImages,
  ...partnerLogos,
  ...emojiFilledType,
} as const satisfies Record<string, ImageRequireSource>;

// Type definitions
type ImageKeys = keyof typeof IMAGES;
type ImageCategories = {
  auth: keyof typeof authImages;
  navigation: keyof typeof navigationImages;
  tab: keyof typeof tabImages;
  mood: keyof typeof moodImages;
  social: keyof typeof socialImages;
  ui: keyof typeof uiImages;
  profile: keyof typeof profileImages;
  learning: keyof typeof learningImages;
  articleCover: keyof typeof articleCoverImages;
  feature: keyof typeof featureImages;
  onboarding: keyof typeof onboardingImages;
  misc: keyof typeof miscImages;
  partners: keyof typeof partnerLogos;
  emojiFilled: keyof typeof emojiFilledType;
};

/**
 * Type-safe image accessor function with performance optimization
 * @param key - The image key to retrieve
 * @returns The image source for the given key
 */
const getImage = <K extends ImageKeys>(key: K): (typeof IMAGES)[K] => {
  if (process?.env?.NODE_ENV === 'development' && !(key in IMAGES)) {
    console.warn(`Image key "${String(key)}" not found in Images registry`);
  }
  return IMAGES[key];
};

/**
 * Type guard to check if an image key exists
 * @param key - The key to check
 * @returns True if the key exists in the Images object
 */
const hasImage = (key: string): key is ImageKeys => {
  return key in IMAGES;
};

/**
 * Get images by category
 * @param category - The category to retrieve images from
 * @returns Object containing all images in the specified category
 */
const getImagesByCategory = <T extends keyof ImageCategories>(
  category: T,
): Record<ImageCategories[T], ImageRequireSource> => {
  const categoryMaps = {
    auth: authImages,
    navigation: navigationImages,
    tab: tabImages,
    mood: moodImages,
    social: socialImages,
    ui: uiImages,
    profile: profileImages,
    learning: learningImages,
    articleCover: articleCoverImages,
    feature: featureImages,
    onboarding: onboardingImages,
    partnerLogos: partnerLogos,
    emojiFilledType: emojiFilledType,
  } as const;

  return categoryMaps[category] as Record<
    ImageCategories[T],
    ImageRequireSource
  >;
};

/**
 * Get an array of all available image keys
 * @returns Array of all image keys
 */
const getAllImageKeys = (): ImageKeys[] => {
  return Object.keys(IMAGES) as ImageKeys[];
};

/**
 * Get an array of image keys for a specific category
 * @param category - The category to get keys for
 * @returns Array of image keys for the specified category
 */
const getCategoryKeys = <T extends keyof ImageCategories>(
  category: T,
): ImageCategories[T][] => {
  const categoryImages = getImagesByCategory(category);
  return Object.keys(categoryImages) as ImageCategories[T][];
};

/**
 * Get an image safely with a fallback if the key doesn't exist
 * @param key - The image key to retrieve
 * @param fallbackKey - Fallback key to use if the first key doesn't exist
 * @returns The image source for the given key or fallback
 */
const getSafeImage = <T extends ImageKeys>(
  key: T,
  fallbackKey: ImageKeys = 'logo',
): ImageRequireSource => {
  return hasImage(key) ? IMAGES[key] : IMAGES[fallbackKey];
};

/**
 * Batch image loader for preloading multiple images
 * @param keys - Array of image keys to preload
 * @returns Promise that resolves when all images are loaded
 */
const preloadImages = async (keys: ImageKeys[]): Promise<void> => {
  try {
    const imagePromises = keys.map(key => {
      return new Promise<void>((resolve, reject) => {
        const image = IMAGES[key];
        if (typeof image === 'number') {
          // For require() images, they're already loaded
          resolve();
        } else {
          reject(new Error(`Invalid image format for key: ${key}`));
        }
      });
    });

    await Promise.all(imagePromises);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error preloading images:', error);
    }
  }
};

/**
 * Get random image from a specific category
 * @param category - The category to get a random image from
 * @returns Random image from the specified category
 */
const getRandomImageFromCategory = <T extends keyof ImageCategories>(
  category: T,
): ImageRequireSource => {
  const categoryKeys = getCategoryKeys(category);
  const randomKey =
    categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
  const categoryImages = getImagesByCategory(category);
  return categoryImages[randomKey];
};

/**
 * Image registry with metadata for debugging and development
 */
const ImageRegistry = {
  images: IMAGES,
  categories: {
    auth: authImages,
    navigation: navigationImages,
    tab: tabImages,
    mood: moodImages,
    social: socialImages,
    ui: uiImages,
    profile: profileImages,
    learning: learningImages,
    articleCover: articleCoverImages,
    feature: featureImages,
    onboarding: onboardingImages,
    misc: miscImages,
    partners: partnerLogos,
    emojiFilled: emojiFilledType,
  },
  stats: {
    totalImages: Object.keys(IMAGES).length,
    categoryCounts: {
      auth: Object.keys(authImages).length,
      navigation: Object.keys(navigationImages).length,
      tab: Object.keys(tabImages).length,
      mood: Object.keys(moodImages).length,
      social: Object.keys(socialImages).length,
      ui: Object.keys(uiImages).length,
      profile: Object.keys(profileImages).length,
      learning: Object.keys(learningImages).length,
      articleCover: Object.keys(articleCoverImages).length,
      feature: Object.keys(featureImages).length,
      onboarding: Object.keys(onboardingImages).length,
      misc: Object.keys(miscImages).length,
      partnerLogos: Object.keys(partnerLogos).length,
      emojiFilled: Object.keys(emojiFilledType).length,
    },
  },
} as const;

// Export everything
export {
  getAllImageKeys,
  getCategoryKeys,
  getImage,
  getImagesByCategory,
  getRandomImageFromCategory,
  getSafeImage,
  hasImage,
  ImageRegistry,
  IMAGES,
  preloadImages,
};

export type {ImageCategories, ImageKeys};

// Development helper - log image registry stats in dev mode
if (process?.env?.NODE_ENV === 'development') {
  console.log('📸 Image Registry Loaded:', ImageRegistry.stats);
}
