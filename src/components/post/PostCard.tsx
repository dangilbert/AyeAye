import { PostView } from "lemmy-js-client";
import { Theme, useTheme } from "@rn-app/theme";
import { markdownStyles } from "./styles";
import { useMarkdown, useMarkdownHookOptions } from "react-native-marked";
import { Fragment } from "react";
import { Pressable, StyleSheet, View, Image, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText, CreatorLine } from "@rn-app/components";

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
      {post.post.thumbnail_url && (
        <Pressable
          onPress={() =>
            navigation.navigate("MediaModal", {
              imageUri: post.post.url ?? post.post.thumbnail_url,
            })
          }
        >
          <Image
            style={themedStyle.image}
            source={{ uri: post.post.thumbnail_url }}
          />
        </Pressable>
      )}
      {!post.post.thumbnail_url && post.post.url && (
        <LinkPreview
          text={post.post.url}
          renderLinkPreview={(previewData) => {
            return (
              <Image
                style={themedStyle.image}
                source={{ uri: previewData.previewData?.image?.url }}
              />
            );
          }}
        />
      )}
      {!post.post.thumbnail_url && !post.post.url && (
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
              name="keyboard-arrow-up"
              size={themedStyle.footer.iconSize}
              color={themedStyle.footer.iconColor}
            />
            <ThemedText variant="label">{post.counts.upvotes}</ThemedText>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={themedStyle.footer.iconSize}
              color={themedStyle.footer.iconColor}
            />
            <ThemedText variant="label">{post.counts.downvotes}</ThemedText>
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
