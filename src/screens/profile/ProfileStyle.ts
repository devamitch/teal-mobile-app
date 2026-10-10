import {Platform, StyleSheet} from 'react-native';
import Colors, {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';

export const profile_styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },

  subscriptionCard: {
    width: '90%',
    height: 90,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: Colors.lightGreen,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
    marginTop: 20,
  },
  subscriptionContent: {
    flexDirection: 'row',
    margin: 15,
    alignItems: 'center',
    flex: 1,
  },
  crownIcon: {
    width: 45,
    height: 40,
    marginRight: 25,
    resizeMode: 'contain',
  },
  subscriptionTextContainer: {
    flex: 1,
  },
  subscriptionTitle: {
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    fontSize: 20,
    color: Colors.white,
    marginBottom: 5,
  },
  subscriptionSubtitle: {
    fontSize: 12,
    color: '#EEEEEE',
  },
  menuCard: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: Platform.OS === 'android' ? 100 : 80,
    height: Platform.OS === 'android' ? 50 : 40,
    resizeMode: 'contain',
    opacity: 1,
    margin: 8,
  },
  divider: {
    backgroundColor: '#888',
    height: 1,
    width: '90%',
    alignSelf: 'center',
  },
  profileIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 60,
  },
});

export default profile_styles;
