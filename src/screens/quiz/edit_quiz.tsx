import {IMAGES, lightTheme} from '@/constants';
import {View, StyleSheet, Text, Dimensions, Image} from 'react-native';
import FONT_FAMILIES from '@/constants/fonts';
import {ProgressBar} from '@/components';
import {RectButton} from 'react-native-gesture-handler';

const {width} = Dimensions.get('screen');

const EditQuizScreen = ({navigation}: any) => {
  const list = [
    {
      title: 'Personal',
      icon: IMAGES.personal_info,
      start_progress: 1,
      end_progress: 4,
    },
    {
      title: 'Menopause',
      icon: IMAGES.menopause,
      start_progress: 5,
      end_progress: 7,
    },
    {
      title: 'Symptoms',
      icon: IMAGES.quiz_symptom,
      start_progress: 8,
      end_progress: 10,
    },
    {
      title: 'Self Harm',
      icon: IMAGES.self_harm,
      start_progress: 11,
      end_progress: 14,
    },
    {
      title: 'Medication',
      icon: IMAGES.medication,
      start_progress: 15,
      end_progress: 16,
    },
    {
      title: 'Personalization',
      icon: IMAGES.personalization,
      start_progress: 17,
      end_progress: 20,
    },
  ];

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: FONT_FAMILIES.YoungSerifRegular,
          fontSize: 24,
          alignSelf: 'center',
        }}>
        Edit Responses
      </Text>
      <ProgressBar
        style={{alignSelf: 'center', width: '95%', marginTop: 25}}
        progress={1}
        color={lightTheme.primary}
      />
      <View
        style={{justifyContent: 'center', alignItems: 'center', height: '80%'}}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}>
          {list.map(({title, start_progress, end_progress, icon}, index) => (
            <RectButton
              key={index}
              style={{
                width: '30%',
                height: width * 0.3,
                borderWidth: 1,
                borderColor: lightTheme.primary,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
              }}
              onPress={() =>
                navigation.navigate('Quiz', {
                  start_progress,
                  end_progress,
                })
              }>
              <Image
                style={{
                  width: width * 0.15,
                  height: width * 0.15,
                  marginBottom: 10,
                }}
                source={icon}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: lightTheme.primary,
                  fontFamily: FONT_FAMILIES.MerriweatherBold,
                }}>
                {title}
              </Text>
            </RectButton>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressText: {
    color: lightTheme.textLight,
    fontSize: 16,
    fontFamily: FONT_FAMILIES.LatoRegular,
    marginLeft: 15,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditQuizScreen;
