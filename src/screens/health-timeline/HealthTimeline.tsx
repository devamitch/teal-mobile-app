import {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';

// Import types and utilities
import {RootStackParamList} from '@/navigations/MainNavigation';
import useAppStore from '@/core/stores';
import {
  fetchSymptomAndMoodLogsByDate,
  SymptomTrackerRecord,
  fetchThoughtRecordsByDate,
  ThoughtRecordProps,
} from '@/services/sqlite/feminine-health';
import {FONT_FAMILIES} from '@/constants/fonts';
import {lightTheme} from '@/constants/colors';
import BackButton from '@/components/ui/buttons/back-button';

type BlockColorType = '#EF5B70' | '#7C77B9' | '#F4B740' | '#049299';

// Timeline entry type
type TimelineEntry = {
  date: string;
  cycleInfo?: {
    date: string;
    color: string;
    start_date?: number;
    end_date?: number;
    is_last_date?: number;
    day: number;
    cycle_day: number;
  };
  logs: SymptomTrackerRecord[];
  thoughtRecords: ThoughtRecordProps[];
  isToday: boolean;
};

type HealthTimelineScreenProp = NativeStackScreenProps<
  RootStackParamList,
  'HealthTimeline'
>;

const colorAndTag: Record<
  string,
  {
    mainColor: BlockColorType;
    tag?: string;
  }
> = {
  '#EF5B70': {
    mainColor: '#EF5B70',
    tag: 'Menstrual',
  },
  '#FCE8EB': {
    mainColor: '#EF5B70',
    tag: 'Menstrual',
  },
  '#7C77B9': {
    mainColor: '#7C77B9',
    tag: 'Follicular',
  },
  '#C5C1F5': {
    mainColor: '#7C77B9',
    tag: 'Follicular',
  },
  '#F4B740': {
    mainColor: '#F4B740',
    tag: 'Ovulation',
  },
  '#FFF4D8': {
    mainColor: '#F4B740',
    tag: 'Ovulation',
  },
  '#049299': {
    mainColor: '#049299',
    tag: 'Luteal',
  },
  '#DDF7F4': {
    mainColor: '#049299',
    tag: 'Luteal',
  },
};

// Helper function to validate and normalize cycle color
const validateCycleColor = (
  color: string | undefined,
  cycleDay?: number,
): BlockColorType => {
  // If color exists and is valid, return the main color for that phase
  if (color && colorAndTag[color]) {
    return colorAndTag[color].mainColor;
  }

  // Fallback based on cycle day if available
  if (cycleDay) {
    if (cycleDay >= 1 && cycleDay <= 7) return '#EF5B70'; // Menstrual
    if (cycleDay >= 8 && cycleDay <= 13) return '#7C77B9'; // Follicular
    if (cycleDay >= 14 && cycleDay <= 16) return '#F4B740'; // Ovulation
    if (cycleDay >= 17 && cycleDay <= 28) return '#049299'; // Luteal
  }

  // Default to Follicular phase
  return '#7C77B9';
};

const HealthTimelineScreen = ({navigation}: HealthTimelineScreenProp) => {
  const [symptomLogsByDate, setSymptomLogsByDate] = useState<
    Record<string, SymptomTrackerRecord[]>
  >({});
  const [thoughtRecordsByDate, setThoughtRecordsByDate] = useState<
    Record<string, ThoughtRecordProps[]>
  >({});
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);

  const flatListRef = useRef<FlatList>(null);
  const today = moment().format('YYYY-MM-DD');
  const insets = useSafeAreaInsets();

  // Get cycle data and quiz answers from Zustand store
  const {markedDates, lastUpdated} = useAppStore(state => state.cycle);
  const {quiz} = useAppStore(state => state.engagement);

  // Function to create comprehensive timeline entries
  const createTimelineEntries = (
    cycleRecords: Record<string, any>,
    logsByDate: Record<string, SymptomTrackerRecord[]>,
    thoughtsByDate: Record<string, ThoughtRecordProps[]>,
  ): TimelineEntry[] => {
    const entries: TimelineEntry[] = [];
    const today = moment().format('YYYY-MM-DD');

    // Get all unique dates from all data sources
    const allDates = new Set([
      ...Object.keys(cycleRecords),
      ...Object.keys(logsByDate),
      ...Object.keys(thoughtsByDate),
    ]);

    // Convert to sorted array (oldest first)
    const sortedDates = Array.from(allDates).sort((a, b) => a.localeCompare(b));

    // Create timeline entries for the last 60 days or all available data
    const cutoffDate = moment().subtract(60, 'days').format('YYYY-MM-DD');

    sortedDates.forEach(date => {
      // Only include dates from the last 60 days or dates with logs/thoughts
      if (
        date >= cutoffDate ||
        (logsByDate[date] && logsByDate[date].length > 0) ||
        (thoughtsByDate[date] && thoughtsByDate[date].length > 0)
      ) {
        const cycleInfo = cycleRecords[date]
          ? {
              date,
              color: cycleRecords[date].color,
              start_date: cycleRecords[date].startingDay ? 1 : 0,
              end_date: cycleRecords[date].endingDay ? 1 : 0,
              is_last_date: cycleRecords[date].lastDay ? 1 : 0,
              day: cycleRecords[date].day,
              cycle_day: cycleRecords[date].cycleDay,
            }
          : undefined;

        entries.push({
          date,
          cycleInfo: cycleInfo as {
            date: string;
            color: string;
            start_date?: number;
            end_date?: number;
            is_last_date?: number;
            day: number;
            cycle_day: number;
          },
          logs: logsByDate[date] || [],
          thoughtRecords: thoughtsByDate[date] || [],
          isToday: date === today,
        });
      }
    });

    return entries;
  };

  const scrollToToday = () => {
    try {
      const _index = timelineEntries.findIndex(item => item.date === today);
      if (_index !== -1) {
        flatListRef.current?.scrollToIndex({index: _index});
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Helper function to calculate symptom period based on quiz answers
  const getSymptomPeriod = () => {
    const quizAnswers = Object.values(quiz).reduce((acc, q) => {
      if (q.id === 11) acc.symptomStart = q.answer; // Question 5
      if (q.id === 12) acc.relief = q.answer; // Question 6
      return acc;
    }, {} as {symptomStart?: string; relief?: string});

    const {symptomStart, relief} = quizAnswers;

    // Default fallback
    let startDay = 19;
    let endDay = 21;

    // Convert symptom start answer to cycle day
    if (symptomStart === 'two weeks before my period') {
      startDay = 14;
    } else if (symptomStart === 'one week before my period') {
      startDay = 21;
    } else if (symptomStart === 'a few days before period') {
      startDay = 26;
    } else if (symptomStart === 'right around my period') {
      startDay = 28;
    }

    // Convert relief answer to cycle day
    if (relief === 'a few days before my period') {
      endDay = 26;
    } else if (relief === 'when my period starts') {
      endDay = 28; // period starts on day 28, symptoms continue through day 1-3
    } else if (relief === 'several days after my period starts') {
      endDay = 31; // to cover days 1-3 of next cycle
    }

    return {startDay, endDay};
  };

  // Navigate to day detail screen
  const navigateToDayDetail = (dateId: string) => {
    navigation.navigate('DayDetail', {dateId});
  };

  // Render function for timeline items
  const renderTimelineItem = ({item}: {item: TimelineEntry}) => {
    const hasLogs = item.logs.length > 0;
    const hasThoughtRecords = item.thoughtRecords.length > 0;
    const hasCycleInfo = !!item.cycleInfo;

    // Group logs by type
    const moodLogs = item.logs.filter(log => log.symptom_type === 'Mood');
    const physicalLogs = item.logs.filter(
      log => log.symptom_type === 'Physical Symptom',
    );
    const psychologicalLogs = item.logs.filter(
      log => log.symptom_type === 'Psychological Symptom',
    );

    // Always show if there are logs, thoughts, or cycle info
    if (!hasLogs && !hasThoughtRecords && !hasCycleInfo && !item.isToday) {
      return null;
    }

    const cycleColor = validateCycleColor(
      item.cycleInfo?.color,
      item.cycleInfo?.cycle_day,
    );
    const cycleTag = colorAndTag[cycleColor]?.tag || 'Follicular';

    // Determine if high risk based on personalized symptom period
    const cycleDay = item.cycleInfo?.cycle_day || 1;
    const {startDay, endDay} = getSymptomPeriod();

    // Calculate if current cycle day is within symptom period range
    const normalizedDay = cycleDay % 28 || 28; // Handle day 28 properly
    let isInSymptomRange = false;

    // Handle normal case: symptom period within same cycle
    if (startDay < endDay) {
      isInSymptomRange = normalizedDay >= startDay && normalizedDay <= endDay;
    } else {
      // Handle wrap-around case: symptom period crosses cycle boundary (e.g., 26-28 to 1-3)
      isInSymptomRange =
        normalizedDay >= startDay || normalizedDay <= endDay % 28;
    }

    const isHighRisk = isInSymptomRange && cycleColor === '#049299'; // Only luteal phase

    return (
      <View key={item.date} style={styles.timelineItemWrapper}>
        <View style={styles.timelineDateIndicator}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineLine} />
        </View>

        <View style={styles.timelineItemContent}>
          <TouchableOpacity
            style={[
              styles.timelineCard,
              item.isToday && styles.todayCard,
              isHighRisk && styles.highRiskCard,
            ]}
            onPress={() => navigateToDayDetail(item.date)}
            activeOpacity={0.7}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.dateTitle}>
                  {moment(item.date).format('MMM DD, YYYY')}
                  {item.isToday && (
                    <Text style={styles.todayLabel}> (Today)</Text>
                  )}
                  {moment(item.date).isAfter() && (
                    <Text style={styles.futureLabel}> (Future)</Text>
                  )}
                  {isHighRisk && (
                    <Text style={styles.highRiskLabel}> (High Risk)</Text>
                  )}
                </Text>
                <Text style={styles.dayOfWeek}>
                  {moment(item.date).format('dddd')}
                </Text>
              </View>

              <View style={styles.cardHeaderRight}>
                {(hasLogs || hasThoughtRecords) && (
                  <View style={styles.logsBadge}>
                    <Text style={styles.logsBadgeText}>
                      {item.logs.length + item.thoughtRecords.length}
                    </Text>
                  </View>
                )}
                <Feather name="chevron-right" size={20} color="#666" />
              </View>
            </View>

            {(hasCycleInfo || hasLogs || hasThoughtRecords) && (
              <View style={styles.cycleInfoRow}>
                <View
                  style={[
                    styles.cycleColorDot,
                    {
                      backgroundColor:
                        colorAndTag[cycleColor]?.mainColor || cycleColor,
                    },
                  ]}
                />
                <Text style={styles.cyclePhaseText}>
                  {`${cycleTag} - Day ${item.cycleInfo?.cycle_day || 1}`}
                </Text>
              </View>
            )}

            {(hasLogs || hasThoughtRecords) && (
              <View style={styles.quickSummary}>
                {moodLogs.length > 0 && (
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryEmoji}>🙂</Text>
                    <Text style={styles.summaryText}>
                      {moodLogs.length} mood{' '}
                      {moodLogs.length === 1 ? 'entry' : 'entries'}
                    </Text>
                  </View>
                )}
                {(physicalLogs.length > 0 || psychologicalLogs.length > 0) && (
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryEmoji}>⚡️</Text>
                    <Text style={styles.summaryText}>
                      {physicalLogs.length + psychologicalLogs.length} symptom
                      {physicalLogs.length + psychologicalLogs.length === 1
                        ? ''
                        : 's'}
                    </Text>
                  </View>
                )}
                {hasThoughtRecords && (
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryEmoji}>💭</Text>
                    <Text style={styles.summaryText}>
                      {item.thoughtRecords.length} thought
                      {item.thoughtRecords.length === 1 ? '' : 's'}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {!hasLogs && !hasThoughtRecords && !hasCycleInfo && (
              <Text style={styles.noDataText}>
                No data available for this day
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Update your data fetching logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting to fetch data...');

        // Fetch data for the past 60 days
        const from = new Date();
        from.setDate(from.getDate() - 60);
        from.setHours(0, 0, 0, 0);
        const to = new Date();
        to.setHours(23, 59, 59, 999);

        console.log(
          'Fetching data from:',
          from.toISOString(),
          'to:',
          to.toISOString(),
        );

        const [logs, thoughts] = await Promise.all([
          fetchSymptomAndMoodLogsByDate(from, to),
          fetchThoughtRecordsByDate(from, to),
        ]);

        console.log('Successfully fetched logs:', logs);
        console.log('Successfully fetched thoughts:', thoughts);

        setSymptomLogsByDate(logs);
        setThoughtRecordsByDate(thoughts);

        // Update timeline entries when all data is available
        const entries = createTimelineEntries(markedDates, logs, thoughts);
        console.log('Created timeline entries:', entries.length);
        setTimelineEntries(entries);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error('Error fetching timeline data:', errorMessage);

        // Set empty data to prevent crashes
        setSymptomLogsByDate({});
        setThoughtRecordsByDate({});
        setTimelineEntries([]);
      }
    };

    // Only fetch if we have marked dates or on initial load
    if (
      Object.keys(markedDates).length > 0 ||
      Object.keys(symptomLogsByDate).length === 0 ||
      Object.keys(thoughtRecordsByDate).length === 0
    ) {
      fetchData();
    }
  }, [markedDates, lastUpdated]);

  useEffect(() => {
    // Auto-scroll to today when component mounts
    const timer = setTimeout(() => {
      scrollToToday();
    }, 500);

    return () => clearTimeout(timer);
  }, [timelineEntries]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 20}]}>
        <View style={styles.headerContent}>
          <BackButton
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Health Timeline</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={scrollToToday}
              style={styles.todayButton}>
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={timelineEntries}
        renderItem={renderTimelineItem}
        keyExtractor={item => item.date}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
        scrollEnabled={true}
        bounces={true}
        nestedScrollEnabled={true}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        getItemLayout={(_, index) => ({
          length: 120, // Approximate item height
          offset: 120 * index,
          index,
        })}
        removeClippedSubviews={false}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header styles
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: '#333',
    fontWeight: '600',
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 14,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  todayButton: {
    borderColor: lightTheme.textMild,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
  },
  todayButtonText: {
    color: lightTheme.textMild,
    fontSize: 14,
    fontWeight: '500',
  },

  // Timeline content styles
  timelineContent: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  flatListContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  itemSeparator: {
    height: 8,
  },

  // Timeline item styles
  timelineItemWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    minHeight: 80,
  },
  timelineDateIndicator: {
    alignItems: 'center',
    marginRight: 12,
    width: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: lightTheme.primary,
    marginTop: 8,
    shadowColor: lightTheme.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E5E5E5',
    marginTop: 4,
  },
  timelineItemContent: {
    flex: 1,
  },

  // Timeline Card Styles
  timelineCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  todayCard: {
    backgroundColor: '#FFF8F0',
    borderWidth: 2,
    borderColor: lightTheme.primary,
    shadowColor: lightTheme.primary,
    shadowOpacity: 0.15,
  },
  highRiskCard: {
    borderColor: '#E0A8A8',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Date and cycle info styles
  dateTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 2,
  },
  todayLabel: {
    fontSize: 14,
    color: lightTheme.primary,
    fontWeight: '500',
  },
  futureLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  highRiskLabel: {
    fontSize: 14,
    color: '#E0A8A8', // or peach color
    fontWeight: '500',
  },
  dayOfWeek: {
    fontSize: 12,
    color: '#888',
  },
  logsBadge: {
    backgroundColor: lightTheme.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  logsBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cycleInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cycleColorDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  cyclePhaseText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },

  // Quick summary styles
  quickSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  summaryEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  summaryText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  noDataText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default HealthTimelineScreen;
