import Colors from '@/constants/colors';
import FONT_FAMILIES from '@/constants/fonts';
import {useEffect, useRef, useState} from 'react';
import {FlatList, ScrollView, Text, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import YoutubePlayer from 'react-native-youtube-iframe';

const youtubeAPI = 'AIzaSyCfnSkuO7jS1pzN6cSNL1ZPCHh4G9yQ0co';

const VideoPlaylist = (props: any) => {
  const [videos, setVideos] = useState<
    {id: string; title: string; thumbnail: string}[]
  >([]);
  const [currentVideoId, setCurrentVideoId] = useState<any>(null);
  const playerRef = useRef(null);

  const playlistId = props.route.params.plID;
  const channel = props.route.params.channel;

  useEffect(() => {
    fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${playlistId}&key=${youtubeAPI}`,
    )
      .then(res => res.json())
      .then(data => {
        const videoList = data.items.map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
        }));
        setVideos(videoList);
      })
      .catch(error => console.error(error));
  }, []);

  const playListSection = ({item}: {item: any}) => {
    return (
      <View
        style={{
          borderColor: '#00A5AD',
          borderWidth: 1,
          borderRadius: 14,
          padding: 15,
          flexDirection: 'row',
          marginBottom: 20,
        }}>
        <FontAwesome
          name="play-circle"
          size={25}
          color={'#00A5AD'}
          onPress={() => {
            setCurrentVideoId(item.id);
          }}
        />
        <Text style={{color: 'white', fontSize: 16, paddingHorizontal: 15}}>
          {item.title}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={{flex: 1, backgroundColor: Colors.mainBgColor}}>
        {currentVideoId ? (
          <YoutubePlayer
            height={250}
            ref={playerRef}
            videoId={currentVideoId}
            play
          />
        ) : (
          <YoutubePlayer
            ref={playerRef}
            height={250}
            playList={playlistId}
            onChangeState={event => console.log(event)}
          />
        )}
        <View
          style={{
            width: '100%',
            backgroundColor: Colors.mainBgColor,
            padding: 20,
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: FONT_FAMILIES.YoungSerifRegular,
              fontSize: 20,
              paddingVertical: 10,
            }}>
            {channel}
          </Text>
          <View style={{flexDirection: 'row', paddingVertical: 10}}>
            <FontAwesome name="youtube-play" size={35} color={'red'} />
            <Text
              style={{
                fontSize: 12,
                color: 'white',
                paddingHorizontal: 20,
                verticalAlign: 'middle',
              }}>
              {channel}
            </Text>
            <View style={{marginLeft: 'auto', flexDirection: 'row'}}>
              <Feather
                name="share-2"
                size={35}
                color={'white'}
                onPress={() => console.log(videos)}
              />
              <Feather
                name="bookmark"
                size={35}
                color={'white'}
                style={{marginLeft: 20}}
              />
            </View>
          </View>
          <Text
            style={{
              fontFamily: FONT_FAMILIES.YoungSerifRegular,
              color: 'white',
              fontSize: 14,
              paddingBottom: 20,
            }}>
            {'Videos'}
          </Text>
          <FlatList data={videos} renderItem={playListSection} />
        </View>
      </View>
    </ScrollView>
  );
};

export default VideoPlaylist;
