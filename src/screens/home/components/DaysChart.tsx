import Colors, {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {IMAGES} from '@/constants/images';
import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import SizeBox from '../../../components/common/size-box';
import CircularProgress from './CircularProgress';
import {phaseData, phaseMap} from './daychart.constants';
import useAppStore from '@/core/stores';
import {LucideCalendar} from 'lucide-react-native';

interface DayChartProps {
  onPlusPress?: () => void;
  todayRecord?: DateRecordWithDate | undefined;
}

type DateRecordWithDate = {
  id?: string;
  date: string;
  color: string;
  start_date?: number;
  end_date?: number;
  is_last_date?: number;
  day: number;
  cycle_day?: number;
};

type MessageType = 'sensitive' | 'calm' | 'humor';

const DaysChart: React.FC<DayChartProps> = ({onPlusPress, todayRecord}) => {
  const [phaseDescription, setPhaseDescription] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('sensitive');

  const {getQuizWithID} = useAppStore(state => state.engagement);
  const total_cycle_days = getQuizWithID(5)?.answer || 28;

  // Function to get a random message from the current phase
  const getRandomMessage = (phase: string, type: MessageType): string => {
    const phaseInfo = phaseData[phase];
    if (!phaseInfo) return phaseData['Menstrual'].description;

    const messages = phaseInfo.messages[type];
    if (!messages || messages.length === 0) return phaseInfo.description;

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  // Function to get phase description with smart messaging
  const getPhaseDescription = (phase: string, day: number | null): string => {
    // If no cycle data available, return the specific message
    if (day === null) {
      return "Please log your period date by tapping on the '+' button below";
    }

    const phaseInfo = phaseData[phase];
    if (!phaseInfo) return phaseData['Menstrual'].description;

    // Check if period is irregular/delayed for menstrual phase
    if (phase === 'Menstrual' && day > 35 && phaseInfo.irregularMessages) {
      const randomIndex = Math.floor(
        Math.random() * phaseInfo.irregularMessages.length,
      );
      return phaseInfo.irregularMessages[randomIndex];
    }

    // Get a random message based on current message type
    return getRandomMessage(phase, messageType);
  };

  // Function to cycle through message types
  const cycleMessageType = () => {
    const types: MessageType[] = ['sensitive', 'calm', 'humor'];
    const currentIndex = types.indexOf(messageType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMessageType(types[nextIndex]);
  };

  // Update phase and description when days, cycle data, or message type changes
  useEffect(() => {
    const phase = todayRecord ? phaseMap[todayRecord?.color] : 'Menstrual';
    setPhaseDescription(
      getPhaseDescription(phase, todayRecord?.cycle_day || 0),
    );
  }, [todayRecord, messageType]);

  // Auto-cycle through message types every 24 hours (for demonstration, you can adjust this)
  useEffect(() => {
    const interval = setInterval(() => {
      cycleMessageType();
    }, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearInterval(interval);
  }, [messageType]);

  // Function to render day text based on whether we have data or not
  const renderDayText = () => {
    if (todayRecord?.cycle_day === undefined) {
      return <Text style={Styles.noDayText}>No Data</Text>;
    }
    return <Text style={Styles.dayText}>Day {todayRecord?.cycle_day}</Text>;
  };

  return (
    <View style={Styles.shadowContainer}>
      <View style={Styles.chartContainer}>
        <CircularProgress
          todayRecord={todayRecord}
          totalCycleDays={total_cycle_days}
        />
        <SizeBox width={5} />
        <View style={Styles.chartTextBox}>
          {renderDayText()}
          <Text style={Styles.phaseText}>
            {todayRecord ? phaseMap[todayRecord?.color] : 'Menstrual'}
          </Text>
          <TouchableOpacity
            onPress={cycleMessageType}
            style={Styles.messageContainer}>
            <Text style={Styles.dayDescText}>{phaseDescription}</Text>
            {todayRecord?.cycle_day !== undefined && (
              <Text style={Styles.messageTypeIndicator}>
                {messageType === 'sensitive'
                  ? '💪'
                  : messageType === 'calm'
                  ? '🧘'
                  : '😄'}{' '}
                Tap to change tone
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={onPlusPress}
          style={{
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#D9D9D9',
            position: 'absolute',
            top: 0,
            right: 0,
            borderBottomLeftRadius: 30,
          }}>
          <LucideCalendar style={{height: 20, width: 20}} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  shadowContainer: {
    marginHorizontal: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: lightTheme.background,
  },
  chartContainer: {
    borderRadius: 30,
    padding: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  chartTextBox: {
    width: '40%',
    alignSelf: 'center',
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  dayText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    marginBottom: 5,
  },
  noDayText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    marginBottom: 5,
  },
  phaseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF5B70',
    fontFamily: FONT_FAMILIES.LatoRegular,
    marginBottom: 8,
  },
  messageContainer: {
    width: '130%',
  },
  dayDescText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.black,
    fontFamily: FONT_FAMILIES.LatoRegular,
    lineHeight: 18,
    marginBottom: 5,
  },
  messageTypeIndicator: {
    fontSize: 10,
    color: '#666',
    fontFamily: FONT_FAMILIES.LatoRegular,
    opacity: 0.7,
  },
});

export default DaysChart;
