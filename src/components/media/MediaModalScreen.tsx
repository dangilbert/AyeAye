import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { Theme, useTheme } from "@rn-app/theme";
import { StyleSheet, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import Video from "react-native-video";
import YoutubeIframePlayer from "react-native-youtube-iframe-player";
import { WebView } from "react-native-webview";
import { ThemedText } from "../ThemedText";

export const MediaModalScreen = gestureHandlerRootHOC(({ route }) => {
  const imageUri = route.params?.imageUri;
  const videoUri = route.params?.videoUri;
  const themedStyle = styles(useTheme());

  const isYoutubeVideo =
    videoUri && youtubeDomains.some((uri) => videoUri.includes(uri));

  const convertUrlToEmbed = (url: string): string => {
    if (url.includes("tilvids.com") && url.includes("/videos/watch/")) {
      return url.replace("/videos/watch/", "/videos/embed/");
    }

    return url;
  };

  console.log("isYoutubeVideo", isYoutubeVideo);
  console.log("videoUri", videoUri);
  console.log("convertedUrl", convertUrlToEmbed(videoUri));

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
          videoUrl={videoUri}
          height={230}
          width="100%"
          durationFontSize={15}
        />
      )}
      {videoUri && !isYoutubeVideo && (
        <>
          <WebView
            source={{ uri: convertUrlToEmbed(videoUri) }}
            style={{
              flex: 1,
            }}
            renderLoading={() => <ActivityIndicator />}
          />
        </>
      )}
    </View>
  );
});

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

const youtubeDomains = ["youtube.com", "youtu.be", "youtube-nocookie.com"];
