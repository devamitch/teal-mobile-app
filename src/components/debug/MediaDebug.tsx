import {useEffect} from 'react';
import {View, Text, Button, ScrollView} from 'react-native';
import {useMedia} from '@/hooks/use-media';

const MediaDebug = () => {
  const mediaData = useMedia();

  const refreshMedia = () => {
    console.log('=== Manual Media Refresh Triggered ===');
    mediaData.refreshMedia();
  };

  useEffect(() => {
    console.log('=== MediaDebug Component Mounted ===');
    console.log('Media state:', {
      loading: mediaData.loading,
      hasData: mediaData.hasData,
      groupCount: mediaData.groups.length,
      ungroupedCount: mediaData.ungrouped.length,
      error: mediaData.error,
    });
  }, [mediaData]);

  return (
    <ScrollView style={{padding: 20}}>
      <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
        Media Debug Panel
      </Text>

      <Text>Loading: {mediaData.loading ? 'Yes' : 'No'}</Text>
      <Text>Has Data: {mediaData.hasData ? 'Yes' : 'No'}</Text>
      <Text>Groups: {mediaData.groups.length}</Text>
      <Text>Ungrouped Items: {mediaData.ungrouped.length}</Text>
      <Text>Error: {mediaData.error || 'None'}</Text>
      <Text>
        Last Updated:{' '}
        {mediaData.lastUpdated
          ? new Date(mediaData.lastUpdated).toLocaleString()
          : 'Never'}
      </Text>

      <Button title="Refresh Media" onPress={refreshMedia} />

      {mediaData.groups.map((group, index) => (
        <View
          key={index}
          style={{marginTop: 10, padding: 10, backgroundColor: '#f0f0f0'}}>
          <Text style={{fontWeight: 'bold'}}>Group: {group.title}</Text>
          {group.items.map((item, itemIndex) => (
            <Text key={itemIndex} style={{marginLeft: 10}}>
              • {item.title} ({item.type})
            </Text>
          ))}
        </View>
      ))}

      {mediaData.ungrouped.length > 0 && (
        <View style={{marginTop: 10, padding: 10, backgroundColor: '#e0e0e0'}}>
          <Text style={{fontWeight: 'bold'}}>Ungrouped Items:</Text>
          {mediaData.ungrouped.map((item, index) => (
            <Text key={index} style={{marginLeft: 10}}>
              • {item.title} ({item.type})
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default MediaDebug;
