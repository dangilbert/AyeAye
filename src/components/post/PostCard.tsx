import { PostView } from "lemmy-js-client";
import { Theme, useTheme } from "@rn-app/theme";
import { markdownStyles } from "./styles";
import { useMarkdown, useMarkdownHookOptions } from "react-native-marked";
import { Fragment } from "react";
import { Pressable, StyleSheet, View, Image, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText, CreatorLine } from "@rn-app/components";
import { getPostType } from "@rn-app/utils/postUtils";

export interface PostCardProps {
  post: PostView;
}

// TODO pass the Id and fetch this from reeact query
export const PostCard = ({ post }: PostCardProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const themedMarkdownStyle = markdownStyles(theme);
  const themedStyle = styles(theme);

  const titleOptions: useMarkdownHookOptions = {
    styles: {
      ...themedMarkdownStyle,
      text: themedMarkdownStyle.h1,
    },
  };

  const postTitle = useMarkdown(post.post.name, titleOptions);

  const postType = getPostType(post.post);

  return (
    <Pressable
      key={`post_${post.post.id}`}
      style={themedStyle.container}
      onPress={() =>
        navigation.navigate("Post", {
          postId: post.post.id,
        })
      }
    >
      {postType === "Image" && (
        <Pressable
          onPress={() => {
            navigation.navigate("MediaModal", { imageUri: post.post.url });
          }}
        >
          <Image
            style={themedStyle.image}
            source={{ uri: post.post.thumbnail_url }}
          />
        </Pressable>
      )}
      {postType === "Video" && (
        <Pressable
          onPress={() => {
            navigation.navigate("MediaModal", {
              imageUri: post.post.embed_video_url,
            });
          }}
        >
          <Image
            style={themedStyle.image}
            source={{ uri: post.post.thumbnail_url }}
          />
        </Pressable>
      )}
      {(postType === "Link" || postType === "SimpleLink") && (
        <View style={themedStyle.iconContainer}>
          <MaterialIcons
            name={"link"}
            size={themedStyle.icon.size}
            color={themedStyle.icon.color}
          />
        </View>
      )}
      {postType === "Text" && (
        <View style={themedStyle.iconContainer}>
          <MaterialIcons
            name={"text-snippet"}
            size={themedStyle.icon.size}
            color={themedStyle.icon.color}
          />
        </View>
      )}
      <View style={themedStyle.rightContent}>
        <CreatorLine
          creator={post.creator}
          community={post.community.name}
          actorId={post.creator.actor_id}
          communityActorId={post.community.actor_id}
          published={new Date(post.post.published)}
        />
        <View style={themedStyle.title}>
          {postTitle &&
            postTitle.map((element, index) => {
              return <Fragment key={`title_${index}`}>{element}</Fragment>;
            })}
        </View>
        <View style={themedStyle.footer}>
          <View style={themedStyle.footerAction}>
            <MaterialIcons
              name="comment"
              size={themedStyle.footer.iconSize}
              color={themedStyle.footer.iconColor}
            />
            <ThemedText variant="label">{post.counts.comments}</ThemedText>
          </View>
          <View style={themedStyle.footerAction}>
            <MaterialIcons
              name={Platform.OS === "ios" ? "ios-share" : "share"}
              size={themedStyle.footer.iconSize}
              color={themedStyle.footer.iconColor}
            />
          </View>
          <View style={themedStyle.footerAction}>
            <MaterialIcons
              name="arrow-upward"
              size={themedStyle.footer.iconSize}
              color={themedStyle.footer.iconColor}
            />
            <ThemedText variant="label">{post.counts.score}</ThemedText>
            <MaterialIcons
              name="arrow-downward"
              size={themedStyle.footer.iconSize}
              color={themedStyle.footer.iconColor}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
      borderWidth: 1,
      margin: 5,
      padding: 10,
      borderRadius: 5,
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
      justifyContent: "space-between",
    },
    footerAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    image: {
      width: 60,
      height: 50,
      marginEnd: 10,
      borderRadius: 5,
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
      borderRadius: 5,
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
  });
