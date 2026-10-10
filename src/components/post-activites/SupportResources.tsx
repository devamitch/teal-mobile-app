import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface SupportResource {
  title: string;
  description: string;
  url: string;
  region: string;
  icon: string;
}

interface SupportResourcesProps {
  activity?: any;
  response?: any;
  onResponseChange: (response: any) => void;
}

const SupportResources: React.FC<SupportResourcesProps> = ({
  onResponseChange,
}) => {
  // Use ref to avoid dependency issues with onResponseChange
  const onResponseChangeRef = useRef(onResponseChange);
  onResponseChangeRef.current = onResponseChange;

  const supportResources: SupportResource[] = [
    {
      title: 'Canadian Mental Health Association',
      description: 'Find CMHA services in your area across Canada',
      url: 'https://cmha.ca/find-help/find-cmha-in-your-area/',
      region: 'Canada',
      icon: 'location-on',
    },
    {
      title: 'Crisis Services Canada',
      description: 'National crisis support services for Canadians',
      url: 'https://www.crisisservicescanada.ca/en/',
      region: 'Canada',
      icon: 'phone',
    },
    {
      title: 'Mental Health America',
      description:
        'Mental health resources and support across the United States',
      url: 'https://mhanational.org/',
      region: 'United States',
      icon: 'psychology',
    },
    {
      title: 'Crisis Resources (US)',
      description: 'Emergency mental health crisis resources for US residents',
      url: 'https://mhanational.org/crisisresources',
      region: 'United States',
      icon: 'emergency',
    },
    {
      title: 'NHS Mental Health Services',
      description:
        'National Health Service mental health support and resources',
      url: 'https://www.nhs.uk/mental-health/',
      region: 'United Kingdom',
      icon: 'medical-services',
    },
    {
      title: 'International Crisis Lines',
      description: 'Directory of crisis and support lines worldwide',
      url: 'https://findahelpline.com/',
      region: 'International',
      icon: 'public',
    },
  ];

  useEffect(() => {
    // Mark as viewed when component loads
    onResponseChangeRef.current({
      viewed: true,
      timestamp: new Date().toISOString(),
      resourcesViewed: supportResources.map(resource => resource.title),
    });
  }, []); // Empty dependency array to run only once

  const handleResourcePress = async (url: string, title: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        // Track which resources were accessed
        onResponseChangeRef.current({
          viewed: true,
          timestamp: new Date().toISOString(),
          resourcesViewed: supportResources.map(resource => resource.title),
          resourcesAccessed: [title],
        });
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'Canada':
        return '#DC2626';
      case 'United States':
        return '#2563EB';
      case 'United Kingdom':
        return '#7C3AED';
      case 'International':
        return '#059669';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialIcons name="support" size={24} color="#2D7D7A" />
        <Text style={styles.headerTitle}>Online Support Resources</Text>
      </View>

      <Text style={styles.description}>
        For those located in Canada, you can also consult the Canadian Mental
        Health Association and/or Crisis Services Canada. If you are in the
        United States, you can consult Mental Health America, including crisis
        resources. For those in the United Kingdom, you may consult the National
        Health Service. For those not in Canada, the United States, or the
        United Kingdom, a directory for multiple national crisis and support
        lines is available.
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {supportResources.map((resource, index) => (
          <TouchableOpacity
            key={index}
            style={styles.resourceCard}
            onPress={() => handleResourcePress(resource.url, resource.title)}>
            <View style={styles.resourceHeader}>
              <View style={styles.resourceIconContainer}>
                <MaterialIcons
                  name={resource.icon as any}
                  size={24}
                  color="#2D7D7A"
                />
              </View>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <View style={styles.regionContainer}>
                  <View
                    style={[
                      styles.regionBadge,
                      {backgroundColor: getRegionColor(resource.region)},
                    ]}>
                    <Text style={styles.regionText}>{resource.region}</Text>
                  </View>
                </View>
              </View>
              <MaterialIcons name="open-in-new" size={20} color="#6B7280" />
            </View>

            <Text style={styles.resourceDescription}>
              {resource.description}
            </Text>

            <View style={styles.urlContainer}>
              <MaterialIcons name="link" size={16} color="#6B7280" />
              <Text style={styles.urlText} numberOfLines={1}>
                {resource.url}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.importantNotice}>
        <MaterialIcons name="priority-high" size={20} color="#EF4444" />
        <View style={styles.noticeContent}>
          <Text style={styles.noticeTitle}>Emergency Notice</Text>
          <Text style={styles.noticeText}>
            If you are in immediate danger or having thoughts of suicide, please
            contact your local emergency services (911, 999, etc.) or go to your
            nearest emergency room immediately.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D7D7A',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resourceIconContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  regionContainer: {
    flexDirection: 'row',
  },
  regionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  regionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
  },
  urlText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  importantNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  noticeContent: {
    flex: 1,
    marginLeft: 8,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 12,
    color: '#DC2626',
    lineHeight: 16,
  },
});

export default SupportResources;
