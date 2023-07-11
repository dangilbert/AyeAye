import { BlurView } from "@react-native-community/blur";
import { PostType, getPostType } from "@rn-app/utils/postUtils";
import { View, StyleSheet, Pressable } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { PostView } from "lemmy-js-client";
import ImageModal from "@dreamwalk-os/react-native-image-modal";
import { Theme, useTheme } from "@rn-app/theme";
import { useBooleanSetting } from "@rn-app/hooks/useSetting";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { Thumbnail } from "react-native-thumbnail-video";
import { isYoutubeUrl } from "@rn-app/utils/urlUtils";
import { handleDownload } from "@rn-app/utils/mediaUtils";
import { useState } from "react";
import Snackbar from "react-native-snackbar";

interface PostIconProps {
  post: PostView;
}

export const PostIcon = ({ post }: PostIconProps) => {
  const themedStyle = styles(useTheme());
  const navigation = useNavigation();
  const [isDownloading, setIsDownloading] = useState(false);

  const postType: PostType = getPostType(post.post);
  const { value: blurNSFW } = useBooleanSetting("blur_nsfw");

  const imageUri = post.post.thumbnail_url ?? post.post.url;
  return (
    <>
      {postType === "Image" && (
        <View style={themedStyle.imageContainer}>
          <ImageModal
            resizeMode="cover"
            modalImageResizeMode="contain"
            style={[themedStyle.imageBox, themedStyle.image]}
            source={{ uri: imageUri }}
            onClose={() => Snackbar.dismiss()}
            renderFooter={() => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <MaterialIcons
                  name={"file-download"}
                  style={[themedStyle.icon, { padding: 20 }]}
                  onPress={() =>
                    (async () => {
                      setIsDownloading(true);
                      await handleDownload({
                        uri: imageUri!!,
                        mimeType: "image/jpeg",
                      });
                      setIsDownloading(false);
                    })()
                  }
                  disabled={isDownloading}
                />
              </View>
            )}
          />
          {post.post.nsfw && blurNSFW && (
            <BlurView
              blurType="light"
              style={[themedStyle.imageBox, themedStyle.imageBlur]}
              blurAmount={5}
              pointerEvents="none"
            >
              <MaterialIcons
                name={"warning"}
                style={[themedStyle.icon, themedStyle.warningIcon]}
              />
            </BlurView>
          )}
        </View>
      )}
      {postType === "Video" && (
        <Pressable
          style={themedStyle.imageContainer}
          onPress={() => {
            navigation.navigate("MediaModal", {
              videoUri: post.post.embed_video_url ?? post.post.url,
            });
          }}
        >
          {post.post.thumbnail_url ? (
            <FastImage
              style={[themedStyle.imageBox, themedStyle.image]}
              source={{ uri: post.post.thumbnail_url }}
            />
          ) : isYoutubeUrl(post.post.url) ? (
            <Thumbnail
              url={post.post.url}
              onPress={() =>
                navigation.navigate("MediaModal", {
                  videoUri: post.post.embed_video_url,
                })
              }
              imageStyle={{ resizeMode: "cover" }}
              iconStyle={{ width: 10, height: 10, alignSelf: "center" }}
              style={{
                width: 60,
                height: 60,
                alignContent: "center",
                justifyContent: "center",
              }}
            />
          ) : (
            <View style={themedStyle.iconContainer}>
              <MaterialIcons
                name={"play-circle-outline"}
                style={themedStyle.icon}
              />
            </View>
          )}
          {post.post.nsfw && blurNSFW && (
            <BlurView
              blurType="light"
              style={[themedStyle.imageBox, themedStyle.imageBlur]}
              blurAmount={5}
            >
              <MaterialIcons
                name={"warning"}
                style={[themedStyle.icon, themedStyle.warningIcon]}
              />
            </BlurView>
          )}
        </Pressable>
      )}
      {(postType === "Link" || postType === "SimpleLink") &&
        post.post.thumbnail_url && (
          <FastImage
            style={themedStyle.imageContainer}
            source={{ uri: post.post.thumbnail_url }}
          />
        )}
      {(postType === "Link" || postType === "SimpleLink") &&
        !post.post.thumbnail_url && (
          <View style={themedStyle.iconContainer}>
            <Entypo name={"link"} style={themedStyle.icon} />
          </View>
        )}
      {postType === "Text" && (
        <View style={themedStyle.iconContainer}>
          <Entypo name={"text"} style={themedStyle.icon} />
        </View>
      )}
    </>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.secondaryBackground,
      padding: 10,
      flexDirection: "row",
    },
    rightContent: {
      flex: 1,
      flexDirection: "column",
    },
    footer: {
      flexDirection: "row",
      iconColor: theme.colors.icon,
      iconSize: 20,
      marginTop: 10,
      gap: 15,
    },
    footerAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    imageContainer: {
      position: "relative",
      width: 60,
      height: 60,
      marginEnd: 10,
      borderRadius: 5,
    },
    imageBox: {
      position: "absolute",
      top: 0,
      width: 60,
      height: 60,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: 5,
      backgroundColor: theme.colors.image.placeholder.backgroundColor,
    },
    image: {
      zIndex: 1,
    },
    imageBlur: {
      zIndex: 2,
    },
    warningIcon: {
      alignSelf: "center",
    },
    title: {
      flex: 1,
    },
    icon: {
      color: theme.colors.text,
      margin: 10,
      fontSize: 30,
    },
    iconContainer: {
      width: 60,
      height: 60,
      marginEnd: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
  });
