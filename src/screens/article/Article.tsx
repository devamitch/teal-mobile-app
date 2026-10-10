import React, {useState, useRef, useEffect} from 'react';
import BackButton from '@/components/ui/buttons/back-button';
import {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {decode} from 'html-entities';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as rssParser from 'react-native-rss-parser';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useAppStore from '@/core/stores';
import {User} from 'lucide-react-native';

const asset = {
  image: require('../../assets/images/article.png'),
};

const formatReviewCount = count => {
  if (!count) return '0 reviews';
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k reviews';
  }
  return count + ' reviews';
};

const Article = (props: any) => {
  const article: rssParser.FeedItem = props.route.params.item;
  const cover = props.route.params.cover;
  const Colors = lightTheme;

  const {isArticleSaved, saveArticle, removeArticle} = useAppStore(
    state => state.learn,
  );

  const [fontSize, setFontSize] = useState(16);
  const [showFontSlider, setShowFontSlider] = useState(false);

  const fontSizeButtonRef = useRef(null);

  const sliderOpacity = useRef(new Animated.Value(0)).current;
  const sliderScale = useRef(new Animated.Value(0.9)).current;

  const [sliderPosition, setSliderPosition] = useState({top: 0, right: 0});
  const [isSaved, setArticleSaved] = useState(isArticleSaved(article));

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
      if (fontSizeButtonRef.current) {
        fontSizeButtonRef.current.measure(
          (x, y, width, height, pageX, pageY) => {
            setSliderPosition({
              top: pageY - 60,
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

  const handleBookMarkPress = () => {
    if (isSaved) {
      removeArticle(article, () => {
        setArticleSaved(false);
      });
    } else {
      saveArticle(article, () => {
        setArticleSaved(true);
      });
    }
  };

  const handlePressOutside = () => {
    if (showFontSlider) {
      toggleFontSlider();
    }
  };

  const content = decode(article.content.replace(/<[^>]+>/g, ''))
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const reviewStars = 4.5;
  const reviewCount = 1200;

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <ScrollView
        scrollEnabled={!showFontSlider}
        onScrollBeginDrag={() => {
          if (showFontSlider) toggleFontSlider();
        }}>
        <View style={{flex: 1, backgroundColor: Colors.background}}>
          <Image source={cover} style={{width: '100%'}} />
          <BackButton style={{position: 'absolute', top: 60, left: 20}} />
          <View
            style={{
              width: '100%',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              backgroundColor: Colors.background,
              padding: 20,
              bottom: 20,
            }}>
            <TouchableOpacity
              ref={fontSizeButtonRef}
              onPress={e => {
                e.stopPropagation();
                toggleFontSlider();
              }}
              style={{
                backgroundColor: Colors.primary,
                height: 48,
                width: 48,
                borderRadius: 24,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20,
                marginLeft: 'auto',
                bottom: 44,
                zIndex: 10,
              }}>
              <MaterialIcons
                name="text-fields"
                color={Colors.primaryContrast}
                size={24}
              />
            </TouchableOpacity>

            {showFontSlider && (
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
                  zIndex: 999,
                  opacity: sliderOpacity,
                  transform: [{scale: sliderScale}],
                }}>
                <TouchableWithoutFeedback>
                  <View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        onPress={() => setFontSize(Math.max(12, fontSize - 1))}
                        style={styles.fontSizeButton}>
                        <Feather
                          name="minus"
                          size={16}
                          color={Colors.textDark}
                        />
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
                        style={styles.fontSizeButton}>
                        <Feather
                          name="plus"
                          size={16}
                          color={Colors.textDark}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Animated.View>
            )}

            <View style={{bottom: 44}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color: Colors.highlight,
                    fontSize: 12,
                    backgroundColor: Colors.highlightBackground,
                    paddingVertical: 5,
                    borderRadius: 40,
                    paddingHorizontal: 10,
                  }}>
                  {article.categories[0]?.name}
                </Text>
              </View>

              <Text style={styles.title}>{article.title}</Text>

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

              <Text style={[styles.contentText, {fontSize: fontSize}]}>
                {`      `}
                {content.split('\n').join('\n      ')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
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
    zIndex: 1,
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
  fontSizeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
  },
  contentText: {
    color: '#000',
    textAlign: 'left',
    lineHeight: 30,
  },
});

export default Article;
