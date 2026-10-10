import MainHeader from '@/components/common/headers/MainHeader';
import {
  countryList,
  SOS_NUMBERS,
  SOSNumber,
} from '@/components/sos-contacts/sos-contacts';
import Colors, {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {IMAGES} from '@/constants/images';
import useAppStore from '@/core/stores';
import {Bookmark} from 'lucide-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {useShallow} from 'zustand/react/shallow';
import ActionContainer from './components/ActionContainer';
import ModesContainer from './components/ModesContainer';
import Styles from './EmodeStyles';
import Video from 'react-native-video';

const screenWidth = Dimensions.get('window').width;

// --- Helper Component for the Video Player ---
const PeerSupportVideo = ({isActive}: {isActive: boolean}) => {
  const playerRef = useRef<any>(null);

  return (
    <View style={[Styles.carouselItemContainer, {width: screenWidth}]}>
      <View style={Styles.contentContainer}>
        <View style={Styles.videoPlayer}>
          <Video
            ref={playerRef}
            source={require('@/assets/videos/video.mp4')}
            onError={e => console.log('Video player error:', e)}
            style={Styles.videoPlayer}
            resizeMode="contain"
            paused={true}
            controls={true}
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
          />
        </View>
      </View>
    </View>
  );
};

// --- NEW: Searchable Country Picker Modal Component ---
const CountryPickerModal = ({
  visible,
  onClose,
  onSelectCountry,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectCountry: (country: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = countryList.filter(country =>
    country.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (country: string) => {
    onSelectCountry(country);
    setSearchQuery(''); // Reset search on select
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select a Country</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCloseButton}>Close</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a country..."
          placeholderTextColor={Colors.darkGrayColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={filteredCountries}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.countryItem}
              onPress={() => handleSelect(item)}>
              <Text style={styles.countryItemText}>{item}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No countries found</Text>
          }
        />
      </SafeAreaView>
    </Modal>
  );
};

const Emode = ({navigation}: any) => {
  // --- State for Modal Visibility ---
  const [isCountryModalVisible, setCountryModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const {getQuizWithID, getSafetyPlanWithID, getStatergiesWithID} = useAppStore(
    state => state.engagement,
  );
  const {dailySymptomsCount} = useAppStore(
    useShallow(state => state.recent_symptom),
  );

  const contact_1 = getQuizWithID(15);
  const contact_2 = getQuizWithID(16);
  const userCountryQA = useAppStore(state =>
    state.engagement.getQuizWithID(26),
  );
  const initialCountry = userCountryQA?.answer ?? countryList[0];
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);

  const isStatergiesFilled = getStatergiesWithID(3);
  const isSafetyPlanFilled = getSafetyPlanWithID(2);

  useEffect(() => {
    if (userCountryQA?.answer && userCountryQA.answer !== selectedCountry) {
      setSelectedCountry(userCountryQA.answer);
    }
  }, [userCountryQA?.answer]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: currentPage * screenWidth,
        animated: true,
      });
    }
  }, [currentPage]);

  const handleActionPress = (actionName: string) => {
    if (actionName === 'Safety Plan') {
      if (isSafetyPlanFilled !== undefined) {
        navigation.navigate('ReviewSafetyPlan');
      } else {
        navigation.navigate('SafetyPlan');
      }
    }
    if (actionName === 'Strategies') {
      if (isStatergiesFilled !== undefined) {
        navigation.navigate('ReviewStrategies');
      } else {
        navigation.navigate('Strategies');
      }
    }
    if (actionName === 'Starred') navigation.navigate('SavedContent');
  };

  const handlePeerSupportButton = () =>
    Alert.alert('Coming Soon', 'Peer Support is coming soon!');
  const handleContactButton = () => setCurrentPage(1);
  const handleSOSButton = () => setCurrentPage(2);

  const handleHeaderBackPress = () => {
    if (currentPage !== 0) {
      setCurrentPage(0);
    } else {
      navigation.goBack();
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentPage(page);
  };

  const eModesAction = [
    {
      id: '1',
      name: 'Peer Support',
      images: IMAGES.peerSupport,
      bgColor: Colors.white,
      handlePress: handlePeerSupportButton,
      isMarked: false,
    },
    {
      id: '2',
      name: 'Contacts',
      images: IMAGES.contact,
      bgColor: Colors.white,
      handlePress: handleContactButton,
      isMarked: false,
    },
    {
      id: '3',
      name: 'SOS',
      images: IMAGES.sos,
      bgColor: Colors.white,
      handlePress: handleSOSButton,
      isMarked: false,
    },
    {
      id: '4',
      name:
        isSafetyPlanFilled !== undefined
          ? `Review \nSafety Plan`
          : `Fill \nSafety Plan`,
      images: IMAGES.safetyplan,
      bgColor: Colors.white,
      handlePress: () => handleActionPress('Safety Plan'),
      isMarked: isSafetyPlanFilled !== undefined,
    },
    {
      id: '5',
      name:
        isStatergiesFilled !== undefined
          ? `Review \nStrategies`
          : `Fill \nStrategies`,
      images: IMAGES.strategies,
      bgColor: Colors.white,
      handlePress: () => handleActionPress('Strategies'),
      isMarked: isStatergiesFilled !== undefined,
    },
    {
      id: '6',
      name: 'Bookmark',
      icon: <Bookmark size={56} color={lightTheme.gradientMiddle} />,
      bgColor: Colors.white,
      handlePress: () => handleActionPress('Starred'),
      isMarked: false,
    },
  ];

  const eModes = [
    {
      id: '1',
      name: 'Self Harm',
      images: IMAGES.selfHarm,
      bgColor: Colors.white,
    },
    {id: '2', name: 'Suicidal', images: IMAGES.suicidal, bgColor: Colors.white},
    {
      id: '3',
      name: 'Depressed',
      images: IMAGES.depression,
      bgColor: Colors.white,
    },
    {id: '4', name: 'Sadness', images: IMAGES.sadness, bgColor: Colors.white},
    {
      id: '5',
      name: 'Mood Swing',
      images: IMAGES.moodSwings,
      bgColor: Colors.white,
    },
    {
      id: '6',
      name: 'Irritable',
      images: IMAGES.irritable,
      bgColor: Colors.white,
    },
    {id: '7', name: 'Insomnia', images: IMAGES.insomnia, bgColor: Colors.white},
    {id: '8', name: 'Cramps', images: IMAGES.cramps, bgColor: Colors.white},
    {id: '9', name: 'Fatigue', images: IMAGES.fatigue, bgColor: Colors.white},
  ];

  const renderContactContainer = () => (
    <View style={[Styles.carouselItemContainer, {width: screenWidth}]}>
      <View style={[Styles.contentContainer, Styles.listContentContainer]}>
        <Text style={Styles.itemHeader}>Contacts</Text>
        {contact_1 && (
          <View style={Styles.contactItem}>
            <Text style={Styles.contactName}>
              {`${contact_1?.answer?.contactName} (${contact_1?.answer?.relationship}) :`}
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`tel:${contact_1?.answer?.phoneNumber}`)
              }>
              <Text style={Styles.contactNumber}>
                {contact_1?.answer?.phoneNumber}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {contact_2 && (
          <View style={Styles.contactItem}>
            <Text style={Styles.contactName}>
              {`${contact_2?.answer?.contactName} (${contact_2?.answer?.relationship}) :`}
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`tel:${contact_2?.answer?.phoneNumber}`)
              }>
              <Text style={Styles.contactNumber}>
                {contact_2?.answer?.phoneNumber}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {!contact_1 && !contact_2 && (
          <View style={[Styles.contactItem, {alignSelf: 'center'}]}>
            <Text style={[Styles.contactName, {textAlign: 'center'}]}>
              {`No contact details available\nPlease complete the onboarding questionarrie`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  // --- REBUILT: SOS Container now uses a button to open the modal ---
  const renderSOSContainer = () => (
    <View style={[Styles.carouselItemContainer, {width: screenWidth}]}>
      <View style={[Styles.contentContainer, Styles.listContentContainer]}>
        <Text style={Styles.itemHeader}>SOS Numbers</Text>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setCountryModalVisible(true)}>
          <Text style={styles.pickerDisplayText} numberOfLines={1}>
            {selectedCountry}
          </Text>
          <Text style={styles.chevronIcon}>▼</Text>
        </TouchableOpacity>
        <ScrollView style={styles.sosNumbersList}>
          {SOS_NUMBERS[selectedCountry]?.map(
            (item: SOSNumber, index: number) => (
              <View key={index.toString()} style={Styles.contactItem}>
                <Text style={Styles.contactName}>{item.name}:</Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`tel:${item.number.replace(/ /g, '')}`)
                  }>
                  <Text style={Styles.contactNumber}>{item.number}</Text>
                </TouchableOpacity>
              </View>
            ),
          )}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={Styles.container}>
      <MainHeader
        onPressEmode={handleHeaderBackPress}
        isEmodeOn={true}
        onNextPress={() => navigation.navigate('Chat')}
      />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={16}>
            <PeerSupportVideo isActive={currentPage === 0} />
            {renderContactContainer()}
            {renderSOSContainer()}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.list}>
            {eModesAction?.map((item, index) => (
              <ActionContainer
                key={index.toString()}
                img={item.images}
                icon={item.icon}
                title={item.name}
                bgColor={item.bgColor}
                handlePress={item.handlePress}
                isMarked={item.isMarked}
              />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={Styles.itemHeader}>Current Symptoms</Text>
          <View style={styles.list}>
            {eModes?.map((item, index) => (
              <ModesContainer
                key={index.toString()}
                img={item.images}
                title={item.name}
                count={
                  dailySymptomsCount?.['Critical Symptom']?.[item.name] ?? 0
                }
              />
            ))}
          </View>
        </View>
        {Platform.OS === 'android' && <View style={{height: 40}} />}
      </ScrollView>

      {/* --- Add the Modal component here --- */}
      <CountryPickerModal
        visible={isCountryModalVisible}
        onClose={() => setCountryModalVisible(false)}
        onSelectCountry={country => {
          setSelectedCountry(country);
          setCountryModalVisible(false);
        }}
      />
    </View>
  );
};

// --- UPDATED: StyleSheet with styles for the new Modal and Picker Button ---
const styles = StyleSheet.create({
  scrollViewContent: {flexGrow: 1},
  carouselContainer: {height: 230, width: '100%'},
  section: {marginTop: 5},
  list: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  // Country Picker Button
  pickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGreen,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  pickerDisplayText: {
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    fontSize: 16,
    color: Colors.black,
    flex: 1,
    marginRight: 8,
  },
  chevronIcon: {fontSize: 12, color: Colors.black, fontWeight: 'bold'},
  sosNumbersList: {flex: 1},

  // Modal Styles
  modalContainer: {flex: 1, backgroundColor: Colors.white},
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  modalCloseButton: {
    fontSize: 16,
    color: Colors.lightGreen,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  searchBar: {
    height: 45,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 8,
    paddingHorizontal: 15,
    margin: 16,
    fontSize: 16,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  countryItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  countryItemText: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.darkGrayColor,
  },
});

export default Emode;
