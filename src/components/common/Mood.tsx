import {TouchableOpacity, View, Image} from 'react-native';
import Emoji1 from '../../assets/images/emoji/e1.svg';
import Emoji3 from '../../assets/images/emoji/e3.svg';
import Emoji4 from '../../assets/images/emoji/e4.svg';
import Emoji5 from '../../assets/images/emoji/e5.svg';
import Emoji6 from '../../assets/images/emoji/e6.svg';
import {emojiFilledType} from '../../constants/images';
import {Text} from 'react-native';
import Colors from '@/constants/colors';
import {useState} from 'react';
import {
  fetchSymptomRecordCounts,
  insertSymptomTrackerRecord,
} from '@/services/sqlite/feminine-health';

const MoodList = [
  {id: '1', type: 'svg', Component: Emoji1, MoodName: 'Cranky'},
  {
    id: '2',
    type: 'image',
    source: emojiFilledType.emoji_e2,
    MoodName: 'Stressed',
  },
  {id: '3', type: 'svg', Component: Emoji3, MoodName: 'Down'},
  {id: '4', type: 'svg', Component: Emoji4, MoodName: 'Wiped'},
  {id: '5', type: 'svg', Component: Emoji5, MoodName: 'Serene'},
  {id: '6', type: 'svg', Component: Emoji6, MoodName: 'Joyful'},
];

const renderEmoji = (id: string) => {
  const emojiMap: Record<string, React.ComponentType<any>> = {
    '1': Emoji1,
    '3': Emoji3,
    '4': Emoji4,
    '5': Emoji5,
    '6': Emoji6,
  };
  const Component = emojiMap[id];
  return Component ? <Component width={48} height={48} /> : null;
};

const Moods = () => {
  const [currentMood, setCurrentMood] = useState('');
  return (
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
              opacity: currentMood !== '' && currentMood !== item.id ? 0.2 : 1,
            }}
            onPress={async () => {
              setCurrentMood(item.id);
              await insertSymptomTrackerRecord({
                symptom_type: 'Mood',
                symptom: `${item.id}`,
                count: 0,
              });
            }}>
            <View
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {item.type === 'svg' ? (
                renderEmoji(item.id)
              ) : (
                <Image
                  source={item.source}
                  style={{width: 48, height: 48}}
                  resizeMode="contain"
                />
              )}
            </View>
            {/* <Text
              style={{
                fontSize: 12,
                color: Colors.black,
                textAlign: 'center',
                marginTop: 5,
                fontWeight: 'normal',
                fontFamily: 'Lato-Regular',
              }}>
              {item.MoodName}
            </Text> */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Moods;
