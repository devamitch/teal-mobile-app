import {ImageRequireSource, ImageSourcePropType} from 'react-native';

/**
 * Utility function to get the correct image source format for React Native Image component
 * Handles both local images (require()) and remote URLs
 */
export const getImageSource = (
  imageSource: string | ImageRequireSource | number,
): ImageSourcePropType => {
  // Add runtime validation to catch unexpected types
  if (imageSource === null || imageSource === undefined) {
    console.warn('getImageSource received null/undefined, using empty URI');
    return {uri: ''};
  }

  // If it's a string (URL), use it as URI
  if (typeof imageSource === 'string') {
    return {uri: imageSource};
  }

  // If it's a require() result (number or object), use it directly
  if (typeof imageSource === 'number' || typeof imageSource === 'object') {
    return imageSource;
  }

  // Log unexpected types to help with debugging
  console.warn(
    'getImageSource received unexpected type:',
    typeof imageSource,
    imageSource,
  );

  // Fallback
  return {uri: ''};
};

/**
 * Safely creates an Image source URI object, ensuring the URI is always a string
 */
export const safeImageUri = (uri: any): {uri: string} => {
  if (typeof uri === 'string') {
    return {uri};
  }

  if (uri === null || uri === undefined) {
    return {uri: ''};
  }

  // Convert any other type to string (like numbers)
  const stringUri = String(uri);
  console.warn(
    'safeImageUri converted non-string to string:',
    typeof uri,
    '->',
    stringUri,
  );
  return {uri: stringUri};
};

/**
 * Type guard to check if an image source is a local require() result
 */
export const isLocalImage = (
  imageSource: string | ImageRequireSource | number,
): imageSource is ImageRequireSource | number => {
  return (
    typeof imageSource === 'number' ||
    (typeof imageSource === 'object' &&
      imageSource !== null &&
      !('uri' in imageSource))
  );
};

/**
 * Type guard to check if an image source is a remote URL
 */
export const isRemoteImage = (
  imageSource: string | ImageRequireSource | number,
): imageSource is string => {
  return typeof imageSource === 'string';
};
