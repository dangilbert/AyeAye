import { Fragment } from "react";
import { Theme, useTheme } from "@rn-app/theme";
import { StyleSheet, View, Platform, Pressable, Share } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@rn-app/components";
import { PostView } from "lemmy-js-client";
import { PostPreview } from "./PostPreview";
import { getShareContent } from "@rn-app/utils/postUtils";
import Snackbar from "react-native-snackbar";

export interface PostDetailProps {
  post: PostView;
}

export const PostDetail = ({ post }: PostDetailProps) => {
  const theme = useTheme();
  const themedStyle = styles(theme);

  const onShare = async () => {
    try {
      await Share.share({
        message: getShareContent(post.post),
      });
    } catch (error: any) {
      Snackbar.show({ text: error.message });
    }
  };

  const onPostReply = () => {
    Snackbar.show({
      text: "Not implemented yet",
    });
  };

  return (
    <Fragment key={`post_${post.post.id}`}>
      <PostPreview post={post} />

      <View style={themedStyle.footer}>
        <View style={themedStyle.footerAction}>
          <MaterialIcons
            name="comment"
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
          />
          <ThemedText variant="label">{post.counts.comments}</ThemedText>
        </View>
        <Pressable style={themedStyle.footerAction} onPress={onPostReply}>
          <MaterialIcons
            name={"reply"}
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
          />
        </Pressable>
        <Pressable style={themedStyle.footerAction} onPress={onShare}>
          <MaterialIcons
            name={Platform.OS === "ios" ? "ios-share" : "share"}
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
          />
        </Pressable>
        <View style={themedStyle.footerAction}>
          <MaterialIcons
            name="keyboard-arrow-up"
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
          />
          <ThemedText variant="label">{post.counts.score}</ThemedText>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
          />
        </View>
      </View>
    </Fragment>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
      borderWidth: 1,
      margin: 5,
      padding: 5,
      borderRadius: 5,
      flexDirection: "row",
      alignItems: "center",
    },
    titleLine: {
      flexDirection: "row",
      marginVertical: 5,
    },
    titleAndCreator: {
      flexDirection: "column",
      flex: 1,
    },
    image: {
      flex: 1,
      aspectRatio: 4 / 3,
      borderRadius: 5,
      resizeMode: "contain",
      backgroundColor: theme.colors.secondaryBackground,
    },
    title: {
      flex: 1,
    },
    icon: {
      size: 50,
      color: theme.colors.text,
      margin: 10,
    },
    iconContainer: {
      width: 60,
      height: 50,
      marginEnd: 10,
      marginTop: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    creator: {},
    footer: {
      flexDirection: "row",
      iconColor: theme.colors.icon,
      iconSize: 20,
      justifyContent: "space-between",
      margin: 10,
    },
    footerAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
  });
