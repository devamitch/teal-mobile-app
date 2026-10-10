import {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {
  ColorValue,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import BackButton from '@/components/ui/buttons/back-button';
import useAppStore from '@/core/stores';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigations/MainNavigation';
import LogActionButton from '@/components/common/log-action-button';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {IMAGES} from '@/constants';

type CalendarScreenProp = NativeStackScreenProps<
  RootStackParamList,
  'Calendar'
>;

const CalendarScreen = ({navigation}: CalendarScreenProp) => {
  // Get cycle data from Zustand store
  const {markedDates, fetchCycleData} = useAppStore(state => state.cycle);

  // Fetch cycle data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCycleData();
    }, [fetchCycleData]),
  );

  const onDayPress = ({dateString: date}: DateData) => {
    navigation.navigate('DayDetail', {dateId: date});
  };

  const ColorAndTag = ({color, text}: {color: ColorValue; text: string}) => {
    return (
      <View style={styles.colorTagContainer}>
        <View
          style={[
            styles.colorDot,
            {backgroundColor: color, shadowColor: color as string},
          ]}
        />
        <Text style={styles.colorTagText}>{text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <BackButton style={styles.backButton} />
          <Text style={styles.headerTitle}>My Cycle Log</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.calendarSection}>
            <View style={styles.calendarContainer}>
              <Calendar
                renderArrow={direction => (
                  <View style={styles.calendarArrow}>
                    <AntDesign
                      name={`arrow${direction}`}
                      size={18}
                      color="#333"
                    />
                  </View>
                )}
                markedDates={markedDates}
                markingType="period"
                onDayPress={onDayPress}
                theme={calendarTheme}
              />
            </View>

            <View style={styles.legendContainer}>
              <ColorAndTag color={'#FCE8EB'} text="Period" />
              <ColorAndTag color={'#E6E0FF'} text="Follicular" />
              <ColorAndTag color={'#FFF4D8'} text="Ovulation" />
              <ColorAndTag color={'#DDF7F4'} text="Luteal" />
            </View>
          </View>

          <View style={styles.timelineNavSection}>
            <TouchableOpacity
              style={styles.timelineNavCard}
              onPress={() => navigation.navigate('HealthTimeline')}
              activeOpacity={0.7}>
              <View style={styles.timelineNavContent}>
                <View style={styles.timelineNavLeft}>
                  <View style={styles.timelineNavIcon}>
                    <Image
                      source={IMAGES.timeline}
                      style={{width: 36, height: 36}}
                    />
                  </View>
                  <View style={styles.timelineNavTextContainer}>
                    <Text style={styles.timelineNavTitle}>Health Timeline</Text>
                    <Text style={styles.timelineNavSubtitle}>
                      View your detailed symptom and mood tracking history
                    </Text>
                  </View>
                </View>
                <View style={styles.timelineNavRight}>
                  <Feather name="chevron-right" size={24} color="#666" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{height: 120}} />
          <LogActionButton />
        </View>
      </ScrollView>
    </View>
  );
};

// Calendar theme configuration
const calendarTheme = {
  backgroundColor: 'transparent',
  calendarBackground: 'transparent',
  textSectionTitleColor: '#666',
  selectedDayBackgroundColor: lightTheme.primary,
  selectedDayTextColor: '#FFFFFF',
  todayTextColor: lightTheme.primary,
  dayTextColor: '#333',
  textDisabledColor: '#CCC',
  arrowColor: '#333',
  monthTextColor: '#333',
  indicatorColor: lightTheme.primary,
  textDayFontSize: 14,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 12,
};

// Complete StyleSheet with all styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  flexOne: {
    flex: 1,
  },

  // Header styles
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: '#333',
    fontWeight: '600',
    marginRight: 40,
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

  // Calendar section styles
  calendarSection: {
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  calendarContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarArrow: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Legend styles
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    marginBottom: 0,
    flexWrap: 'wrap',
  },
  colorTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginRight: 8,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  colorTagText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },

  // Timeline section styles
  timelineSection: {
    paddingHorizontal: 20,
    minHeight: 200,
  },
  timelineHeaderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timelineHeaderContent: {
    flexDirection: 'column',
  },
  timelineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineTitle: {
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: '#333',
    fontSize: 20,
    fontWeight: '600',
    paddingRight: 20,
  },
  timelineSubtitle: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  todayButton: {
    borderColor: lightTheme.textMild,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    marginLeft: 'auto',
  },
  expandButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginLeft: 'auto',
  },
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
  },
  flatListContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  itemSeparator: {
    height: 8,
  },

  // Timeline item styles (simplified card design)
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

  // New Timeline Card Styles (replaces dropdown)
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

  // Expanded Day View Styles
  expandedDaySection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  expandedDayContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  expandedDayHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expandedDayHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  collapseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginRight: 16,
  },
  expandedDayTitleContainer: {
    flex: 1,
  },
  expandedDayTitle: {
    fontSize: 24,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: '#333',
    fontWeight: '600',
  },
  expandedDaySubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  expandedCycleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  expandedCycleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  expandedDayContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Statistics Overview
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: lightTheme.primary,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },

  // Expanded Log Sections
  expandedLogSection: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  expandedLogSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  expandedLogSectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  expandedLogSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  expandedLogItemsContainer: {
    paddingLeft: 0,
  },
  expandedLogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  expandedLogTimeContainer: {
    minWidth: 60,
    marginRight: 16,
  },
  expandedLogTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  expandedLogContentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedMoodEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  expandedLogText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  expandedNoLogsContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginTop: 20,
  },
  expandedNoLogsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  expandedNoLogsMessage: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  expandedNoLogsSubMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },

  // Health Timeline Navigation Card styles
  timelineNavSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  timelineNavCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  timelineNavContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineNavLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timelineNavIcon: {
    width: 50,
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  timelineNavEmoji: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  timelineNavTextContainer: {
    flex: 1,
  },
  timelineNavTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  timelineNavSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  timelineNavRight: {
    marginLeft: 16,
  },
});

export default CalendarScreen;
