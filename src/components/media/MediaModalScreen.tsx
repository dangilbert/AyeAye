import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { Theme, useTheme } from "@rn-app/theme";
import { Dimensions, Linking, StyleSheet, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { ActivityIndicator, Appbar, Button } from "react-native-paper";
import YoutubeIframePlayer from "react-native-youtube-iframe-player";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

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

  return (
    <View style={themedStyle.container}>
      <View style={{ flex: 1 }} />
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
          <YoutubeIframePlayer
            videoUrl={videoUri}
            height={(Dimensions.get("window").width * 9) / 16}
            width="100%"
            durationFontSize={15}
          />
          <Button onPress={() => Linking.openURL(videoUri)}>
            Open in YouTube
          </Button>
        </>
      )}
      {videoUri && !isYoutubeVideo && (
        <WebView
          source={{ uri: convertUrlToEmbed(videoUri) }}
          style={{
            flex: 1,
            height: (Dimensions.get("window").width * 9) / 16,
            width: Dimensions.get("window").width,
          }}
          renderLoading={() => <ActivityIndicator />}
        />
      )}
      <View style={{ flex: 1 }} />
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
