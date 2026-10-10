import MensusCalendar from '@/components/common/menstrual-cycle-calendar';
import useAppStore from '@/core/stores';
import {
  ActivityResponse,
  CalendarActivity,
} from '@/core/stores/slices/playlist/types';
import moment from 'moment';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

interface CalendarActivityProps {
  activity: CalendarActivity;
  response?: ActivityResponse<CalendarActivity>;
  onResponseChange: (response: ActivityResponse<CalendarActivity>) => void;
}

export const VideoCalendarActivityComponent: React.FC<
  CalendarActivityProps
> = ({activity, response, onResponseChange}) => {
  const {markedDates, generateContinuesDate} = useAppStore(
    state => state.cycle,
  );
  const {getQuizWithID} = useAppStore(state => state.engagement);

  const total_cycle_days = getQuizWithID(5)?.answer || 28;
  const dummyDates = generateContinuesDate(moment().date(1), total_cycle_days);

  // React.useEffect(() => {
  //   onResponseChange({
  //     selectedDate: new Date().toISOString(),
  //   });
  // }, [onResponseChange]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MensusCalendar
          markedDates={
            Object.keys(markedDates).length ? markedDates : dummyDates
          }
          style={styles.fullWidthCalendar}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  fullWidthCalendar: {
    width: '100%',
    borderRadius: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
});

export default VideoCalendarActivityComponent;
