import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageRequireSource,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getImageSource} from '@/utils/image-utils';

interface MediaCardProps {
  type: 'video' | 'activity';
  title: string;
  subtitle?: string;
  thumbnailUrl?: string | ImageRequireSource;
  onPress?: () => void;
  duration?: string;
  activityType?: string;
  children?: React.ReactNode;
}

const getRandomAbstract = () =>
  `https://source.unsplash.com/400x220/?abstract,nature,water,pattern,random&sig=${Math.floor(
    Math.random() * 1000,
  )}`;

const MediaCard: React.FC<MediaCardProps> = ({
  type,
  title,
  subtitle,
  thumbnailUrl,
  onPress,
  duration,
  activityType,
  children,
}) => {
  const thumbnail = thumbnailUrl || getRandomAbstract();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.imgWrap}>
        <Image
          source={
            thumbnailUrl
              ? getImageSource(thumbnailUrl)
              : {uri: getRandomAbstract()}
          }
          style={styles.thumbnail}
          resizeMode="cover"
        />
        {type === 'video' && (
          <View style={styles.playIconContainer}>
            <Icon name="play-circle" size={40} color="rgba(255,255,255,0.8)" />
          </View>
        )}
        {duration && type === 'video' && (
          <View style={styles.durationOverlay}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.typeLabel}>
          {type === 'video' ? 'Video' : activityType || 'Activity'}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
        {children && <View style={styles.children}>{children}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imgWrap: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playIconContainer: {
    position: 'absolute',
  },
  durationOverlay: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D7D7A',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  children: {
    marginTop: 10,
  },
});

export default MediaCard;
