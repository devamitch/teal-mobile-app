import Colors, {lightTheme} from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {StyleSheet, Platform, Dimensions} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 12,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
  horizontalScroll: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 10,
    gap: 16,
    alignItems: 'center',
  },
  contentCard: {
    width: screenWidth * 0.75,
    height: 140, // Fixed height for consistency
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    margin: 0,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2, // Increased for better visibility
        // Don't set overflow: 'hidden' here
      },
      android: {
        elevation: 2,
        overflow: 'visible',
        borderWidth: 0.1,
        borderColor: 'rgba(0,0,0,0.05)',
      },
    }),
    borderColor: Colors.lightGrey,
  },
  stressContentCard: {
    width: screenWidth * 0.75, // Same width as contentCard
    height: 140, // Same height as contentCard
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    margin: 0,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        // Don't set overflow: 'hidden' here
      },
      android: {
        elevation: 2,
        overflow: 'visible',
        borderWidth: 0.1,
        borderColor: 'rgba(0,0,0,0.05)',
      },
    }),
    alignSelf: 'center',
  },
  stressCardContainer: {
    flexDirection: 'column',
    borderRadius: 16,
    overflow: 'hidden',
  },
  stressCardImageContainer: {
    overflow: 'hidden', // Add this new style
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  stressCardImage: {
    width: '100%',
    height: 140, // Match the card height
  },
  stressCardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    height: 140, // Ensure content area matches card height
    overflow: 'hidden', // Prevent content overflow
  },
  stressCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    // Remove overflow: 'hidden' from here
  },
  cardImageContainer: {
    overflow: 'hidden', // Add this new style
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardImage: {
    width: 120,
    height: 140, // Match the card height
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    height: 140, // Ensure content area matches card height
    overflow: 'hidden', // Prevent content overflow
  },
  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F7F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  tagText: {
    color: '#00A69C',
    fontSize: 10,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 5,
    lineHeight: 20, // Add line height for consistency
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  cardDuration: {
    fontSize: 12,
    color: '#666666',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 8,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00A69C',
    borderRadius: 2,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A69C',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  playText: {
    color: Colors.white,
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  interactiveCourseButton: {
    marginHorizontal: 16,
    backgroundColor: '#00A69C',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactiveCourseButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
  },
});

export default Styles;
