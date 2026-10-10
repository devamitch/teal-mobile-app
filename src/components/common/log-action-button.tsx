import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useCallback, useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Toast} from '@/utils/toast';
import {initializeFeminineHealthDatabase} from '@/services/sqlite/feminine-health';
import {lightTheme} from '@/constants';
import LogPeriodModal from '@/screens/calendar/components/LogPeriodModal';
import ConfirmationAlertBox from '@/components/ui/modal/confirmation-alert-box';
import LogMood from '../../assets/images/log-mood.svg';
import LogSymptoms from '../../assets/images/log-symptoms.svg';
import ThoughtRecord from '../../assets/images/thought-record.svg';
import {useNavigation} from '@react-navigation/native';
import useAppStore from '@/core/stores';
import moment from 'moment';

interface LogActionButtonProps {
  date?: string;
}

const LogActionButton: React.FC<LogActionButtonProps> = () => {
  const navigation = useNavigation();

  const [isFabOpen, setIsFabOpen] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const blurOpacity = useRef(new Animated.Value(0)).current;

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isLogModalVisible, setLogModalVisible] = useState(false);
  const [isDatabaseInitialized, setIsDatabaseInitialized] = useState(false);
  const [irregularPeriods, setIrregularPeriods] = useState(false);

  // Sequential modal state
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState<{
    start: moment.Moment;
    end: moment.Moment;
    totalDays: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {addPeriodDates, isLoading, markedDates, adjustCycleAndPredictions} =
    useAppStore(state => state.cycle);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const fabOptions = [
    {
      id: '1',
      text: 'Log Period',
      icon: <Icon name="water-drop" size={24} color="black" />,
      action: () => {
        if (!isDatabaseInitialized) {
          Toast('Database not ready. Please try again.');
          return;
        }
        toggleFab();
        const today = new Date();
        setStartDate(today);
        setLogModalVisible(true);
      },
    },
    {
      id: '2',
      text: 'Log Symptoms',
      icon: <LogSymptoms width={24} height={24} />,
      action: () => {
        navigation.navigate('LogSymptoms', {date: new Date().toISOString()});
      },
    },
    {
      id: '3',
      text: 'Create Thought Record',
      icon: <ThoughtRecord width={24} height={24} />,
      action: () => {
        navigation.navigate('ThoughtRecord');
      },
    },
  ];

  const optionAnimations = useRef([
    {
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(50),
    },
    {
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(50),
    },
    {
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(50),
    },
  ]).current;

  const toggleFab = () => {
    const newState = !isFabOpen;
    setIsFabOpen(newState);

    Animated.timing(rotation, {
      toValue: newState ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(blurOpacity, {
      toValue: newState ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (newState) {
      optionAnimations.forEach((anim, index) => {
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            delay: 50 * index,
          }),
          Animated.timing(anim.translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            delay: 50 * index,
          }),
        ]).start();
      });
    } else {
      optionAnimations.forEach(anim => {
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: 50,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const initializeApp = useCallback(async () => {
    try {
      const dbInitialized = await initializeFeminineHealthDatabase();
      if (!dbInitialized) {
        Toast('Database initialization failed');
        return;
      }
      setIsDatabaseInitialized(true);
    } catch (error) {
      console.error('Error during app initialization:', error);
      Toast('Error initializing app');
    }
  }, [setIsDatabaseInitialized]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Sequential modal logic

  // Called from LogPeriodModal when Save is pressed and validation passes
  const handleRequestConfirmation = (data: {
    start: moment.Moment;
    end: moment.Moment;
    totalDays: number;
  }) => {
    setPendingSaveData(data);
    setLogModalVisible(false);
    setConfirmationVisible(true);
  };

  // Confirm modal: save data
  const handleConfirmSave = async () => {
    if (!pendingSaveData) return;
    try {
      setIsSaving(true);
      setConfirmationVisible(false);

      const {start, totalDays} = pendingSaveData;

      // If there's existing data, adjust the predictions
      if (Object.keys(markedDates).length > 0) {
        await adjustCycleAndPredictions(start, totalDays);
        Toast('Cycle predictions have been updated successfully!');
      } else {
        await addPeriodDates(start, start.clone().add(4), totalDays);
        Toast('Period dates saved successfully!');
      }

      useAppStore.getState().recent_symptom.resetDailySymptoms();

      // Reset everything
      setPendingSaveData(null);
    } catch (error: any) {
      Toast(`Error saving period dates: ${error.message || 'Unknown error'}`);
      console.error('Error saving period dates:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel modal: re-open log modal
  const handleCancelSave = () => {
    setConfirmationVisible(false);
    setLogModalVisible(true);
    setPendingSaveData(null);
  };

  return (
    <View>
      <View style={Styles.fabContainer}>
        {fabOptions.map((option, index) => (
          <Animated.View
            key={option.id}
            style={[
              Styles.fabOptionRow,
              {
                opacity: optionAnimations[index].opacity,
                transform: [{translateY: optionAnimations[index].translateY}],
                display: isFabOpen ? 'flex' : 'none',
              },
            ]}>
            <TouchableOpacity
              style={Styles.fabOptionText}
              onPress={() => option.action()}>
              <Text style={Styles.fabOptionTextContent}>{option.text}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.fabIconContainer}
              onPress={() => option.action()}>
              {option.icon}
            </TouchableOpacity>
          </Animated.View>
        ))}

        <TouchableOpacity
          style={[Styles.fab, {backgroundColor: lightTheme.gradientMiddle}]}
          onPress={toggleFab}>
          <Animated.View style={[{transform: [{rotate: rotateInterpolate}]}]}>
            <Icon name="add" size={28} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>
      {/* Log Period Modal */}
      <LogPeriodModal
        visible={isLogModalVisible}
        onRequestClose={() => setLogModalVisible(false)}
        isToggleOn={irregularPeriods}
        onTogglePress={() => setIrregularPeriods(!irregularPeriods)}
        startDate={startDate}
        onStartDateChange={setStartDate}
        onRequestConfirmation={handleRequestConfirmation}
        isSaving={isSaving}
        isLoading={isLoading}
      />

      {/* Confirmation modal, only visible after Save in LogPeriodModal */}
      <ConfirmationAlertBox
        visible={confirmationVisible}
        title="Confirm New Period"
        message={
          pendingSaveData && Object.keys(markedDates).length > 0
            ? 'Logging a new period will replace your existing cycle data and recalculate your predictions. Are you sure you want to continue?'
            : pendingSaveData
            ? 'Are you sure you want to log a new period? This will start a new cycle and generate predictions.'
            : ''
        }
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleConfirmSave}
        onCancel={handleCancelSave}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 2,
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
  fabOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'flex-end',
  },
  fabOptionText: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabOptionTextContent: {
    color: 'black',
    fontWeight: '500',
    fontSize: 14,
  },
  fabIconContainer: {
    backgroundColor: 'white',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default LogActionButton;
