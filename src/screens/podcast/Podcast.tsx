import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {decode} from 'html-entities';
import * as rssFeed from 'react-native-rss-parser';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video, {VideoRef} from 'react-native-video';
import Slider from '@react-native-community/slider';
import BackButton from '@/components/ui/buttons/back-button';
import useAppStore from '@/core/stores';
import {User} from 'lucide-react-native';

const formatReviewCount = count => {
  if (!count) return '0 reviews';
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k reviews';
  }
  return count + ' reviews';
};

const Podcast = (props: any) => {
  const podcast: rssFeed.FeedItem = props.route.params.item;
  const cover = props.route.params.image;
  const Colors = lightTheme;

  const {savePodcast, removePodcast, isPodcastSaved} = useAppStore(
    state => state.learn,
  );

  const [isSaved, setPodcastSaved] = useState(isPodcastSaved(podcast));

  const [description, setDescription] = useState('');
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const playerRef = useRef<VideoRef>(null);

  // Font size adjustment functionality
  const [fontSize, setFontSize] = useState(16);
  const [showFontSlider, setShowFontSlider] = useState(false);
  const fontSizeButtonRef =
    useRef<React.ElementRef<typeof TouchableOpacity>>(null);
  const sliderOpacity = useRef(new Animated.Value(0)).current;
  const sliderScale = useRef(new Animated.Value(0.9)).current;
  const [sliderPosition, setSliderPosition] = useState({top: 0, right: 0});
  const [isScrolling, setIsScrolling] = useState(false);

  const reviewStars = 4.7; // Sample review score
  const reviewCount = 850; // Sample review count

  const descriptionText = decode(podcast.description.replace(/<[^>]+>/g, ''))
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const onSeeMore = () => {
    setDescription(descriptionText);
  };

  const togglePlayPause = (url: string) => {
    if (currentUrl === url) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentUrl(url);
      setIsPlaying(true);
      setCurrentTime(0); // Reset on new track
    }
  };

  const seekTo = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seek(seconds);
      setCurrentTime(seconds);
    }
  };

  const toggleFontSlider = () => {
    if (showFontSlider) {
      Animated.parallel([
        Animated.timing(sliderOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(sliderScale, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowFontSlider(false);
      });
    } else {
      // Don't show font slider if currently scrolling
      if (isScrolling) return;

      if (fontSizeButtonRef.current) {
        fontSizeButtonRef.current.measure(
          (
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number,
          ) => {
            setSliderPosition({
              top: 60,
              right: 20,
            });

            setShowFontSlider(true);
            Animated.parallel([
              Animated.timing(sliderOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(sliderScale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start();
          },
        );
      }
    }
  };

  const handlePressOutside = () => {
    if (showFontSlider) {
      toggleFontSlider();
    }
  };

  const handleBookMarkPress = () => {
    if (isSaved) {
      removePodcast(podcast, () => {
        setPodcastSaved(false);
      });
    } else {
      savePodcast(podcast, () => {
        setPodcastSaved(true);
      });
    }
  };

  const playListSection = ({item, index}: {item: any; index: number}) => {
    const seconds = parseInt(podcast.itunes.duration) % 60;
    const minutes = (parseInt(podcast.itunes.duration) - seconds) / 60;

    return (
      <View
        style={{
          borderColor: '#00A5AD',
          borderWidth: 1,
          borderRadius: 14,
          padding: 15,
          flexDirection: 'row',
          marginBottom: 20,
        }}>
        <FontAwesome
          name={
            currentUrl === item.url && isPlaying
              ? 'pause-circle'
              : 'play-circle'
          }
          size={25}
          color={'#00A5AD'}
          onPress={() => togglePlayPause(item.url)}
        />
        <Text
          style={{
            fontSize: 16,
            paddingHorizontal: 15,
          }}>{`Part ${index + 1}`}</Text>
        <Text
          style={{
            fontSize: 12,
            paddingHorizontal: 15,
            verticalAlign: 'middle',
            marginLeft: 'auto',
          }}>{`${minutes}:${seconds} mins`}</Text>
      </View>
    );
  };

  useEffect(() => {
    setDescription(descriptionText.slice(0, 500));
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* Header with Back Button and Font Size Button */}
      <View style={styles.headerContainer}>
        <BackButton
          iconColor="white"
          borderColor="white"
          style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}
        />
        <TouchableOpacity
          ref={fontSizeButtonRef}
          onPress={e => {
            e.stopPropagation();
            toggleFontSlider();
          }}
          style={styles.fontSizeButton}>
          <MaterialIcons
            name="text-fields"
            color={Colors.primaryContrast}
            size={24}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{marginBottom: currentUrl ? 140 : 0}}
        onScrollBeginDrag={() => {
          setIsScrolling(true);
          if (showFontSlider) toggleFontSlider();
        }}
        onScrollEndDrag={() => setIsScrolling(false)}
        onMomentumScrollEnd={() => setIsScrolling(false)}>
        <Image source={cover} style={{width: '100%', aspectRatio: 1}} />
        <View
          style={{
            width: '100%',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            padding: 20,
            bottom: 20,
          }}>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.YoungSerifRegular,
              fontSize: 20,
              paddingVertical: 10,
            }}>
            {podcast.title}
          </Text>

          {/* Enhanced Author Section */}
          <View style={styles.authorSection}>
            <View style={styles.authorInfo}>
              <User style={styles.authorImage} />
              <View style={styles.authorDetails}>
                <Text style={styles.authorName}>Dr. Sneha Chenji</Text>
                <View style={styles.authorMetadata}>
                  <View style={styles.ratingContainer}>
                    <MaterialIcons name="star" size={16} color="#ffc107" />
                    <Text style={styles.ratingText}>
                      {reviewStars.toFixed(1)} |{' '}
                      {formatReviewCount(reviewCount)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.actionIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="share-2" size={22} color={Colors.textDark} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleBookMarkPress}
                style={styles.iconButton}>
                <MaterialIcons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color={Colors.textDark}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.separator} />

          {/* Description Section */}
          <Text
            style={{
              fontSize: fontSize,
              color: Colors.textDark,
              textAlign: 'justify',
            }}>
            {description}
          </Text>
          {description.length !== descriptionText.length && (
            <TouchableOpacity onPress={onSeeMore}>
              <Text
                style={{
                  fontSize: 10,
                  color: '#0d559e',
                  textAlign: 'justify',
                  paddingBottom: 20,
                }}>
                {'...see more.'}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.separator} />

          <Text
            style={{
              fontFamily: FONT_FAMILIES.YoungSerifRegular,
              fontSize: 14,
              paddingBottom: 20,
              marginTop: 20,
            }}>
            {'Podcast'}
          </Text>
          <FlatList data={podcast.enclosures} renderItem={playListSection} />
        </View>
      </ScrollView>

      {/* Font Size Slider Overlay */}
      {showFontSlider && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.sliderOverlay}
          onPress={toggleFontSlider}>
          <Animated.View
            style={{
              position: 'absolute',
              top: sliderPosition.top,
              right: sliderPosition.right,
              backgroundColor: Colors.background,
              borderRadius: 12,
              padding: 12,
              width: 240,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
              opacity: sliderOpacity,
              transform: [{scale: sliderScale}],
            }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={e => e.stopPropagation()}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => setFontSize(Math.max(12, fontSize - 1))}
                  style={styles.fontSizeAdjustButton}>
                  <Feather name="minus" size={16} color={Colors.textDark} />
                </TouchableOpacity>
                <Slider
                  style={{flex: 1, marginHorizontal: 8}}
                  minimumValue={12}
                  maximumValue={24}
                  step={1}
                  value={fontSize}
                  onValueChange={value => setFontSize(value)}
                  minimumTrackTintColor={Colors.primary}
                  maximumTrackTintColor="#D0D0D0"
                  thumbTintColor={Colors.primary}
                />
                <TouchableOpacity
                  onPress={() => setFontSize(Math.min(24, fontSize + 1))}
                  style={styles.fontSizeAdjustButton}>
                  <Feather name="plus" size={16} color={Colors.textDark} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}

      {/* Hidden Audio Player */}
      {currentUrl && (
        <Video
          ref={playerRef}
          source={{uri: currentUrl}}
          paused={!isPlaying}
          // @ts-ignore
          audioOnly
          onEnd={() => setIsPlaying(false)}
          onLoad={({duration}) => setDuration(duration)}
          onProgress={({currentTime}) => setCurrentTime(currentTime)}
          onError={e => {
            console.error('Audio error', e);
            setIsPlaying(false);
          }}
          playInBackground
          playWhenInactive
          ignoreSilentSwitch="ignore"
          rate={playbackRate}
        />
      )}

      {/* Bottom Audio Control Panel */}
      {currentUrl && (
        <View style={styles.audioControlPanel}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.timeText}>
              {Math.floor(currentTime / 60)}:
              {('0' + Math.floor(currentTime % 60)).slice(-2)}
            </Text>
            <Text style={styles.timeText}>
              {Math.floor(duration / 60)}:
              {('0' + Math.floor(duration % 60)).slice(-2)}
            </Text>
          </View>

          <Slider
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onSlidingComplete={value => seekTo(value)}
            minimumTrackTintColor="#00A5AD"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#00A5AD"
          />
          <View style={styles.controlsContainer}>
            <View style={{width: 50}} />
            <View style={styles.playbackControls}>
              <TouchableOpacity
                onPress={() => seekTo(Math.max(currentTime - 15, 0))}>
                <MaterialIcons
                  name="replay-10"
                  size={45}
                  color={lightTheme.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginHorizontal: 30}}
                onPress={() => setIsPlaying(!isPlaying)}>
                <FontAwesome
                  name={isPlaying ? 'pause-circle' : 'play-circle'}
                  size={60}
                  color="#00A5AD"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => seekTo(Math.min(currentTime + 15, duration))}>
                <MaterialIcons
                  name="forward-10"
                  size={45}
                  color={lightTheme.primary}
                />
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                onPress={() => setShowSpeedDropdown(!showSpeedDropdown)}
                style={styles.speedButton}>
                <Text style={styles.speedButtonText}>{`${playbackRate}x`}</Text>
              </TouchableOpacity>
              {showSpeedDropdown && (
                <View style={styles.speedDropdown}>
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map(speed => (
                    <TouchableOpacity
                      key={speed}
                      onPress={() => {
                        setPlaybackRate(speed);
                        setShowSpeedDropdown(false);
                      }}
                      style={styles.speedDropdownItem}>
                      <Text
                        style={
                          styles.speedDropdownItemText
                        }>{`${speed}x`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  fontSizeButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: lightTheme.primary,
    height: 48,
    width: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fontSizeAdjustButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  authorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  authorDetails: {
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  authorMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    padding: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
    width: '100%',
  },
  metaInfo: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  metaLabel: {
    fontWeight: '600',
  },
  audioControlPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
  },
  playbackControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: 20,
  },
  timeText: {
    fontSize: 14,
  },
  sliderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 998,
  },
  speedButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedButtonText: {
    fontSize: 14,
    color: lightTheme.textDark,
    fontWeight: '600',
  },
  speedDropdown: {
    position: 'absolute',
    bottom: 50,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
  },
  speedDropdownItem: {
    padding: 10,
  },
  speedDropdownItemText: {
    fontSize: 16,
  },
});

export default Podcast;
