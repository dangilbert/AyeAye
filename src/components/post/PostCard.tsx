import { PostView } from "lemmy-js-client";
import { Theme, useTheme } from "../../theme";
import { markdownStyles } from "./styles";
import { useMarkdown, useMarkdownHookOptions } from "react-native-marked";
import { Fragment } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export interface PostCardProps {
  post: PostView;
}

// TODO pass the Id and fetch this from reeact query
export const PostCard = ({ post }) => {
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
    <View key={`post_${post.post.id}`} style={themedStyle.container}>
      {postTitle &&
        postTitle.map((element, index) => {
          return (
            <Pressable
              onPress={() =>
                navigation.navigate("Post", {
                  postId: post.post.id,
                })
              }
            >
              <Fragment key={`title_${index}`}>{element}</Fragment>
            </Pressable>
          );
        })}
    </View>
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
    },
  });
