import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { Theme, useTheme } from "@rn-app/theme";
import { StyleSheet, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import Video from "react-native-video";
import YoutubeIframePlayer from "react-native-youtube-iframe-player";

export const MediaModalScreen = gestureHandlerRootHOC(({ route }) => {
  const imageUri = route.params?.imageUri;
  const videoUri = route.params?.videoUri;
  const themedStyle = styles(useTheme());

  const isYoutubeVideo =
    videoUri && youtubeDomains.some((uri) => videoUri.includes(uri));

  console.log("isYoutubeVideo", isYoutubeVideo);

  return (
    <View style={themedStyle.container}>
      {imageUri && (
        <ImageZoom
          uri={imageUri}
          renderLoader={() => (
            <View style={{ flex: 1 }}>
              <ActivityIndicator />
            </View>
          )}
        />
      )}
      {videoUri && isYoutubeVideo && (
        <YoutubeIframePlayer
          videoUrl="https://www.youtube.com/watch?v=f7OPcDX_LyI&t=3s"
          height={210}
          width="100%"
          durationFontSize={15}
        />
      )}
      {videoUri && !isYoutubeVideo && <Video source={{ uri: videoUri }} />}
    </View>
  );
});

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
  });

const youtubeDomains = ["youtube.com", "youtu.be", "youtube-nocookie.com"];
