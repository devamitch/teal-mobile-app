import Colors, {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {StyleSheet} from 'react-native';

const HeaderStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGreen,
    borderEndEndRadius: 55,
    paddingHorizontal: 25,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 1,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 26,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: Colors.black,
    paddingBottom: 15,
  },
  subText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
  iconContainer: {
    height: 65,
    width: 65,
    borderRadius: 35,
    backgroundColor: Colors.darkYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {fontSize: 30, fontWeight: '300', color: Colors.black},
  nextBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
    borderRadius: 30,
    backgroundColor: Colors.darkYellow,
    paddingHorizontal: 20,
    right: 5,
  },
  nextBtnText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.black,
  },
  nextArrow: {height: 20, width: 20},
});

export default HeaderStyles;
