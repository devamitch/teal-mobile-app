import MainHeader from '@/components/common/headers/MainHeader';
import {FONT_FAMILIES, IMAGES, lightTheme} from '@/constants';
import Colors from '@/constants/colors';
import useAppStore from '@/core/stores';
import {RootStackParamList} from '@/navigations/MainNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useShallow} from 'zustand/react/shallow';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const articleCovers = [
  IMAGES.articleCover1,
  IMAGES.articleCover2,
  IMAGES.articleCover3,
  IMAGES.articleCover4,
  IMAGES.articleCover5,
  IMAGES.articleCover6,
  IMAGES.articleCover7,
];

type StarredScreenProp = NativeStackScreenProps<
  RootStackParamList,
  'SavedContent'
>;

const SavedContentScreen: React.FC = ({navigation}: StarredScreenProp) => {
  const {article, podcast} = useAppStore(useShallow(state => state.learn));

  const ContentCard = useCallback(
    ({
      title,
      subtitle,
      image,
      tag,
      progress,
      duration,
      onPress,
      isStressCard = false,
    }: {
      title: string;
      subtitle?: string;
      image: any;
      tag?: string;
      progress?: number;
      duration?: string;
      onPress: () => void;
      isStressCard?: boolean;
    }) => (
      <TouchableOpacity
        style={isStressCard ? styles.stressContentCard : styles.contentCard}
        onPress={onPress}>
        <View
          style={
            isStressCard ? styles.stressCardContainer : styles.cardContainer
          }>
          <Image
            source={typeof image === 'string' ? {uri: image} : image}
            style={isStressCard ? styles.stressCardImage : styles.cardImage}
            resizeMode="cover"
          />
          <View
            style={
              isStressCard ? styles.stressCardContent : styles.cardContent
            }>
            {tag && (
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            )}
            <Text
              style={isStressCard ? styles.stressCardTitle : styles.cardTitle}
              numberOfLines={isStressCard ? 2 : 1}>
              {title}
            </Text>
            <View style={styles.authorContainer}>
              {subtitle && (
                <Text style={styles.cardSubtitle}>by {subtitle}</Text>
              )}
              {duration && <Text style={styles.cardDuration}>{duration}</Text>}
            </View>
            {progress !== undefined && progress !== null && (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, {width: `${progress}%`}]} />
              </View>
            )}
            {!progress && duration?.includes('mins') && (
              <View style={styles.playButton}>
                <Ionicons name="play" size={18} color={Colors.white} />
                <Text style={styles.playText}>Play</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  const ContentSection = useCallback(
    ({title, children}: {title: string; children?: React.ReactNode}) => (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}>
          {children}
        </ScrollView>
      </View>
    ),
    [],
  );

  const PodcastComponent = () => {
    return (
      <View>
        <ContentSection title="Saved Podcast">
          {podcast.map((item, index) => {
            let imageUrl = item.itunes?.image;
            if (item.description && typeof item.description === 'string') {
              const descMatch = item.description.match(/src="([^"]+)"/);
              if (descMatch && descMatch[1]) {
                imageUrl = descMatch[1];
              }
            }

            return (
              <ContentCard
                key={`podcast-${index}`}
                title={item.title}
                subtitle={item.authors[0]?.name || 'Jenny Wilson'}
                image={imageUrl ? imageUrl : articleCovers[index % 7]}
                tag="Mental Health"
                progress={undefined}
                duration={`${Math.floor(Math.random() * 60)}:${Math.floor(
                  Math.random() * 60,
                )
                  .toString()
                  .padStart(2, '0')} mins`}
                onPress={() =>
                  navigation.navigate('Podcast', {
                    item,
                    image: imageUrl
                      ? {uri: imageUrl}
                      : articleCovers[index % 7],
                  })
                }
              />
            );
          })}
        </ContentSection>
      </View>
    );
  };

  const ArticleComponent = () => {
    return (
      <View>
        <ContentSection title="Saved Articles">
          {article.map((item, index) => {
            let imageUrl = null;
            if (item.enclosures && item.enclosures.length > 0) {
              const imageEnclosure = item.enclosures.find(
                (enc: any) => enc.mimeType && enc.mimeType.startsWith('image/'),
              );
              if (imageEnclosure) {
                imageUrl = imageEnclosure.url;
              }
            }
            if (item.description && typeof item.description === 'string') {
              const descMatch = item.description.match(/src="([^"]+)"/);
              if (descMatch && descMatch[1]) {
                imageUrl = descMatch[1];
              }
            }

            return (
              <ContentCard
                key={`resource-article-${index}`}
                title={item.title}
                subtitle={item.authors[0]?.name || 'Jenny Wilson'}
                image={imageUrl ? imageUrl : articleCovers[(index + 5) % 7]}
                tag="Article"
                progress={undefined}
                duration={undefined}
                onPress={() =>
                  navigation.navigate('Article', {
                    item,
                    cover: imageUrl
                      ? {uri: imageUrl}
                      : articleCovers[(index + 5) % 7],
                  })
                }
              />
            );
          })}
        </ContentSection>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MainHeader />
      {article.length !== 0 && <ArticleComponent />}
      {podcast.length !== 0 && <PodcastComponent />}
      {article.length === 0 && podcast.length === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: screenHeight - (Platform.OS === 'android' ? 280 : 300),
          }}>
          <Image
            source={IMAGES.womenTinking}
            style={{
              height: screenWidth * 0.8,
              width: screenWidth * 0.8,
              marginBottom: 30,
            }}
          />
          <Text
            style={[styles.sectionTitle, {fontSize: 24, marginBottom: 100}]}>
            No Saved Content Found
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 12,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  horizontalScroll: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 10,
    gap: 16,
    alignItems: 'center',
  },
  contentCard: {
    width: screenWidth * 0.75,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    margin: 6,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2, // Increased for better visibility
        // Don't set overflow: 'hidden' here
      },
      android: {
        elevation: 2,
        overflow: 'visible',
        borderWidth: 0.1,
        borderColor: 'rgba(0,0,0,0.05)',
      },
    }),
    borderColor: Colors.lightGrey,
  },
  stressContentCard: {
    width: '95%',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    margin: 8,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        // Don't set overflow: 'hidden' here
      },
      android: {
        elevation: 2,
        overflow: 'visible',
        borderWidth: 0.1,
        borderColor: 'rgba(0,0,0,0.05)',
      },
    }),
    alignSelf: 'center',
  },
  stressCardContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    height: 160,
    overflow: 'hidden',
  },
  stressCardImageContainer: {
    overflow: 'hidden', // Add this new style
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  stressCardImage: {
    width: 160,
    height: '100%',
  },
  stressCardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  stressCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    height: 130,
    overflow: 'hidden',
    // Remove overflow: 'hidden' from here
  },
  cardImageContainer: {
    overflow: 'hidden', // Add this new style
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardImage: {
    width: 120,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F7F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  tagText: {
    color: '#00A69C',
    fontSize: 10,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 5,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  cardDuration: {
    fontSize: 12,
    color: '#666666',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 8,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00A69C',
    borderRadius: 2,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A69C',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  playText: {
    color: Colors.white,
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  interactiveCourseButton: {
    marginHorizontal: 16,
    backgroundColor: '#00A69C',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactiveCourseButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
});

export default SavedContentScreen;
