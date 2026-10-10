import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';

import {RootStackParamList} from '@/navigations/MainNavigation';
import {lightTheme} from '@/constants/colors';
import {FONT_FAMILIES} from '@/constants/fonts';
import useAppStore from '@/core/stores';
import {
  fetchSymptomAndMoodLogsByDate,
  SymptomTrackerRecord,
  ThoughtRecordProps,
  fetchThoughtRecordsByDate,
} from '@/services/sqlite/feminine-health';
import BackButton from '@/components/ui/buttons/back-button';

type BlockColorType = '#EF5B70' | '#7C77B9' | '#F4B740' | '#049299';

type DayDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DayDetail'
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

const DayDetailScreen = ({navigation, route}: DayDetailScreenProps) => {
  const {dateId} = route.params;
  const [logs, setLogs] = useState<SymptomTrackerRecord[]>([]);
  const [thoughtRecords, setThoughtRecords] = useState<ThoughtRecordProps[]>(
    [],
  );
  const [selectedThought, setSelectedThought] =
    useState<ThoughtRecordProps | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const insets = useSafeAreaInsets();
  const today = moment().format('YYYY-MM-DD');

  // Get cycle data from Zustand store
  const {markedDates} = useAppStore(state => state.cycle);

  const isToday = dateId === today;
  const cycleInfo = markedDates[dateId];

  // Check if the date allows editing (only today)
  const canEdit = isToday;

  // Function to get mood emoji
  const getMoodEmoji = (moodId: string) => {
    const moodEmojis: Record<string, string> = {
      '1': '😠', // Cranky
      '2': '😩', // Stressed
      '3': '😞', // Down
      '4': '😐', // Wiped
      '5': '😌', // Serene
      '6': '☺️', // Joyful
    };
    return moodEmojis[moodId] || '😐';
  };

  // Function to get mood name
  const getMoodName = (moodId: string) => {
    const moodNames: Record<string, string> = {
      '1': 'Very Bad',
      '2': 'Bad',
      '3': 'Ok',
      '4': 'Good',
      '5': 'Great',
      '6': 'Excellent',
    };
    return moodNames[moodId] || 'Unknown';
  };

  // Fetch data for the specific date
  useEffect(() => {
    const fetchDateData = async () => {
      try {
        setLoading(true);

        // Create date range for just this day
        const from = moment(dateId).startOf('day').toDate();
        const to = moment(dateId).endOf('day').toDate();

        const logsByDate = await fetchSymptomAndMoodLogsByDate(from, to);
        setLogs(logsByDate[dateId] || []);

        const thoughtsByDate = await fetchThoughtRecordsByDate(from, to);
        const records = thoughtsByDate[dateId] || [];
        setThoughtRecords(records);
        console.log(`Fetched ${records.length} thought records for ${dateId}`);
      } catch (error) {
        console.error('Error fetching date data:', error);
        setLogs([]);
        setThoughtRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDateData();
  }, [dateId]);

  // Group logs by type
  const moodLogs = logs.filter(log => log.symptom_type === 'Mood');
  const physicalLogs = logs.filter(
    log => log.symptom_type === 'Physical Symptom',
  );
  const psychologicalLogs = logs.filter(
    log => log.symptom_type === 'Psychological Symptom',
  );

  // Add: Other logs (not matching above types)
  const otherLogs = logs.filter(
    log =>
      log.symptom_type !== 'Mood' &&
      log.symptom_type !== 'Physical Symptom' &&
      log.symptom_type !== 'Psychological Symptom',
  );

  const openThoughtRecordModal = (record: ThoughtRecordProps) => {
    setSelectedThought(record);
    setModalVisible(true);
  };

  const closeThoughtRecordModal = () => {
    setModalVisible(false);
    setSelectedThought(null);
  };

  const cycleColor = validateCycleColor(cycleInfo?.color, cycleInfo?.cycleDay);
  const cycleTag = colorAndTag[cycleColor]?.tag || 'Follicular';

  const navigateToLogSymptoms = () => {
    navigation.navigate('LogSymptoms', {date: dateId});
  };

  const navigateToToday = () => {
    const today = moment().format('YYYY-MM-DD');
    navigation.replace('DayDetail', {dateId: today});
  };

  const navigateToPreviousDay = () => {
    const previousDay = moment(dateId).subtract(1, 'day').format('YYYY-MM-DD');

    // Navigate to previous day with left-to-right transition
    navigation.replace('DayDetail', {
      dateId: previousDay,
      fromDirection: 'past',
    });
  };

  const navigateToNextDay = () => {
    const nextDay = moment(dateId).add(1, 'day').format('YYYY-MM-DD');

    // Navigate to next day with right-to-left transition
    navigation.replace('DayDetail', {
      dateId: nextDay,
      fromDirection: 'future',
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
          <Text style={styles.title}>My Cycle Logs</Text>
          <TouchableOpacity
            onPress={navigateToToday}
            style={styles.todayButton}
            disabled={isToday}>
            <Text
              style={[styles.todayButtonText, isToday && styles.disabledText]}>
              Today
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateInfo}>
          <TouchableOpacity
            onPress={navigateToPreviousDay}
            style={styles.dateNavButton}>
            <Feather name="chevron-left" size={20} color="#666" />
          </TouchableOpacity>

          <View style={styles.dateTextContainer}>
            <Text style={styles.dateTitle}>
              {moment(dateId).format('MMMM DD, YYYY')}
              {isToday && <Text style={styles.todayLabel}> (Today)</Text>}
            </Text>
            <Text style={styles.subtitle}>{moment(dateId).format('dddd')}</Text>
          </View>

          <TouchableOpacity
            onPress={navigateToNextDay}
            style={styles.dateNavButton}>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.cycleInfo}>
          <View
            style={[
              styles.cycleColorDot,
              {
                backgroundColor:
                  colorAndTag[cycleColor]?.mainColor || cycleColor,
              },
            ]}
          />
          <Text style={styles.cycleText}>
            {`${cycleTag} - Day ${cycleInfo?.cycleDay || 1}`}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={true}
        bounces={true}>
        {/* Detailed Mood Section */}
        {moodLogs.length > 0 && (
          <View style={styles.logSection}>
            <View style={styles.logSectionHeader}>
              <Text style={styles.logSectionIcon}>🙂</Text>
              <Text style={styles.logSectionTitle}>Mood Tracking</Text>
            </View>
            <View style={styles.logItemsContainer}>
              {moodLogs.map(log => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logTimeContainer}>
                    <Text style={styles.logTime}>
                      {moment(log.timestamp).format('HH:mm')}
                    </Text>
                  </View>
                  <View style={styles.logContentContainer}>
                    <Text style={styles.moodEmoji}>
                      {getMoodEmoji(log.symptom)}
                    </Text>
                    <Text style={styles.logText}>
                      {getMoodName(log.symptom)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Detailed Physical Symptoms Section */}
        {physicalLogs.length > 0 && (
          <View style={styles.logSection}>
            <View style={styles.logSectionHeader}>
              <Text style={styles.logSectionIcon}>🏥</Text>
              <Text style={styles.logSectionTitle}>Physical Symptoms</Text>
            </View>
            <View style={styles.logItemsContainer}>
              {physicalLogs.map(log => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logTimeContainer}>
                    <Text style={styles.logTime}>
                      {moment(log.timestamp).format('HH:mm')}
                    </Text>
                  </View>
                  <View style={styles.logContentContainer}>
                    <Text style={styles.logText}>{log.symptom}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Detailed Psychological Symptoms Section */}
        {psychologicalLogs.length > 0 && (
          <View style={styles.logSection}>
            <View style={styles.logSectionHeader}>
              <Text style={styles.logSectionIcon}>🧠</Text>
              <Text style={styles.logSectionTitle}>Psychological Symptoms</Text>
            </View>
            <View style={styles.logItemsContainer}>
              {psychologicalLogs.map(log => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logTimeContainer}>
                    <Text style={styles.logTime}>
                      {moment(log.timestamp).format('HH:mm')}
                    </Text>
                  </View>
                  <View style={styles.logContentContainer}>
                    <Text style={styles.logText}>{log.symptom}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Other Symptoms Section */}
        {otherLogs.length > 0 && (
          <View style={styles.logSection}>
            <View style={styles.logSectionHeader}>
              <Text style={styles.logSectionIcon}>🔎</Text>
              <Text style={styles.logSectionTitle}>Other Symptoms</Text>
            </View>
            <View style={styles.logItemsContainer}>
              {otherLogs.map(log => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logTimeContainer}>
                    <Text style={styles.logTime}>
                      {moment(log.timestamp).format('HH:mm')}
                    </Text>
                  </View>
                  <View style={styles.logContentContainer}>
                    <Text style={styles.logText}>{log.symptom}</Text>
                    {log.symptom_type && (
                      <Text
                        style={[
                          styles.logText,
                          {color: '#888', fontSize: 12, marginLeft: 8},
                        ]}>
                        ({log.symptom_type})
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Thought Records Section */}
        {thoughtRecords.length > 0 && (
          <View style={styles.logSection}>
            <View style={styles.logSectionHeader}>
              <Text style={styles.logSectionIcon}>💭</Text>
              <Text style={styles.logSectionTitle}>Thought Records</Text>
            </View>
            <View style={styles.logItemsContainer}>
              {thoughtRecords.map(record => (
                <TouchableOpacity
                  key={record.id}
                  style={styles.logItem}
                  onPress={() => openThoughtRecordModal(record)}>
                  <View style={styles.logTimeContainer}>
                    <Text style={styles.logTime}>
                      {moment(record.timestamp).format('HH:mm')}
                    </Text>
                  </View>
                  <View style={styles.logContentContainer}>
                    <Text style={styles.logText} numberOfLines={1}>
                      {record.thought}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#666" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {logs.length === 0 && thoughtRecords.length === 0 && (
          <View style={styles.noLogsContainer}>
            <Text style={styles.noLogsIcon}>📝</Text>
            <Text style={styles.noLogsMessage}>
              No symptoms or mood were logged on this day.
            </Text>
            <Text style={styles.noLogsSubMessage}>
              {canEdit
                ? 'Consider adding some entries to track your health journey.'
                : 'No entries were logged for this date.'}
            </Text>
            {canEdit && (
              <TouchableOpacity
                style={styles.addFirstEntryButton}
                onPress={navigateToLogSymptoms}
                activeOpacity={0.7}>
                <Text style={styles.addFirstEntryButtonText}>
                  Add First Entry
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Thought Record Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeThoughtRecordModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thought Record</Text>

            <ScrollView>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Thought</Text>
                <Text style={styles.modalText}>{selectedThought?.thought}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>How I Felt</Text>
                <Text style={styles.modalText}>{selectedThought?.feel}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Evidence For</Text>
                <Text style={styles.modalText}>
                  {selectedThought?.evidence_for}
                </Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Evidence Against</Text>
                <Text style={styles.modalText}>
                  {selectedThought?.evidence_against}
                </Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>What I Did</Text>
                <Text style={styles.modalText}>
                  {selectedThought?.what_i_did}
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeThoughtRecordModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  title: {
    fontSize: 24,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    marginLeft: 30,
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
  disabledText: {
    color: '#CCCCCC',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  dateNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTextContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  dateTitle: {
    fontSize: 20,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  todayLabel: {
    fontSize: 14,
    color: lightTheme.primary,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  cycleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  cycleColorDot: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  cycleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  // Content styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
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

  // Add Entry Button
  addEntryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: lightTheme.primary,
    borderStyle: 'dashed',
  },
  addEntryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addEntryText: {
    fontSize: 16,
    color: lightTheme.primary,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Log Sections
  logSection: {
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
  logSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  logSectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  logSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  logItemsContainer: {
    paddingLeft: 0,
  },
  logItem: {
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
  logTimeContainer: {
    minWidth: 60,
    marginRight: 16,
  },
  logTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  logContentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  logText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },

  // No logs container
  noLogsContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginTop: 20,
  },
  noLogsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noLogsMessage: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  noLogsSubMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  addFirstEntryButton: {
    backgroundColor: lightTheme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstEntryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: lightTheme.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DayDetailScreen;
