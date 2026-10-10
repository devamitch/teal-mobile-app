import FONT_FAMILIES from '@/constants/fonts';
import {
  deleteLastUpdatedSypmtomRecord,
  insertSymptomTrackerRecord,
} from '@/services/sqlite/feminine-health';
import useAppStore from '@/core/stores';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import Colors from '@/constants/colors';

function normalizeSymptomName(name: string): string {
  return name.trim().toLowerCase();
}

interface SymptomsBoxsProps {
  name: string; // original name for logic
  displayName: string; // capitalized name for display
  bgColor: string;
  textColor: string;
  symptomType: 'Physical Symptom' | 'Psychological Symptom';
  count?: number;
  onSymptomUpdate?: () => Promise<void>;
}

const SymptomsBoxs = ({
  name,
  displayName,
  bgColor,
  textColor,
  symptomType,
  count = 0,
  onSymptomUpdate,
}: SymptomsBoxsProps) => {
  const {updateDailySymptomCount, addRecentSymptom, dailySymptomsCount} =
    useAppStore(state => state.recent_symptom);
  const [isLongPressing, setIsLongPressing] = React.useState(false);

  const normalizedName = normalizeSymptomName(name);

  // Always show the correct count from the store
  const displayedCount =
    dailySymptomsCount?.[symptomType]?.[normalizedName] || 0;

  const handlePress = async () => {
    if (isLongPressing) {
      setIsLongPressing(false);
      return;
    }

    const newCount = displayedCount + 1;

    try {
      await insertSymptomTrackerRecord({
        symptom_type: symptomType,
        symptom: normalizedName,
        count: newCount,
      });
      updateDailySymptomCount(symptomType, normalizedName, newCount);

      addRecentSymptom(
        normalizedName,
        symptomType === 'Physical Symptom' ? 'physical' : 'psychological',
      );

      if (onSymptomUpdate) {
        await onSymptomUpdate();
      }
    } catch (error) {
      console.error('Error logging symptom:', error);
    }
  };

  const handleLongPress = async () => {
    setIsLongPressing(true);

    try {
      const newCount = displayedCount === 0 ? 0 : displayedCount - 1;
      await deleteLastUpdatedSypmtomRecord(
        normalizedName,
        symptomType,
        displayedCount,
      );
      updateDailySymptomCount(symptomType, normalizedName, newCount);

      if (onSymptomUpdate) {
        await onSymptomUpdate();
      }
    } catch (error) {
      console.error(error);
    }

    setTimeout(() => {
      setIsLongPressing(false);
    }, 100);
  };

  return (
    <RectButton
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={[
        styles.container,
        {backgroundColor: bgColor, borderColor: bgColor},
      ]}>
      <Text style={[styles.nameText, {color: textColor}]}>{displayName}</Text>
      {displayedCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{displayedCount}</Text>
        </View>
      )}
    </RectButton>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILIES.LatoRegular,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -8,
    backgroundColor: '#ff607bff',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SymptomsBoxs;
