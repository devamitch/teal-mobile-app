import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {lightTheme} from '@/constants/colors';
import {PostActivityConfig} from '@/data/videoData';
import MensusCalendar from '../common/menstrual-cycle-calendar';
import useAppStore from '@/core/stores';
import moment from 'moment';

interface CalendarActivityProps {
  activity: PostActivityConfig;
  response?: any;
  onResponseChange: (response: any) => void;
}

const CalendarActivity: React.FC<CalendarActivityProps> = ({
  onResponseChange,
}) => {
  // Mock calendar data
  const [calendarData] = useState({
    currentCycle: 15,
    cycleLength: 28,
    highRiskDays: [10, 11, 12, 22, 23, 24, 25],
    symptoms: {
      10: ['Irritability'],
      11: ['Irritability', 'Anxiety'],
      12: ['Mood swings'],
      22: ['Depression', 'Fatigue'],
      23: ['Depression', 'Irritability'],
      24: ['Anxiety', 'Mood swings'],
      25: ['Irritability'],
    },
  });

  const {markedDates, generateContinuesDate} = useAppStore(state => state.cycle);
  const {getQuizWithID} = useAppStore(state => state.engagement)

  const total_cycle_days = getQuizWithID(5)?.answer || 28;
  const dummyDates = generateContinuesDate(moment().date(1), total_cycle_days);

  React.useEffect(() => {
    onResponseChange({
      viewed: true,
      timestamp: new Date().toISOString(),
      calendarData,
    });
  }, [onResponseChange]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MensusCalendar
          markedDates={
            Object.keys(markedDates).length 
              ? markedDates 
              : dummyDates
            }
          style={styles.fullWidthCalendar}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  fullWidthCalendar: {
    width: '100%',
    borderRadius: 20,
  },
  calendarCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  cycleInfo: {
    fontSize: 14,
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayButton: {
    width: '12.5%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  currentDay: {
    backgroundColor: lightTheme.gradientMiddle,
    borderColor: lightTheme.gradientMiddle,
  },
  highRiskDay: {
    backgroundColor: '#FFE8E8',
    borderColor: '#FF5252',
  },
  dayText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  currentDayText: {
    color: '#FFF',
    fontWeight: '700',
  },
  highRiskDayText: {
    color: '#FF5252',
    fontWeight: '600',
  },
  symptomIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  legendText: {
    fontSize: 10,
    color: '#666',
  },
  insightsCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: lightTheme.gradientMiddle + '20',
    marginTop: 20,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
});

export default CalendarActivity;
