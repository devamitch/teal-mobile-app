import MainHeader from '@/components/common/headers/MainHeader';
import Colors from '@/constants/colors';
import {IMAGES} from '@/constants/images';
import {useMedia} from '@/hooks/use-media';
import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Styles from './LearnStyle';

// Hardcoded activity templates mapped by module and video sequence
const moduleActivityTemplates = {
  '1': {
    // Know Thyself
    0: [
      // First video activities
      {
        id: 'activity_1_1',
        type: 'Activity: Calendar',
        question: 'Your Cycle',
        description: 'Here is a prediction of your menstrual cycle',
        responseType: 'review',
        tags: ['calendar', 'predictions'],
        thumbnailUrl: null, // Will be set dynamically
      },
    ],
    1: [
      // Second video activities
      {
        id: 'activity_1_2',
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
        tags: ['mental_health_review', 'symptom_rating', 'onboarding_review'],
        thumbnailUrl: null,
      },
    ],
    2: [
      // Third video activities
      {
        id: 'activity_1_3',
        type: 'Activity: review card',
        question: 'Your Symptom Patterns and High-Risk Days',
        description:
          'Based on your information available in this app, your symptom patterns and high-risk days are shown below.',
        responseType: 'review',
        tags: ['insight_card', 'high_risk_days', 'predictions'],
        thumbnailUrl: null,
      },
    ],
  },
  '2': {
    // Creating a Safety Plan
    0: [
      // Warning Signs and Triggers
      {
        id: 'activity_2_1_1',
        type: 'Activity: text list',
        question: 'What are your warning signs and triggers?',
        description:
          'Write down the names of the triggers and warning signs that indicate you might be entering a crisis.',
        responseType: 'text_list',
        tags: ['warning_signs', 'triggers', 'safety_plan'],
        thumbnailUrl: null,
      },
    ],
    1: [
      // Grounding Techniques
      {
        id: 'activity_2_2_1',
        type: 'Activity: multiple choice',
        question: 'How can I temporarily take my mind off my problems?',
        description:
          'Which of the following grounding techniques would you find helpful? Try to select a range of approaches that you could use in different settings (e.g., out in public, at home, at the office). Select at least five:',
        responseType: 'multiple_choice',
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
            id: 'stimulating_senses_3',
            text: 'Make a cup of very aromatic tea',
            category: 'Stimulating the Five Senses',
          },
          {
            id: 'stimulating_senses_4',
            text: 'Listen to music',
            category: 'Stimulating the Five Senses',
          },
          {
            id: 'body_temp_1',
            text: 'Hold an ice cube in your hand',
            category: "Changing my Body's Temperature",
          },
          {
            id: 'body_temp_2',
            text: 'Dunk your face in a sink of cold water',
            category: "Changing my Body's Temperature",
          },
          {
            id: 'body_temp_3',
            text: 'Take a hot shower or bath',
            category: "Changing my Body's Temperature",
          },
          {
            id: 'exercise_1',
            text: 'Do jumping jacks or burpees',
            category: 'Intense Exercise',
          },
          {
            id: 'exercise_2',
            text: 'Run up and down the stairs',
            category: 'Intense Exercise',
          },
          {
            id: 'exercise_3',
            text: 'Lift weights',
            category: 'Intense Exercise',
          },
          {
            id: 'exercise_4',
            text: 'Run around the block',
            category: 'Intense Exercise',
          },
          {
            id: 'distraction_1',
            text: 'Watch a funny video',
            category: 'Distracting Myself',
          },
          {
            id: 'distraction_2',
            text: 'Look at a picture and remember what it was like to be there',
            category: 'Distracting Myself',
          },
          {
            id: 'distraction_3',
            text: 'Name 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, and 1 thing you taste',
            category: 'Distracting Myself',
          },
          {
            id: 'distraction_4',
            text: 'Recite the alphabet',
            category: 'Distracting Myself',
          },
          {
            id: 'distraction_5',
            text: 'Color in a coloring book',
            category: 'Distracting Myself',
          },
          {
            id: 'distraction_6',
            text: 'Play a game on my phone',
            category: 'Distracting Myself',
          },
          {
            id: 'distraction_7',
            text: 'Listen to my favorite song',
            category: 'Distracting Myself',
          },
          {
            id: 'mindfulness_1',
            text: 'Paced breathing: breathe in through your nose for 5 seconds, out through your mouth for 6',
            category: 'Mindfulness Activities',
          },
          {
            id: 'mindfulness_2',
            text: 'Progressive muscle relaxation: tense each muscle in my body one at a time for 3 seconds, then release',
            category: 'Mindfulness Activities',
          },
        ],
        hasAddMore: true,
        tags: ['grounding_techniques', 'distraction_strategies', 'safety_plan'],
        thumbnailUrl: null,
      },
      {
        id: 'activity_2_2_2',
        type: 'Activity: text input',
        question: 'What are my reasons for living?',
        description:
          'Some people also find it helpful to remind themselves of their reasons for living. Write down what gives your life meaning and purpose.',
        responseType: 'text_input',
        tags: ['reasons_for_living', 'safety_plan'],
        thumbnailUrl: null,
      },
    ],
    2: [
      // People Who Can Help
      {
        id: 'activity_2_3_1',
        type: 'Activity: contact review',
        question: 'Who are the people in your support network?',
        description:
          'Review and update your support contacts for crisis situations.',
        responseType: 'contact_review',
        tags: ['support_network', 'crisis_contacts'],
        thumbnailUrl: null,
      },
      {
        id: 'activity_2_3_2',
        type: 'Activity: support resources',
        question: 'Online Support Resources',
        description:
          'Access online mental health resources and support services in your region.',
        responseType: 'support_resources',
        tags: ['online_resources', 'mental_health_support'],
        thumbnailUrl: null,
      },
    ],
    3: [
      // Make My Space Safe
      {
        id: 'activity_2_4_1',
        type: 'Activity: text input',
        question: 'How to limit access to means of hurting yourself',
        description:
          'Write down how to limit your access to means of hurting yourself or ending your life.',
        responseType: 'text_input',
        tags: ['environment_safety', 'harm_reduction'],
        thumbnailUrl: null,
      },
    ],
    4: [
      // Safety Plan Review
      {
        id: 'activity_2_5_1',
        type: 'Activity: safety plan review',
        question: 'Your Complete Safety Plan',
        description:
          'Review all components of your personalized safety plan and make any final adjustments.',
        responseType: 'safety_plan_review',
        tags: ['safety_plan_summary', 'review_card'],
        thumbnailUrl: null,
      },
    ],
  },
  '3': {
    // Coping with Anger and Irritability
    0: [
      // Hormones, Anger and Irritability [VIDEO]
      {
        id: 'activity_3_1_1',
        type: 'Activity: text input',
        question:
          'Take a moment to reflect on the impact that PMD-related anger and irritability have had on your life',
        description:
          'Reflect on how PMD-related anger and irritability have affected your relationships, work, and daily activities.',
        responseType: 'text_input',
        tags: ['reflection', 'anger_impact'],
        thumbnailUrl: null,
      },
    ],
    1: [
      // Identify High Risk Days and Times [VIDEO]
      {
        id: 'activity_3_2_1',
        type: 'Activity: review card',
        question:
          'Review your high-risk days in the cycle for anger and irritability',
        description:
          'Calendar predictions based on onboarding info for OB3-5, OR if they were tracking symptoms for at least 1 cycle, show high risk days insight card. Prediction of what worked what did not?',
        responseType: 'review',
        tags: ['calendar', 'predictions', 'high_risk_days', 'anger_patterns'],
        thumbnailUrl: null,
      },
      {
        id: 'activity_3_2_2',
        type: 'Activity: text input',
        question: 'When are you likely to be more irritable?',
        description:
          'Think about specific times of day, situations, or circumstances when you tend to feel more irritable.',
        responseType: 'text_input',
        tags: ['timing_patterns', 'irritability_triggers'],
        thumbnailUrl: null,
      },
    ],
    2: [
      // Signs of Irritation [VIDEO]
      {
        id: 'activity_3_3_1',
        type: 'Activity: text list',
        question: 'Know Your Warning Signs.',
        description:
          'Reflect on how you know you`re highly irritable. How do you feel? What thoughts do you have? What little signs can you look out for that let you know you need to take measures to keep your irritation from escalating? List them below.',
        responseType: 'text_list',
        tags: ['warning_signs', 'self_awareness', 'irritation_triggers'],
        thumbnailUrl: null,
      },
    ],
    3: [
      // Point of Intervention [VIDEO]
      {
        id: 'activity_3_4_1',
        type: 'Activity: intervention strategies',
        question:
          'Reflect on what concrete actions you can take to help counter the irritability',
        description:
          'Things like taking a walk or listening to your favourite standup comedian. Consider writing a separate list of things you might use in different settings, like work and home.',
        responseType: 'text_input',
        examples: [
          'Take frequent breaks at work',
          'Go to the gym at lunch',
          'Listen to my favourite music throughout the day',
          'Watch standup comedy in the evening',
          'Call Megan who always cheers me up',
          'Go to the movies',
        ],
        tags: ['intervention_strategies', 'coping_mechanisms'],
        thumbnailUrl: null,
      },
      {
        id: 'activity_3_4_2',
        type: 'Activity: avoidance strategies',
        question:
          'Next, reflect on what you might avoid, whether it be a person, a place, or certain responsibilities',
        description:
          "These lists are meant to serve as a resource you'll consult in the days leading up to your symptomatic phase and when you wake up feeling particularly irritable.",
        responseType: 'text_input',
        examples: [
          'Going to Costco',
          'Taking the kids to school (switch with Tom)',
          'Putting Emmy to bed',
          'Talking with my mother',
          'Reddit',
          'Meetings with my co-worker Martha',
        ],
        tags: ['avoidance_strategies', 'trigger_management'],
        thumbnailUrl: null,
      },
    ],
    4: [
      // Share Solutions with Loved Ones [VIDEO]
      {
        id: 'activity_3_5_1',
        type: 'Activity: sharing strategies',
        question:
          'Consider sharing your lists with your close loved ones and be open to their suggestions',
        description:
          'Think about how you can involve your support network in your anger management plan.',
        responseType: 'text_input',
        hasShareOption: true,
        tags: ['communication_plan', 'support_network'],
        thumbnailUrl: null,
      },
      {
        id: 'activity_3_5_2',
        type: 'Activity: conflict prevention',
        question:
          'How might you take steps to avoid an argument with your loved ones?',
        description:
          "Maybe it involves warning them that you're feeling irritable, avoiding certain activities together, or avoiding each other completely during your most symptomatic days.",
        responseType: 'text_input',
        tags: ['conflict_prevention', 'relationship_management'],
        thumbnailUrl: null,
      },
    ],
    5: [
      // Overall Module Example [VIDEO]
      {
        id: 'activity_3_6_1',
        type: 'Activity: review card',
        question:
          'Here are your strategies that you identified for coping with anger and irritability. ',
        description:
          'Take some time to see whether you would like to make any changes.',
        responseType: 'review',
        tags: ['anger_management_summary', 'review_card', 'ez_mode_access'],
        hasEditOption: true,
        thumbnailUrl: null,
      },
    ],
  },
};

// Article covers array - used for RSS feeds and other sections
const articleCovers = [
  IMAGES.articleCover1,
  IMAGES.articleCover2,
  IMAGES.articleCover3,
  IMAGES.articleCover4,
  IMAGES.articleCover5,
  IMAGES.articleCover6,
  IMAGES.articleCover7,
];

const Learn = ({navigation}: any) => {
  const [articleRSSData, setArticleRSSData] = useState<rssParser.Feed>();
  const [podcastRSSData, setPodcastRSSData] = useState<rssParser.Feed>();

  // Add useMedia hook to check CDN media
  const mediaData = useMedia();

  // Create dynamic modules from CDN data - completely data-driven
  const cdnModules = useMemo(() => {
    if (!mediaData.hasData) return [];

    // Combine all items (grouped and ungrouped)
    const allItems = [
      ...mediaData.groups.flatMap(group => group.items),
      ...mediaData.ungrouped,
    ];

    // Filter for video items only
    const videoItems = allItems.filter(item => item.type === 'video');

    // Dynamic module grouping based on folder structure from CDN
    const moduleGroups: Record<
      string,
      {
        title: string;
        videos: any[];
        thumbnail: any; // Changed to any to accept image sources
      }
    > = {};

    videoItems.forEach(video => {
      const folder = video.folder || '';
      const folderMatch = folder.match(/^(\d+)\.\s*(.+)/);

      if (folderMatch && folderMatch[1] && folderMatch[2]) {
        const moduleId = folderMatch[1];
        const moduleTitle = folderMatch[2];

        if (!moduleGroups[moduleId]) {
          const moduleNum = parseInt(moduleId);
          const thumbnailIndex = Math.max(
            0,
            (moduleNum - 1) % articleCovers.length,
          );
          moduleGroups[moduleId] = {
            title: moduleTitle,
            videos: [],
            thumbnail: articleCovers[thumbnailIndex],
          };
        }

        const moduleGroup = moduleGroups[moduleId];
        if (moduleGroup) {
          const videoIndex = moduleGroup.videos.length;
          const videoThumbnailIndex = Math.max(
            0,
            videoIndex % articleCovers.length,
          );

          // Get activities for this module and video index (hybrid approach)
          const moduleActivities =
            moduleActivityTemplates[
              moduleId as keyof typeof moduleActivityTemplates
            ];
          const videoActivities =
            moduleActivities?.[videoIndex as keyof typeof moduleActivities] ||
            [];

          // Set thumbnails for activities
          const activitiesWithThumbnails = videoActivities.map(
            (activity, actIndex) => ({
              ...activity,
              id: `${video.id}_${activity.id}`, // Make ID unique per video
              thumbnailUrl:
                articleCovers[
                  (videoThumbnailIndex + actIndex + 3) % articleCovers.length
                ],
            }),
          );

          moduleGroup.videos.push({
            id: video.id,
            title: video.title,
            videoUrl: video.url,
            srtUrl: video.url.replace('.mp4', '.mp4.srt'), // Assume SRT has same name
            author: 'Dr. Jennifer Gordon',
            duration: '5-10 mins',
            thumbnailUrl: articleCovers[videoThumbnailIndex],
            description: `Video from CDN: ${video.title}`,
            folder: video.folder,
            // Hybrid approach: videos from CDN, activities from hardcoded templates
            postActivities: activitiesWithThumbnails,
          });
        }
      }
    });

    // Convert to array format
    return Object.entries(moduleGroups)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([moduleId, moduleData]) => ({
        id: moduleId,
        title: moduleData.title,
        videos: moduleData.videos,
        thumbnail: moduleData.thumbnail,
        description: `${moduleData.title} - Content from CDN`,
      }));
  }, [mediaData.hasData, mediaData.groups, mediaData.ungrouped]);

  // Simplified logging for hybrid CDN + hardcoded approach
  useEffect(() => {
    console.log('=== Hybrid Module System Status ===');
    console.log('Videos from CDN - Loading:', mediaData.loading);
    console.log('Videos from CDN - Has data:', mediaData.hasData);
    console.log('Total CDN groups:', mediaData.groups.length);
    console.log('Total CDN ungrouped items:', mediaData.ungrouped.length);

    if (cdnModules.length > 0) {
      console.log('=== Generated Hybrid Modules ===');
      cdnModules.forEach(module => {
        const totalActivities = module.videos.reduce(
          (sum: number, video: any) =>
            sum + (video.postActivities?.length || 0),
          0,
        );
        console.log(
          `Module ${module.id}: "${module.title}" (${module.videos.length} videos, ${totalActivities} activities)`,
        );
      });
    } else if (!mediaData.loading) {
      console.log('No modules generated - check CDN data');
    }
  }, [
    mediaData.loading,
    mediaData.hasData,
    mediaData.groups.length,
    mediaData.ungrouped.length,
    cdnModules.length,
  ]);

  const fetchArticles = useCallback(async () => {
    try {
      const response = await fetch(`https://becomingindomitable.com/feed/`);
      const responseText = await response.text();
      const rss = await rssParser.parse(responseText);
      setArticleRSSData(rss);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }, []);

  const fetchPodcasts = useCallback(async () => {
    try {
      const response = await fetch(
        `https://media.rss.com/theinterviewer/feed.xml`,
      );
      const responseText = await response.text();
      const rss = await rssParser.parse(responseText);
      setPodcastRSSData(rss);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
    fetchPodcasts();
  }, [fetchArticles, fetchPodcasts]);

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
    }) => {
      return (
        <TouchableOpacity
          style={isStressCard ? Styles.stressContentCard : Styles.contentCard}
          onPress={onPress}>
          <View
            style={
              isStressCard ? Styles.stressCardContainer : Styles.cardContainer
            }>
            <Image
              source={typeof image === 'string' ? {uri: image} : image}
              style={isStressCard ? Styles.stressCardImage : Styles.cardImage}
              resizeMode="cover"
            />
            <View
              style={
                isStressCard ? Styles.stressCardContent : Styles.cardContent
              }>
              {tag && (
                <View style={Styles.tagContainer}>
                  <Text style={Styles.tagText}>{tag}</Text>
                </View>
              )}
              <Text
                style={isStressCard ? Styles.stressCardTitle : Styles.cardTitle}
                numberOfLines={isStressCard ? 2 : 1}>
                {title}
              </Text>
              <View style={Styles.authorContainer}>
                {/* {subtitle && (
                  <Text style={Styles.cardSubtitle}>by {subtitle}</Text>
                )} */}
                {duration && (
                  <Text style={Styles.cardDuration}>{duration}</Text>
                )}
              </View>
              {!progress && duration && duration.includes('mins') && (
                <View style={Styles.playButton}>
                  <Ionicons name="play" size={18} color={Colors.white} />
                  <Text style={Styles.playText}>Play</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [],
  );

  const ContentSection = useCallback(
    ({title, children}: {title: string; children: React.ReactNode}) => (
      <View style={Styles.sectionContainer}>
        <Text style={Styles.sectionTitle}>{title}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={Styles.horizontalScroll}>
          {children}
        </ScrollView>
      </View>
    ),
    [],
  );

  return (
    <View style={Styles.container}>
      <StatusBar
        backgroundColor={Colors.mainBgColor}
        barStyle="light-content"
      />
      <MainHeader
        onPressEmode={() => navigation.navigate('Emode')}
        onNextPress={() => navigation.navigate('Chat')}
      />

      <ScrollView
        style={Styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <ContentSection title="Thriving with PMDs Program">
          {mediaData.loading ? (
            <View style={{padding: 20}}>
              <Text>Loading modules from CDN...</Text>
            </View>
          ) : cdnModules.length > 0 ? (
            <>
              <ContentCard
                title="Introduction"
                subtitle="Dr. Jennifer Gordon"
                image={require('@/assets/images/articles-cover/7.png')}
                tag="Introduction"
                onPress={() =>
                  navigation.navigate('VideoPlayer', {
                    videoUrl: require('@/assets/videos/intro.mp4'),
                    title: 'Introduction',
                  })
                }
                isStressCard={false}
              />
              {cdnModules
                .filter(item => ['1', '2', '3'].includes(item.id)) // Only show modules 1, 2, and 3
                .map(item => {
                  return (
                    <ContentCard
                      key={item.id}
                      title={item.title}
                      subtitle="Dr. Jennifer Gordon"
                      image={item.thumbnail}
                      tag="Mental Health"
                      onPress={() =>
                        navigation.navigate('LearnModuleShowcase', {
                          module: item,
                        })
                      }
                      isStressCard={false}
                    />
                  );
                })}
            </>
          ) : (
            <View style={{padding: 20}}>
              <Text>Please Wait...</Text>
            </View>
          )}
        </ContentSection>

        <ContentSection title="Podcasts">
          {podcastRSSData?.items?.slice(0, 5).map((item, index) => {
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
                subtitle={item.authors[0]?.name || 'Dr. Sneha Chenji'}
                image={imageUrl ? imageUrl : articleCovers[index % 7]}
                tag="Mental Health"
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

        <ContentSection title="IAPMD Resources">
          {articleRSSData?.items?.map((item, index) => {
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
                subtitle={item.authors[0]?.name || 'Dr. Sneha Chenji'}
                image={imageUrl ? imageUrl : articleCovers[(index + 5) % 7]}
                tag="Article"
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

        {/* <ContentSection title="Saved">
          {articleRSSData?.items?.slice(0, 3).map((item, index) => {
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
                key={`saved-${index}`}
                title={item.title}
                subtitle={item.authors[0]?.name || 'Dr. Sneha Chenji'}
                image={imageUrl ? imageUrl : articleCovers[index % 7]}
                tag="Mental Health"
                onPress={() =>
                  navigation.navigate('Article', {
                    item,
                    cover: imageUrl
                      ? {uri: imageUrl}
                      : articleCovers[index % 7],
                  })
                }
              />
            );
          })}
        </ContentSection> */}
        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
};

export default Learn;
