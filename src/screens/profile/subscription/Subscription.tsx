import {lightTheme} from '@/constants/colors';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../../navigations/MainNavigation';
import TabAwareScreen from '../../tabs/tab-aware-screen';
import BackButton from '@/components/ui/buttons/back-button';

interface FeatureItemProps {
  text: string;
}

interface PricingOptionProps {
  price: string;
  period: string;
  billingInfo: string;
  isSelected: boolean;
  onSelect: () => void;
  badge?: string;
}

type SubscriptionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Subscription'
>;

const FeatureItem: React.FC<FeatureItemProps> = ({text}) => (
  <View style={styles.featureItem}>
    <View style={styles.checkmarkBorder}>
      <LinearGradient
        colors={['#6BEE76', '#2DA838']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.checkmarkContainer}>
        <Ionicons name="checkmark" size={16} color="#fff" />
      </LinearGradient>
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const PricingOption: React.FC<PricingOptionProps> = ({
  price,
  period,
  billingInfo,
  isSelected,
  onSelect,
  badge,
}) => (
  <TouchableOpacity
    style={[styles.pricingOption, isSelected && styles.pricingOptionSelected]}
    onPress={onSelect}>
    <View style={styles.pricingContent}>
      <View style={styles.radioButton}>
        {isSelected && <View style={styles.radioButtonInner} />}
      </View>
      <View style={styles.pricingInfo}>
        <Text style={styles.priceText}>
          {price} <Text style={styles.periodText}>/ {period}</Text>
        </Text>
        <Text style={styles.billingText}>{billingInfo}</Text>
      </View>
      {badge && (
        <View style={styles.badgeContainer}>
          <LinearGradient
            colors={['#055558', '#049299', '#2DBABC']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </LinearGradient>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const SubscriptionScreen: React.FC = () => {
  const navigation = useNavigation<SubscriptionScreenNavigationProp>();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>(
    'annual',
  );

  const features = [
    'Deep AI Insights and Summary',
    'Longer term trends and insights',
    'Access to Thriving with PMDs program',
    'Exclusive access to Bring UR Teal podcast',
    'Early access to all future updates',
    "Support IAPMD Canada's Mission",
    'Higher daily chat limits',
  ];

  return (
    <TabAwareScreen activeTab="Profile">
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2DD4BF" />

        <View style={{flex: 1}}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.overlayImage}
              resizeMode="cover"
            />
            <BackButton
              iconColor="white"
              borderColor="white"
              style={{marginBottom: 10}}
            />
            <Text style={styles.headerTitle}>Get the{'\n'}Full experience</Text>
          </View>

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <FeatureItem key={index} text={feature} />
            ))}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.content}
            contentContainerStyle={styles.contentContainer}>
            {/* Pricing Options */}
            <View style={styles.pricingContainer}>
              <View style={{alignItems: 'center', marginBottom: 16}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    color: '#111827',
                    fontWeight: '600',
                  }}>
                  Deep AI insights all across the app
                </Text>
              </View>
              <PricingOption
                price="$9.99"
                period="Monthly"
                billingInfo="Billed monthly"
                isSelected={selectedPlan === 'monthly'}
                onSelect={() => setSelectedPlan('monthly')}
              />

              <PricingOption
                price="$99.99"
                period="Annual"
                billingInfo="Billed annually"
                isSelected={selectedPlan === 'annual'}
                onSelect={() => setSelectedPlan('annual')}
                badge="Save 33%"
              />
            </View>

            {/* Start Trial Button */}
            <TouchableOpacity style={styles.trialButton}>
              <Text style={styles.trialButtonText}>Start With Free Trial</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </TabAwareScreen>
  );
};

const {width: screenWidth} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.gradientMiddle,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.select({
      ios: 20,
      android: 60,
    }),
    paddingBottom: 40,
    position: 'relative',
  },
  overlayImage: {
    position: 'absolute',
    top: '-210%',
    right: '-105%',
    bottom: 0,
    width: 750,
    height: 750,
    opacity: 0.3,
  },
  backButton: {
    marginBottom: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 38,
    fontFamily: 'YoungSerif-Regular',
  },
  content: {
    flex: 1,
    marginTop: Platform.select({
      ios: -60,
      android: -20,
    }),
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  featuresContainer: {
    marginBottom: 40,
    paddingLeft: 20,
    bottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmarkBorder: {
    width: 21,
    height: 21,
    borderRadius: 10.5,
    borderWidth: 0.5,
    borderColor: '#96FD9F',
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderStyle: 'solid',
  },
  checkmarkContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: 'white',
    flex: 1,
    lineHeight: 22,
    fontFamily: 'Lato-Regular',
  },
  pricingContainer: {
    marginBottom: 20,
  },
  pricingOption: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '4%',
    marginBottom: '3%',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  pricingOptionSelected: {
    borderWidth: 2,
    borderColor: '#049299',
  },
  pricingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2DD4BF',
  },
  pricingInfo: {
    flex: 1,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  periodText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#6B7280',
  },
  billingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  badgeContainer: {
    position: 'absolute',
    top: Platform.select({
      ios: -20,
      android: screenWidth * -0.035,
    }),

    right: Platform.select({
      ios: -24,
      android: screenWidth * -0.04,
    }),
  },
  badge: {
    height: Platform.select({
      ios: screenWidth * 0.09,
      android: screenWidth * 0.07,
    }),
    width: Platform.select({
      ios: screenWidth * 0.26,
      android: screenWidth * 0.22,
    }),
    paddingVertical: Platform.select({
      ios: screenWidth * 0.01,
      android: screenWidth * 0.01,
    }),
    paddingHorizontal: screenWidth * 0.02,
    borderTopRightRadius: screenWidth * 0.025,
    borderBottomLeftRadius: screenWidth * 0.035,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    left: Platform.select({
      ios: -5,
      android: 0,
    }),
    top: Platform.select({
      ios: -5,
      android: 0,
    }),
    fontSize: Platform.select({
      ios: screenWidth * 0.03,
      android: screenWidth * 0.03,
    }),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  trialButton: {
    backgroundColor: lightTheme.gradientMiddle,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  trialButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SubscriptionScreen;
