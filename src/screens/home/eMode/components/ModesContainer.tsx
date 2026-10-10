import Colors, {lightTheme} from '@/constants/colors';
import useAppStore from '@/core/stores';
import {
  deleteLastUpdatedSypmtomRecord,
  insertSymptomTrackerRecord,
} from '@/services/sqlite/feminine-health';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ModesContainerProps {
  img?: any;
  title?: string;
  isCounter?: boolean;
  count: number;
}

const ModesContainer = ({img, title, count}: ModesContainerProps) => {
  const {updateDailySymptomCount} = useAppStore(state => state.recent_symptom);

  const handlePress = async () => {
    try {
      const newCount = count + 1;
      await insertSymptomTrackerRecord({
        count: count + 1,
        symptom_type: 'Critical Symptom',
        symptom: title ?? '',
      });
      updateDailySymptomCount('Critical Symptom', title ?? '', newCount);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLongPress = async () => {
    try {
      const newCount = count === 0 ? 0 : count - 1;
      await deleteLastUpdatedSypmtomRecord(
        title ?? '',
        'Critical Symptom',
        count,
      );
      updateDailySymptomCount('Critical Symptom', title ?? '', newCount);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onLongPress={handleLongPress}
        onPress={handlePress}>
        <Image
          source={img}
          style={styles.image}
          tintColor={lightTheme.gradientMiddle}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    minWidth: '30%',
    padding: 10,
    position: 'relative',
  },
  button: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    height: '70%',
    width: '70%',
  },
  title: {
    color: Colors.black,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    right: Platform.OS === 'android' ? 15 : 22,
    top: -5,
    backgroundColor: '#ff607bff',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ModesContainer;
