import Colors, {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: lightTheme.background, // Updated to use lightTheme background
  },
  // New container for header with lightGreen background
  headerContainer: {
    height: 150,
    width: '100%',
    borderBottomRightRadius: 40,
  },
  headerGradient: {
    // Updated with extracted values from MainHeader
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150, // Extracted height from MainHeader
    zIndex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    zIndex: 2, // Ensure content is above gradient
  },
  backButton: {
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: Colors.black,
    textAlign: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '38%',
    backgroundColor: Colors.lightGreen,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: lightTheme.textDark,
    marginBottom: 8,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
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
  inputValue: {
    fontSize: 18,
    color: '#222',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: lightTheme.gradientMiddle,
  },
  eyeIcon: {
    width: 24,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  changePasswordBtn: {
    backgroundColor: '#DDF7F4',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  changePasswordText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  bottomTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: lightTheme.buttonBorder,
    paddingVertical: 10,
    backgroundColor: lightTheme.background,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  tabText: {
    fontSize: 12,
    marginTop: 5,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    color: lightTheme.textLight,
  },
  activeTabText: {
    color: lightTheme.primary,
  },
  profileIconContainer: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
