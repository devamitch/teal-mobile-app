import Colors, {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: '30%',
    backgroundColor: Colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 30,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#000',
    fontWeight: '600',
    flex: 1,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  subtitle: {
    fontSize: 14,
    color: lightTheme.textLight,
    paddingHorizontal: 30,
    marginBottom: 40,
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8ECF4',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
    width: 24,
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    fontSize: 16,

    color: lightTheme.textMild,
  },
  eyeIcon: {
    width: 24,
    alignItems: 'center',
  },
  changePasswordBtn: {
    backgroundColor: lightTheme.gradientMiddle,
    borderRadius: 12,
    paddingVertical: 16,
    fontWeight: '600',
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  changePasswordText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
});

export default styles;
