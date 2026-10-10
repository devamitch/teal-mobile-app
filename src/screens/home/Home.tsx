import MainHeader from '@/components/common/headers/MainHeader';

const renderEmojiComponent = (Component: any) => {
  return <Component width={48} height={48} />;
};
import LogActionButton from '@/components/common/log-action-button';
import Colors, {lightTheme} from '@/constants/colors';
import useAppStore from '@/core/stores';
import {
  fetchCycleRecordByDate,
  fetchSymptomRecordCounts,
  initializeFeminineHealthDatabase,
  insertSymptomTrackerRecord,
} from '@/services/sqlite/feminine-health';
import {Toast} from '@/utils/toast';
import {useEffect, useMemo, useRef, useState, useCallback} from 'react';
import {Animated, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import SizeBox from '../../components/common/size-box';
import DaysChart from './components/DaysChart';
import SymptomsBoxs from './components/SymptomsBoxs';
import Styles from './HomeStyle';
import {
  DEFAULT_PHYSICAL,
  DEFAULT_PSYCHOLOGICAL,
  MoodList,
  PHYSICAL_SYMPTOMS_FULL,
  PSYCHOLOGICAL_SYMPTOMS_FULL,
} from './home.constants';
import moment from 'moment';
import {getCurrentCyclePhase} from '@/utils/cycle-phase';
import {getPhaseSpecificSymptomsForDisplay} from '@/constants/phase-symptoms';

// --- Add normalization helper ---
function normalizeSymptomName(name: string): string {
  return name.trim().toLowerCase();
}

type CycleRecord = {
  id?: string;
  date: string;
  color: string;
  start_date?: number;
  end_date?: number;
  is_last_date?: number;
  day: number;
};

const Home = ({navigation}: any) => {
  const [isFabOpen, setIsFabOpen] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const blurOpacity = useRef(new Animated.Value(0)).current;

  // Zustand store for symptoms & mood
  const {
    currentMood,
    dailySymptomsCount,
    setCurrentMood,
    resetCurrentMood,
    updateDailySymptomCount,
    loadDailySymptomsFromStorage,
    loadEmojiStateFromStorage,
    loadRecentSymptomsFromStorage,
    loadCustomSymptomsFromStorage,
    clearEmojiTimeout,
    recentSymptoms: storedRecentSymptoms,
    symptomUsage,
    getCustomPhysicalSymptoms,
    getCustomPsychologicalSymptoms,
  } = useAppStore(state => state.recent_symptom);

  const [isDatabaseInitialized, setIsDatabaseInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [todayRecord, setTodayRecord] = useState<CycleRecord | undefined>(
    undefined,
  );

  // Get cycle data and actions from Zustand store
  const {fetchCycleData, lastUpdated} = useAppStore(state => state.cycle);

  // Get persistent recently used symptoms (up to 15 symptoms) with sorting
  const recentSymptoms = useMemo(() => {
    // Sort symptoms by usage frequency (most used first), then by last used time
    const sortedSymptoms = [...storedRecentSymptoms].sort((a, b) => {
      const aUsage = symptomUsage[normalizeSymptomName(a.name)] || {
        count: 0,
        lastUsed: 0,
      };
      const bUsage = symptomUsage[normalizeSymptomName(b.name)] || {
        count: 0,
        lastUsed: 0,
      };

      // Primary sort: by usage count (descending - most used first)
      if (aUsage.count !== bUsage.count) {
        return bUsage.count - aUsage.count;
      }

      // Secondary sort: by last used time (descending - most recent first)
      return bUsage.lastUsed - aUsage.lastUsed;
    });

    const result = sortedSymptoms
      .map(symptom => ({
        name: symptom.name,
        type: symptom.type,
        count:
          symptom.type === 'physical'
            ? dailySymptomsCount?.['Physical Symptom']?.[
                normalizeSymptomName(symptom.name)
              ] || 0
            : dailySymptomsCount?.['Psychological Symptom']?.[
                normalizeSymptomName(symptom.name)
              ] || 0,
      }))
      .slice(0, 15); // Limit to 15 symptoms

    return result;
  }, [storedRecentSymptoms, symptomUsage, dailySymptomsCount]);

  // Mood logging
  const handleEmojisPress = async (id: string) => {
    if (!isDatabaseInitialized) {
      Toast('Database not ready. Please try again.');
      return;
    }

    try {
      const newMood = currentMood === id ? '' : id;

      if (newMood) {
        setCurrentMood(newMood);
      } else {
        resetCurrentMood();
      }

      const success = await insertSymptomTrackerRecord({
        symptom_type: 'Mood',
        symptom: id,
        count: 0, // Mood doesn't have a 'count' in the same way symptoms do
      });

      if (success) {
        updateDailySymptomCount('Mood', id, 1);
      }
    } catch (error) {
      console.error('Error logging mood:', error);
      Toast('Error logging mood');
    }
  };

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

  const loadSymptomCounts = useCallback(async () => {
    if (!isDatabaseInitialized) return;
    try {
      const from = new Date();
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setHours(23, 59, 59, 999);

      // FIX: Fetch counts for ALL known symptoms, not just the hardcoded full list.
      // This includes custom symptoms and recent symptoms to ensure the UI is always in sync.
      const customPhysical =
        getCustomPhysicalSymptoms().map(normalizeSymptomName);
      const customPsychological =
        getCustomPsychologicalSymptoms().map(normalizeSymptomName);
      const recentPhysical = storedRecentSymptoms
        .filter(s => s.type === 'physical')
        .map(s => normalizeSymptomName(s.name));
      const recentPsychological = storedRecentSymptoms
        .filter(s => s.type === 'psychological')
        .map(s => normalizeSymptomName(s.name));

      const allPhysicalToFetch = Array.from(
        new Set([
          ...PHYSICAL_SYMPTOMS_FULL.map(normalizeSymptomName),
          ...customPhysical,
          ...recentPhysical,
        ]),
      );
      const allPsychologicalToFetch = Array.from(
        new Set([
          ...PSYCHOLOGICAL_SYMPTOMS_FULL.map(normalizeSymptomName),
          ...customPsychological,
          ...recentPsychological,
        ]),
      );

      const counts = await fetchSymptomRecordCounts([
        ...allPhysicalToFetch.map(symptom => ({
          symptom,
          symptom_type: 'Physical Symptom',
          from,
          to,
        })),
        ...allPsychologicalToFetch.map(symptom => ({
          symptom,
          symptom_type: 'Psychological Symptom',
          from,
          to,
        })),
      ]);

      Object.entries(counts).forEach(([symptomType, symptoms]) => {
        Object.entries(symptoms as Record<string, number>).forEach(
          ([symptom, count]) => {
            updateDailySymptomCount(
              symptomType as
                | 'Physical Symptom'
                | 'Psychological Symptom'
                | 'Mood',
              normalizeSymptomName(symptom), // normalize for storage
              count,
            );
          },
        );
      });
    } catch (error) {
      console.error('Error loading symptom counts:', error);
    }
  }, [
    isDatabaseInitialized,
    updateDailySymptomCount,
    getCustomPhysicalSymptoms,
    getCustomPsychologicalSymptoms,
    storedRecentSymptoms,
  ]);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      try {
        const dbInitialized = await initializeFeminineHealthDatabase();
        if (!dbInitialized) {
          Toast('Database initialization failed');
          setIsLoading(false);
          return;
        }
        setIsDatabaseInitialized(true);
        // Load state from async storage first for a snappy UI
        loadDailySymptomsFromStorage();
        loadEmojiStateFromStorage();
        loadRecentSymptomsFromStorage();
        loadCustomSymptomsFromStorage();
        // Then, fetch fresh data from the database
        await loadSymptomCounts();
        await fetchCycleData();
      } catch (error) {
        console.error('Error during app initialization:', error);
        Toast('Error initializing app');
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  useEffect(() => {
    return () => {
      clearEmojiTimeout();
    };
  }, [clearEmojiTimeout]);

  useFocusEffect(
    useCallback(() => {
      // Refresh data when the screen comes into focus
      fetchCycleData();
      loadSymptomCounts();
    }, [fetchCycleData, loadSymptomCounts]),
  );

  useEffect(() => {
    try {
      const date = moment().format('YYYY-MM-DD');
      fetchCycleRecordByDate(date)
        .then(val => {
          setTodayRecord(val);
        })
        .catch(err => {
          console.error(err);
        });
    } catch (error) {
      console.error(error);
    }
  }, [lastUpdated]);

  const refreshSymptomCounts = useCallback(async () => {
    if (!isDatabaseInitialized) {
      return;
    }
    await loadSymptomCounts();
  }, [isDatabaseInitialized, loadSymptomCounts]);

  // Get current cycle phase and phase-specific symptoms
  const currentPhase = getCurrentCyclePhase(todayRecord);

  // Get phase-specific symptoms, fallback to defaults if no phase data
  const physicalSymptomsToShow = useMemo(() => {
    if (todayRecord) {
      return getPhaseSpecificSymptomsForDisplay(currentPhase, 'physical', 6);
    }
    return DEFAULT_PHYSICAL;
  }, [currentPhase, todayRecord]);

  const psychologicalSymptomsToShow = useMemo(() => {
    if (todayRecord) {
      return getPhaseSpecificSymptomsForDisplay(
        currentPhase,
        'psychological',
        6,
      );
    }
    return DEFAULT_PSYCHOLOGICAL;
  }, [currentPhase, todayRecord]);

  if (isLoading) {
    return (
      <View
        style={[
          Styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <Text style={{fontSize: 18, color: Colors.black}}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={Styles.container}>
      <MainHeader
        isEmodeOn={true}
        showBackButton={false}
        onPressEmode={() => navigation.navigate('Emode')}
        onNextPress={() => navigation.navigate('Chat')}
      />

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}>
        <SizeBox height={20} />
        <DaysChart
          onPlusPress={() => navigation.navigate('Calendar')}
          todayRecord={todayRecord}
        />

        <SizeBox height={20} />
        <Text style={Styles.title}>Mood</Text>

        <View
          style={{
            height: 90,
            marginHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            paddingHorizontal: 5,
          }}>
          {MoodList.map(item => {
            return (
              <TouchableOpacity
                key={item.id}
                style={{
                  zIndex: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  opacity:
                    currentMood !== '' && currentMood !== item.id ? 0.2 : 1,
                }}
                onPress={() => handleEmojisPress(item.id)}>
                <View
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {item.type === 'svg' ? (
                    renderEmojiComponent(item.Component)
                  ) : (
                    <Animated.Image
                      source={item.source}
                      style={{
                        width: 48,
                        height: 48,
                        resizeMode: 'contain',
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recently Used Symptoms */}
        {recentSymptoms.length > 0 && (
          <>
            <Text style={Styles.title}>Recently Used Symptoms</Text>
            <View style={Styles.nameList}>
              {recentSymptoms.map(recentSymptom => (
                <SymptomsBoxs
                  key={`${recentSymptom.type}-${recentSymptom.name}-${recentSymptom.count}`}
                  name={recentSymptom.name}
                  displayName={recentSymptom.name
                    .split(' ')
                    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ')}
                  bgColor={
                    recentSymptom.type === 'physical'
                      ? lightTheme.physicalSymptomBg
                      : lightTheme.psychologicalSymptomBg
                  }
                  textColor={Colors.black}
                  symptomType={
                    recentSymptom.type === 'physical'
                      ? 'Physical Symptom'
                      : 'Psychological Symptom'
                  }
                  count={recentSymptom.count}
                  onSymptomUpdate={refreshSymptomCounts}
                />
              ))}
            </View>
          </>
        )}

        <Text style={Styles.title}>Physical Symptoms</Text>
        <View style={Styles.nameList}>
          {physicalSymptomsToShow.map(name => {
            const count =
              dailySymptomsCount?.['Physical Symptom']?.[
                normalizeSymptomName(name)
              ] || 0;
            return (
              <SymptomsBoxs
                key={`${name}-${count}`}
                name={name}
                displayName={name
                  .split(' ')
                  .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ')}
                bgColor={lightTheme.physicalSymptomBg}
                textColor={Colors.black}
                symptomType="Physical Symptom"
                count={count}
                onSymptomUpdate={refreshSymptomCounts}
              />
            );
          })}
        </View>

        <Text style={Styles.title}>Psychological Symptoms</Text>
        <View style={Styles.nameList}>
          {psychologicalSymptomsToShow.map(name => {
            const count =
              dailySymptomsCount?.['Psychological Symptom']?.[
                normalizeSymptomName(name)
              ] || 0;
            return (
              <SymptomsBoxs
                key={`${name}-${count}`}
                name={name}
                displayName={name
                  .split(' ')
                  .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ')}
                bgColor={lightTheme.psychologicalSymptomBg}
                textColor={Colors.black}
                symptomType="Psychological Symptom"
                count={count}
                onSymptomUpdate={refreshSymptomCounts}
              />
            );
          })}
        </View>

        <SizeBox height={60} />
      </ScrollView>

      {/* Overlay instead of BlurView */}
      {isFabOpen && (
        <Animated.View
          style={[
            Styles.overlay,
            {
              opacity: blurOpacity,
            },
          ]}>
          <TouchableOpacity
            style={Styles.overlayTouchable}
            onPress={toggleFab}
            activeOpacity={1}
          />
        </Animated.View>
      )}

      <LogActionButton />
    </View>
  );
};

export default Home;
