import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  imageContainer: {
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  textContainer: {
    flex: 0.35,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1A1A1A',
    lineHeight: 36,
  },
  brandName: {
    color: '#2DD4BF',
    fontSize: 32,
    fontWeight: '800',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 24,
    fontWeight: '400',
  },
  bottomContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  circularButtonContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2DD4BF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2DD4BF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  progressArcs: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default styles;
