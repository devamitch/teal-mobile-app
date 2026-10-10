import Colors from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {Platform, StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    gap: 10,
  },
  title: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 18,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  //Mood Container Component
  moodesContainers: {
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal: 15,
    backgroundColor: Colors.white,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  moodesImg: {height: '70%', width: '70%'},
  moodesTitle: {
    color: Colors.black,
    fontSize: 14,
  },
  badge: {
    position: 'absolute',
    right: 10,
    top: 0,
    backgroundColor: '#FF0000',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  carouselItemContainer: {
    width: '100%',
  },
  contentContainer: {
    borderRadius: 20,
    backgroundColor: '#e3f1ea',
    marginHorizontal: 10,
    height: 214,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  listContentContainer: {
    padding: 15,
    height: 214,
    borderRadius: 20,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  continueCardContainer: {
    marginTop: -20,
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  continueCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.lightGreen,
    padding: 10,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  videoPlayerArea: {
    height: 214,
    position: 'relative',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  videoPlaceholderText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  timeText: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGreen,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  itemHeader: {
    alignSelf: 'center',
    color: Colors.lightGreen,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contactName: {
    color: Colors.black,
    fontWeight: 'bold',
  },
  contactNumber: {
    color: Colors.black,
    textDecorationLine: 'underline',
  },
});

export default Styles;
