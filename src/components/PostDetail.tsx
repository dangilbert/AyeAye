import { Fragment, useState } from "react";
import { useMarkdown, useMarkdownHookOptions } from "react-native-marked";
import { Theme, useTheme } from "../theme";
import { Pressable, StyleSheet } from "react-native";

export interface PostDetailProps {
  post: {
    id: number;
    name: string;
    body: string;
  };
}

export const PostDetail = ({ post: { id, name, body } }: PostDetailProps) => {
  const theme = useTheme();
  const themedStyle = styles(theme);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const titleOptions: useMarkdownHookOptions = {
    styles: {
      text: themedStyle.title,
    },
  };

  const bodyOptions: useMarkdownHookOptions = {
    styles: {
      text: themedStyle.body,
    },
  };

  const postTitle = useMarkdown(name, titleOptions);
  const postBody = useMarkdown(body ?? "", bodyOptions);

  return (
    <Fragment key={`post_${id}`}>
      {postTitle &&
        postTitle.map((element, index) => {
          return (
            <Pressable onPress={() => setCollapsed(!collapsed)}>
              <Fragment key={`title_${index}`}>{element}</Fragment>
            </Pressable>
          );
        })}
      {postBody &&
        !collapsed &&
        postBody.map((element, index) => {
          return (
            <Pressable onPress={() => setCollapsed(true)}>
              <Fragment key={`body_${index}`}>{element}</Fragment>
            </Pressable>
          );
        })}
    </Fragment>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    title: {
      color: theme.colors.text,
      fontSize: theme.sizes.text.heading,
      fontWeight: "bold",
    },
    body: {
      color: theme.colors.text,
      fontSize: theme.sizes.text.body,
    },
  });
