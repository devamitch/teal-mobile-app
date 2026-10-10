import {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Colors, {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import BackButton from '@/components/ui/buttons/back-button';
import Slider from '@react-native-community/slider';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import useAppStore from '@/core/stores';
import AlertBox from '@/components/ui/modal/alert-box';
import {
  insertSymptomTrackerRecord,
  deleteLastUpdatedSypmtomRecord,
} from '@/services/sqlite/feminine-health';

function normalizeSymptomName(name: string): string {
  return name.trim().toLowerCase();
}
// Menstrual symptoms (sorted and deduplicated, mapped smartly to physical/psychological)
const additionalSymptoms = [
  // Menstrual phase (during period)
  {label: 'Relief', type: 'psychological'},
  {label: 'Sensitive', type: 'psychological'}, // can be both, but more psychological in this context
  {label: 'Exhaustion', type: 'physical'},
  {label: 'Peace', type: 'psychological'},
  {label: 'Fatigue', type: 'physical'},
  {label: 'Cramps', type: 'physical'},
  {label: 'Back pain', type: 'physical'},
  {label: 'Leg pain', type: 'physical'},
  {label: 'Breast pain', type: 'physical'},
  {label: 'Headaches', type: 'physical'},
  {label: 'Migraine', type: 'physical'},
  {label: 'Low mood', type: 'psychological'},
  {label: 'Sad', type: 'psychological'},
  {label: 'Self-harm', type: 'psychological'},
  {label: 'Suicidal', type: 'psychological'},
  {label: 'Heavy flow', type: 'physical'},
  {label: 'Light flow', type: 'physical'},
  {label: 'Spotting', type: 'physical'},
  {label: 'Leg cramps', type: 'physical'},
  {label: 'Dizziness', type: 'physical'},
  {label: 'Nausea', type: 'physical'},
  {label: 'Diarrhea', type: 'physical'},
  {label: 'Constipation', type: 'physical'},
  {label: 'Mood swings', type: 'psychological'},
  {label: 'Anxiety', type: 'psychological'},
  {label: 'Sadness', type: 'psychological'},
  {label: 'Difficulty concentrating', type: 'psychological'},
  {label: 'Low motivation', type: 'psychological'},
  {label: 'Sleepiness', type: 'psychological'},
  {label: 'Tearfulness', type: 'psychological'},
  {label: 'Restlessness', type: 'psychological'},
  {label: 'Social withdrawal', type: 'psychological'},
  {label: 'Frustration', type: 'psychological'},

  // Follicular Phase
  {label: 'Inspired', type: 'psychological'},
  {label: 'Energized', type: 'psychological'},
  {label: 'Curious', type: 'psychological'},
  {label: 'Playful', type: 'psychological'},
  {label: 'Ambitious', type: 'psychological'},
  {label: 'Social', type: 'psychological'},
  {label: 'Optimistic', type: 'psychological'},
  {label: 'Confident', type: 'psychological'},
  {label: 'Increased energy', type: 'physical'},
  {label: 'Clear skin', type: 'physical'},
  {label: 'Breast sensitivity', type: 'physical'},
  {label: 'Cervical mucus', type: 'physical'},
  {label: 'Temperature rise', type: 'physical'},
  {label: 'Improved sleep', type: 'physical'},
  {label: 'Steady appetite', type: 'physical'},
  {label: 'Elevated mood', type: 'psychological'},
  {label: 'Improved focus', type: 'psychological'},
  {label: 'Increased motivation', type: 'psychological'},
  {label: 'Social engagement', type: 'psychological'},
  {label: 'Creativity', type: 'psychological'},
  {label: 'Calmness', type: 'psychological'},

  // Ovulation
  {label: 'Energized', type: 'psychological'},
  {label: 'Curious', type: 'psychological'},
  {label: 'Playful', type: 'psychological'},
  {label: 'Ambitious', type: 'psychological'},
  {label: 'Sensitive', type: 'psychological'},
  {label: 'Happy', type: 'psychological'},
  {label: 'Ecstatic', type: 'psychological'},
  {label: 'Irritable', type: 'psychological'},
  {label: 'Restless', type: 'psychological'},
  {label: 'Decreased appetite', type: 'physical'},
  {label: 'Breast pain', type: 'physical'},
  {label: 'Bloating', type: 'physical'},
  {label: 'Tenderness', type: 'physical'},
  {label: 'Ovulation pain', type: 'physical'},
  {label: 'Spotting', type: 'physical'},
  {label: 'Libido', type: 'physical'},
  {label: 'Pelvic pain', type: 'physical'},
  {label: 'Increased strength', type: 'physical'},
  {label: 'Sociability', type: 'psychological'},
  {label: 'Sensory sensitivity', type: 'psychological'},
  {label: 'Risk-taking', type: 'psychological'},
  {label: 'Euphoria', type: 'psychological'},
  {label: 'Impulsivity', type: 'psychological'},

  // Luteal
  {label: 'Sad', type: 'psychological'},
  {label: 'Hopeless', type: 'psychological'},
  {label: 'Anxious', type: 'psychological'},
  {label: 'Restless', type: 'psychological'},
  {label: 'Irritable', type: 'psychological'},
  {label: 'Anger', type: 'psychological'},
  {label: 'Rage', type: 'psychological'},
  {label: 'Vulnerable', type: 'psychological'},
  {label: 'Reactive', type: 'psychological'},
  {label: 'Tearful', type: 'psychological'},
  {label: 'Low mood', type: 'psychological'},
  {label: 'Disconnected', type: 'psychological'},
  {label: 'Low interest', type: 'psychological'},
  {label: 'Brain fog', type: 'psychological'},
  {label: 'Fatigue', type: 'physical'},
  {label: 'Lethargy', type: 'physical'},
  {label: 'Increased appetite', type: 'physical'},
  {label: 'Cravings', type: 'physical'},
  {label: 'Poor sleep', type: 'psychological'},
  {label: 'Very sleepy', type: 'physical'},
  {label: 'Bloating', type: 'physical'},
  {label: 'Headaches', type: 'physical'},
  {label: 'Migraine', type: 'physical'},
  {label: 'Slow', type: 'physical'},
  {label: 'Self-harm', type: 'psychological'},
  {label: 'Suicidal', type: 'psychological'},
  {label: 'Muscle ache', type: 'physical'},
  {label: 'Joint pain', type: 'physical'},
  {label: 'Acne', type: 'physical'},
  {label: 'Food craving', type: 'physical'},
  {label: 'Sweet craving', type: 'physical'},
  {label: 'Salty craving', type: 'physical'},
  {label: 'Weight gain', type: 'physical'},
  {label: 'Water retention', type: 'physical'},
  {label: 'Thirst', type: 'physical'},
  {label: 'Depression', type: 'psychological'},
  {label: 'Insomnia', type: 'psychological'},
  {label: 'Oversleeping', type: 'psychological'},
  {label: 'Emotional sensitivity', type: 'psychological'},
  {label: 'Decreased libido', type: 'psychological'},
  {label: 'Tension', type: 'psychological'},
];

// Original lists
const physicalSymptomsListBase = [
  'Abdominal bloating',
  'Breast tenderness',
  'Headaches',
  'Muscle aches',
  'Joint pain',
  'Fatigue',
  'Sleep disturbances',
  'Weight gain',
  'Cramps',
  'Back pain',
  'Digestive changes',
  'Nausea',
  'Acne',
  'Dizziness',
  'Hot flashes',
  'Cold sweats',
  'Appetite changes',
  'Increased thirst',
  'Swelling of hands/feet',
  'Constipation',
  'Diarrhea',
  'Heart palpitations',
  'Clumsiness',
  'Low energy',
  'Vaginal dryness',
  'Pelvic pain',
  'Sweating',
  'Allergies flare-up',
  'Hair loss',
  'Frequent urination',
];

const psychologicalSymptomsListBase = [
  'Mood swings',
  'Irritability',
  'Depression',
  'Anxiety',
  'Tension',
  'Anger',
  'Crying spells',
  'Forgetfulness',
  'Difficulty concentrating',
  'Confusion',
  'Insomnia',
  'Restlessness',
  'Social withdrawal',
  'Overwhelm',
  'Low self-esteem',
  'Hopelessness',
  'Panic attacks',
  'Loss of interest',
  'Sensitivity to rejection',
  'Feeling out of control',
  'Paranoia',
  'Racing thoughts',
  'Emotional numbness',
  'Guilt',
  'Impatience',
];

// Merge additional symptoms smartly and deduplicate
function mergeSymptoms(
  base: string[],
  additions: {label: string; type: string}[],
  type: 'physical' | 'psychological',
) {
  const set = new Set(base.map(normalizeSymptomName));
  for (const item of additions) {
    if (item.type === type && !set.has(normalizeSymptomName(item.label))) {
      set.add(normalizeSymptomName(item.label));
    }
  }
  return Array.from(set);
}

const physicalSymptomsList = mergeSymptoms(
  physicalSymptomsListBase,
  additionalSymptoms,
  'physical',
);
const psychologicalSymptomsList = mergeSymptoms(
  psychologicalSymptomsListBase,
  additionalSymptoms,
  'psychological',
);

const moodQuestions = [
  {
    key: 'overallMood',
    question: 'How are you feeling overall?',
    left: 'Awful',
    mid: 'Okay',
    right: 'Great',
  },
  {
    key: 'energy',
    question: 'How is your energy level?',
    left: 'Very low',
    mid: 'Neutral',
    right: 'Very high',
  },
  {
    key: 'motivation',
    question: 'How motivated do you feel?',
    left: 'Not at all',
    mid: 'Somewhat',
    right: 'Extremely',
  },
  {
    key: 'anxiety',
    question: 'How anxious are you?',
    left: 'Calm',
    mid: 'Occasionally',
    right: 'Very anxious',
  },
  {
    key: 'irritability',
    question: 'How irritable are you?',
    left: 'Not at all',
    mid: 'Sometimes',
    right: 'Very irritable',
  },
  {
    key: 'sadness',
    question: 'How sad do you feel?',
    left: 'Not at all',
    mid: 'Sometimes',
    right: 'Very sad',
  },
  {
    key: 'focus',
    question: 'How focused are you?',
    left: 'Not at all',
    mid: 'Moderate',
    right: 'Very focused',
  },
  {
    key: 'selfEsteem',
    question: 'How is your self-esteem?',
    left: 'Very low',
    mid: 'Average',
    right: 'Very high',
  },
  {
    key: 'stress',
    question: 'How stressed do you feel?',
    left: 'Relaxed',
    mid: 'Sometimes',
    right: 'Extremely stressed',
  },
  {
    key: 'socialDesire',
    question: 'How much do you want to socialize?',
    left: 'Not at all',
    mid: 'Sometimes',
    right: 'Very much',
  },
];

// How many symptoms per row and max rows before "See More"
const SYMPTOMS_PER_ROW = 3;
const MAX_ROWS = 3;

export default function LogSymptomsScreen({navigation}: {navigation: any}) {
  const [visibility, setVisibility] = useState(false);
  const [shouldNavigateBack, setShouldNavigateBack] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedPhysical, setSelectedPhysical] = useState<{
    [key: string]: number;
  }>({});
  const [selectedPsychological, setSelectedPsychological] = useState<{
    [key: string]: number;
  }>({});
  const [mood, setMood] = useState<{[key: string]: number}>(
    moodQuestions.reduce(
      (acc, item) => ({...acc, [item.key]: 2}),
      {} as {[key: string]: number},
    ),
  );

  const [dynamicPhysicalSymptoms, setDynamicPhysicalSymptoms] = useState<
    string[]
  >([]);
  const [dynamicPsychologicalSymptoms, setDynamicPsychologicalSymptoms] =
    useState<string[]>([]);
  const [showAllPhysical, setShowAllPhysical] = useState(false);
  const [showAllPsychological, setShowAllPsychological] = useState(false);

  const {
    addRecentPhysical,
    addRecentPsychological,
    getRecentSymptoms,
    updateDailySymptomCount,
    addCustomSymptom,
    getCustomPhysicalSymptoms,
    getCustomPsychologicalSymptoms,
    loadCustomSymptomsFromStorage,
    dailySymptomsCount,
  } = useAppStore(state => state.recent_symptom);

  useEffect(() => {
    const updateLists = () => {
      const customPhysical = getCustomPhysicalSymptoms();
      const customPsychological = getCustomPsychologicalSymptoms();

      setDynamicPhysicalSymptoms([
        ...physicalSymptomsList,
        ...customPhysical.map(normalizeSymptomName),
      ]);
      setDynamicPsychologicalSymptoms([
        ...psychologicalSymptomsList,
        ...customPsychological.map(normalizeSymptomName),
      ]);
    };

    loadCustomSymptomsFromStorage();
    updateLists();
  }, [
    loadCustomSymptomsFromStorage,
    getCustomPhysicalSymptoms,
    getCustomPsychologicalSymptoms,
  ]);

  const recentSymptoms = getRecentSymptoms();

  const filteredPhysical = dynamicPhysicalSymptoms.filter(symp =>
    symp.includes(normalizeSymptomName(searchText)),
  );
  const filteredPsychological = dynamicPsychologicalSymptoms.filter(symp =>
    symp.includes(normalizeSymptomName(searchText)),
  );

  const physicalNoMatch =
    searchText.length > 0 && filteredPhysical.length === 0;
  const psychologicalNoMatch =
    searchText.length > 0 && filteredPsychological.length === 0;

  const visiblePhysical = showAllPhysical
    ? filteredPhysical
    : filteredPhysical.slice(0, SYMPTOMS_PER_ROW * MAX_ROWS);
  const visiblePsychological = showAllPsychological
    ? filteredPsychological
    : filteredPsychological.slice(0, SYMPTOMS_PER_ROW * MAX_ROWS);

  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  const triggerHapticFeedback = (level: number) => {
    if (level === 0) {
      ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
    } else if (level === 1) {
      ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
    } else if (level === 2) {
      ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
    } else if (level === 3) {
      ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
    } else if (level === 4) {
      ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
    }
  };

  const triggerSymptomHaptic = (intensity: number) => {
    if (intensity === 1) {
      ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
    } else if (intensity === 2) {
      ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
    } else if (intensity === 3) {
      ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
    } else if (intensity === 4) {
      ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
    } else if (intensity >= 5) {
      ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
    }
  };

  const handleMoodChange = (key: string, value: number) => {
    if (mood[key] !== value) {
      triggerHapticFeedback(value);
      setMood(prev => ({...prev, [key]: value}));
    }
  };

  const handlePhysicalPress = async (symptom: string) => {
    const normalizedSymptom = normalizeSymptomName(symptom);
    const previousCount =
      dailySymptomsCount['Physical Symptom'][normalizedSymptom] || 0;
    const newIntensity = (selectedPhysical[normalizedSymptom] || 0) + 1;
    setSelectedPhysical(prev => ({
      ...prev,
      [normalizedSymptom]: newIntensity,
    }));
    triggerSymptomHaptic(newIntensity);

    try {
      await insertSymptomTrackerRecord({
        symptom_type: 'Physical Symptom',
        symptom: normalizedSymptom,
        count: previousCount + 1,
      });
      updateDailySymptomCount(
        'Physical Symptom',
        normalizedSymptom,
        previousCount + 1,
      );
      addRecentPhysical(normalizedSymptom);
    } catch (error) {
      console.error('Error logging physical symptom:', error);
    }
  };

  const handlePsychologicalPress = async (symptom: string) => {
    const normalizedSymptom = normalizeSymptomName(symptom);
    const previousCount =
      dailySymptomsCount['Psychological Symptom'][normalizedSymptom] || 0;
    const newIntensity = (selectedPsychological[normalizedSymptom] || 0) + 1;
    setSelectedPsychological(prev => ({
      ...prev,
      [normalizedSymptom]: newIntensity,
    }));
    triggerSymptomHaptic(newIntensity);
    try {
      await insertSymptomTrackerRecord({
        symptom_type: 'Psychological Symptom',
        symptom: normalizedSymptom,
        count: previousCount + 1,
      });
      updateDailySymptomCount(
        'Psychological Symptom',
        normalizedSymptom,
        previousCount + 1,
      );
      addRecentPsychological(normalizedSymptom);
    } catch (error) {
      console.error('Error logging psychological symptom:', error);
    }
  };

  const handlePhysicalLongPress = async (symptom: string) => {
    const normalizedSymptom = normalizeSymptomName(symptom);
    const currentCount = selectedPhysical[normalizedSymptom] || 0;
    if (currentCount > 0) {
      const newIntensity = currentCount - 1;
      setSelectedPhysical(prev => ({
        ...prev,
        [normalizedSymptom]: newIntensity,
      }));
      triggerSymptomHaptic(newIntensity);

      try {
        await deleteLastUpdatedSypmtomRecord(
          normalizedSymptom,
          'Physical Symptom',
          currentCount,
        );
        const previousStoreCount =
          dailySymptomsCount['Physical Symptom'][normalizedSymptom] || 0;
        updateDailySymptomCount(
          'Physical Symptom',
          normalizedSymptom,
          Math.max(previousStoreCount - 1, 0),
        );
      } catch (error) {
        console.error('Error removing physical symptom:', error);
      }
    }
  };

  const handlePsychologicalLongPress = async (symptom: string) => {
    const normalizedSymptom = normalizeSymptomName(symptom);
    const currentCount = selectedPsychological[normalizedSymptom] || 0;
    if (currentCount > 0) {
      const newIntensity = currentCount - 1;
      setSelectedPsychological(prev => ({
        ...prev,
        [normalizedSymptom]: newIntensity,
      }));
      triggerSymptomHaptic(newIntensity);

      try {
        await deleteLastUpdatedSypmtomRecord(
          normalizedSymptom,
          'Psychological Symptom',
          currentCount,
        );
        const previousStoreCount =
          dailySymptomsCount['Psychological Symptom'][normalizedSymptom] || 0;
        updateDailySymptomCount(
          'Psychological Symptom',
          normalizedSymptom,
          Math.max(previousStoreCount - 1, 0),
        );
      } catch (error) {
        console.error('Error removing psychological symptom:', error);
      }
    }
  };

  const addCustomPhysicalSymptom = async () => {
    if (!searchText.trim()) return;

    const customSymptom = normalizeSymptomName(searchText.trim());
    ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);

    addCustomSymptom(customSymptom, 'physical');
    if (!dynamicPhysicalSymptoms.includes(customSymptom)) {
      setDynamicPhysicalSymptoms(prev => [...prev, customSymptom]);
    }
    const newIntensity = (selectedPhysical[customSymptom] || 0) + 1;
    setSelectedPhysical(prev => ({
      ...prev,
      [customSymptom]: newIntensity,
    }));

    addRecentPhysical(customSymptom);

    try {
      await insertSymptomTrackerRecord({
        symptom_type: 'Physical Symptom',
        symptom: customSymptom,
        count: newIntensity,
      });
      updateDailySymptomCount('Physical Symptom', customSymptom, newIntensity);
    } catch (error) {
      console.error('Error logging custom physical symptom:', error);
    }
    setSearchText('');
  };

  const addCustomPsychologicalSymptom = async () => {
    if (!searchText.trim()) return;

    const customSymptom = normalizeSymptomName(searchText.trim());
    ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);

    addCustomSymptom(customSymptom, 'psychological');
    if (!dynamicPsychologicalSymptoms.includes(customSymptom)) {
      setDynamicPsychologicalSymptoms(prev => [...prev, customSymptom]);
    }
    const newIntensity = (selectedPsychological[customSymptom] || 0) + 1;
    setSelectedPsychological(prev => ({
      ...prev,
      [customSymptom]: newIntensity,
    }));

    addRecentPsychological(customSymptom);

    try {
      await insertSymptomTrackerRecord({
        symptom_type: 'Psychological Symptom',
        symptom: customSymptom,
        count: newIntensity,
      });
      updateDailySymptomCount(
        'Psychological Symptom',
        customSymptom,
        newIntensity,
      );
    } catch (error) {
      console.error('Error logging custom psychological symptom:', error);
    }
    setSearchText('');
  };

  const handleSubmit = () => {
    ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);

    // FIX: The logic to update counts and add recent symptoms is already
    // handled in the handle...Press functions. Running it again here causes
    // the counts in the global state to be temporarily incorrect (e.g., doubled).
    // This incorrect state is the likely cause of the bug.
    // The only thing handleSubmit needs to do is show the success message
    // which then triggers navigation. All persistence is handled on press.
    setVisibility(true);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <BackButton style={styles.backButton} />
            </View>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Log Symptoms</Text>
              <Text style={styles.headerSubtitle}>
                Track your daily wellness
              </Text>
            </View>
            <View style={styles.headerRight} />
          </View>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search symptoms..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Recently Used Symptoms */}
          {recentSymptoms.length > 0 && searchText.length === 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recently Used</Text>
              <View style={styles.symptomsGrid}>
                {recentSymptoms.map(recentSymptom => (
                  <TouchableOpacity
                    key={`${recentSymptom.type}-${recentSymptom.name}`}
                    style={[
                      styles.symptomChip,
                      recentSymptom.type === 'physical'
                        ? styles.physicalSymptomChip
                        : styles.psychologicalSymptomChip,
                      (recentSymptom.type === 'physical'
                        ? (selectedPhysical[recentSymptom.name] || 0) > 0
                        : (selectedPsychological[recentSymptom.name] || 0) >
                          0) &&
                        (recentSymptom.type === 'physical'
                          ? styles.physicalSymptomChipSelected
                          : styles.psychologicalSymptomChipSelected),
                    ]}
                    onPress={() =>
                      recentSymptom.type === 'physical'
                        ? handlePhysicalPress(recentSymptom.name)
                        : handlePsychologicalPress(recentSymptom.name)
                    }
                    onLongPress={() =>
                      recentSymptom.type === 'physical'
                        ? handlePhysicalLongPress(recentSymptom.name)
                        : handlePsychologicalLongPress(recentSymptom.name)
                    }
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.symptomChipText,
                        (recentSymptom.type === 'physical'
                          ? (selectedPhysical[recentSymptom.name] || 0) > 0
                          : (selectedPsychological[recentSymptom.name] || 0) >
                            0) && styles.symptomChipTextSelected,
                      ]}>
                      {recentSymptom.name.replace(
                        /\w\S*/g,
                        w => w.charAt(0).toUpperCase() + w.slice(1),
                      )}
                    </Text>
                    {(() => {
                      const normalizedName = normalizeSymptomName(
                        recentSymptom.name,
                      );
                      const count =
                        recentSymptom.type === 'physical'
                          ? dailySymptomsCount['Physical Symptom'][
                              normalizedName
                            ] || 0
                          : dailySymptomsCount['Psychological Symptom'][
                              normalizedName
                            ] || 0;
                      return count > 0 ? (
                        <View style={styles.intensityBadge}>
                          <Text style={styles.intensityBadgeText}>{count}</Text>
                        </View>
                      ) : null;
                    })()}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Physical Symptoms */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Physical Symptoms</Text>
              <Text style={styles.sectionSubtitle}>
                Tap to add, long press to remove
              </Text>
            </View>
            <View style={styles.symptomsGrid}>
              {visiblePhysical.map(symptom => {
                const counter = selectedPhysical[symptom] || 0;
                const isSelected = counter > 0;
                // Capitalize each word
                const capitalized = symptom.replace(
                  /\w\S*/g,
                  w => w.charAt(0).toUpperCase() + w.slice(1),
                );
                return (
                  <TouchableOpacity
                    key={symptom}
                    style={[
                      styles.symptomChip,
                      styles.physicalSymptomChip,
                      isSelected && styles.physicalSymptomChipSelected,
                    ]}
                    onPress={() => handlePhysicalPress(symptom)}
                    onLongPress={() => handlePhysicalLongPress(symptom)}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.symptomChipText,
                        isSelected && styles.symptomChipTextSelected,
                      ]}>
                      {capitalized}
                    </Text>
                    {counter > 0 && (
                      <View style={styles.intensityBadge}>
                        <Text style={styles.intensityBadgeText}>{counter}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              {/* "Add Custom" button for physical symptoms */}
              {physicalNoMatch && (
                <TouchableOpacity
                  style={styles.othersChip}
                  onPress={addCustomPhysicalSymptom}
                  activeOpacity={0.7}>
                  <Text style={styles.othersChipText}>
                    + Add "{searchText}"
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {/* See more/less button */}
            {filteredPhysical.length > SYMPTOMS_PER_ROW * MAX_ROWS && (
              <TouchableOpacity
                style={{marginTop: 8}}
                onPress={() => {
                  ReactNativeHapticFeedback.trigger(
                    'impactLight',
                    hapticOptions,
                  );
                  setShowAllPhysical(v => !v);
                }}>
                <Text style={{color: Colors.lightGreen, fontWeight: '600'}}>
                  {showAllPhysical ? 'See Less' : 'See More'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Psychological Symptoms */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Psychological Symptoms</Text>
              <Text style={styles.sectionSubtitle}>
                Tap to add, long press to remove
              </Text>
            </View>
            <View style={styles.symptomsGrid}>
              {visiblePsychological.map(symptom => {
                const counter = selectedPsychological[symptom] || 0;
                const isSelected = counter > 0;
                // Capitalize each word
                const capitalized = symptom.replace(
                  /\w\S*/g,
                  w => w.charAt(0).toUpperCase() + w.slice(1),
                );
                return (
                  <TouchableOpacity
                    key={symptom}
                    style={[
                      styles.symptomChip,
                      styles.psychologicalSymptomChip,
                      isSelected && styles.psychologicalSymptomChipSelected,
                    ]}
                    onPress={() => handlePsychologicalPress(symptom)}
                    onLongPress={() => handlePsychologicalLongPress(symptom)}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.symptomChipText,
                        isSelected && styles.symptomChipTextSelected,
                      ]}>
                      {capitalized}
                    </Text>
                    {counter > 0 && (
                      <View style={styles.intensityBadge}>
                        <Text style={styles.intensityBadgeText}>{counter}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              {/* "Add Custom" button for psychological symptoms */}
              {psychologicalNoMatch && (
                <TouchableOpacity
                  style={styles.othersChip}
                  onPress={addCustomPsychologicalSymptom}
                  activeOpacity={0.7}>
                  <Text style={styles.othersChipText}>
                    + Add "{searchText}"
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {/* See more/less button */}
            {filteredPsychological.length > SYMPTOMS_PER_ROW * MAX_ROWS && (
              <TouchableOpacity
                style={{marginTop: 8}}
                onPress={() => {
                  ReactNativeHapticFeedback.trigger(
                    'impactLight',
                    hapticOptions,
                  );
                  setShowAllPsychological(v => !v);
                }}>
                <Text style={{color: Colors.lightGreen, fontWeight: '600'}}>
                  {showAllPsychological ? 'See Less' : 'See More'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Mood Assessment Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mood Assessment</Text>
              <Text style={styles.sectionSubtitle}>
                Rate how you're feeling today
              </Text>
            </View>
            {moodQuestions.map(q => (
              <View key={q.key} style={styles.moodItem}>
                <Text style={styles.moodQuestion}>{q.question}</Text>
                <View style={styles.sliderContainer}>
                  <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabelLeft}>{q.left}</Text>
                    <Text style={styles.sliderLabelRight}>{q.right}</Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={4}
                    step={1}
                    value={mood[q.key] ?? 2}
                    onValueChange={value => handleMoodChange(q.key, value)}
                    minimumTrackTintColor={Colors.lightGreen}
                    maximumTrackTintColor="#E5E7EB"
                    thumbTintColor={Colors.lightGreen}
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}>
            <Text style={styles.submitButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AlertBox
        visible={visibility}
        title="Success"
        message="Mood and symptoms logged successfully!"
        onClose={() => {
          setVisibility(false);

          setShouldNavigateBack(true);
        }}
        onModalHide={() => {
          if (shouldNavigateBack) {
            setShouldNavigateBack(false);
            navigation.goBack();
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    width: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 40,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 15,
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    fontFamily: FONT_FAMILIES.YoungSerifRegular || 'serif',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
    marginBottom: 8,
  },

  // Physical symptoms styling - using the same colors as HomeScreen
  physicalSymptomChip: {
    backgroundColor: lightTheme.physicalSymptomBg,
  },
  physicalSymptomChipSelected: {
    backgroundColor: lightTheme.physicalSymptomBg,
    borderColor: lightTheme.physicalSymptomBg,
  },

  // Psychological symptoms styling - using the same colors as HomeScreen
  psychologicalSymptomChip: {
    backgroundColor: lightTheme.psychologicalSymptomBg,
  },
  psychologicalSymptomChipSelected: {
    backgroundColor: lightTheme.psychologicalSymptomBg,
    borderColor: lightTheme.psychologicalSymptomBg,
  },

  symptomChipText: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '600',
  },
  symptomChipTextSelected: {
    color: Colors.black,
    fontWeight: '600',
  },
  intensityBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  intensityBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  othersChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  othersChipText: {
    fontSize: 14,
    color: Colors.lightGreen,
    fontWeight: '600',
  },

  moodItem: {
    marginBottom: 24,
  },
  moodQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sliderContainer: {
    paddingHorizontal: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderLabelLeft: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  sliderLabelRight: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  slider: {
    height: 40,
    marginHorizontal: -4,
  },
  midLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontStyle: 'italic',
  },
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  submitButton: {
    backgroundColor: Colors.lightGreen,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.lightGreen,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT_FAMILIES.YoungSerifRegular || 'serif',
  },
});
