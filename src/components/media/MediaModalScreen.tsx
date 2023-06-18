import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { Theme, useTheme } from "@rn-app/theme";
import { Dimensions, Linking, StyleSheet, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { ActivityIndicator, Appbar, Button } from "react-native-paper";
import YoutubeIframePlayer from "react-native-youtube-iframe-player";
import { WebView } from "react-native-webview";

export const MediaModalScreen = gestureHandlerRootHOC(({ route }) => {
  const imageUri = route.params?.imageUri;
  const videoUri = route.params?.videoUri;
  const themedStyle = styles(useTheme());

  console.log("imageUri", imageUri);

  const isYoutubeVideo =
    videoUri && youtubeDomains.some((uri) => videoUri.includes(uri));

  const convertUrlToEmbed = (url: string): string => {
    if (url.includes("tilvids.com") && url.includes("/videos/watch/")) {
      return url.replace("/videos/watch/", "/videos/embed/");
    }

    return url;
  };

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
        <>
          <View style={{ flex: 1 }} />
          <YoutubeIframePlayer
            videoUrl={videoUri}
            height={(Dimensions.get("window").width * 9) / 16}
            width="100%"
            durationFontSize={15}
          />
          <Button onPress={() => Linking.openURL(videoUri)}>
            Open in YouTube
          </Button>
          <View style={{ flex: 1 }} />
        </>
      )}
      {videoUri && !isYoutubeVideo && (
        <>
          <View style={{ flex: 1 }} />
          <WebView
            source={{ uri: convertUrlToEmbed(videoUri) }}
            style={{
              flex: 1,
              height: (Dimensions.get("window").width * 9) / 16,
              width: Dimensions.get("window").width,
            }}
            renderLoading={() => <ActivityIndicator />}
          />
          <View style={{ flex: 1 }} />
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
    },
  });

const youtubeDomains = ["youtube.com", "youtu.be", "youtube-nocookie.com"];
