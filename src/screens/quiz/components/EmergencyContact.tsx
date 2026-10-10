import {FONT_FAMILIES, lightTheme} from '@/constants';
import {Text, View, StyleSheet} from 'react-native';
import Button from '@/components/ui/buttons/button';

interface EmergencyContactProps {
  onNext: () => void;
}

const EmergencyContact: React.FC<EmergencyContactProps> = ({onNext}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>Emergency Support Contacts</Text>
        <Text style={styles.descriptionText}>
          When we have thoughts of hurting ourselves or ending our life, we may
          feel unsafe with ourselves. In such events, it can help to reach out
          to those who make you feel good or supported.
          {'\n\n'}
          Use this section to store their information here, so you can contact
          them when you are in crisis. Any information you share here is
          confidential and the people listed here will not be contacted without
          your consent.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          text="Continue"
          onPress={onNext}
          backgroundColor={lightTheme.primary}
          textColor="white"
          style={styles.continueButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontWeight: 'bold',
    fontSize: 24,
    color: lightTheme.textDark,
    textAlign: 'center',
    marginBottom: 25,
  },
  descriptionText: {
    fontFamily: FONT_FAMILIES.LatoRegular,
    fontSize: 16,
    color: lightTheme.textMild,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  continueButton: {
    width: '100%',
    height: 55,
  },
});

export default EmergencyContact;
