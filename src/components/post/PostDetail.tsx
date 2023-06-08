import { Fragment, useState } from "react";
import { useMarkdown, useMarkdownHookOptions } from "react-native-marked";
import { useTheme } from "../../theme";
import { Pressable } from "react-native";
import { markdownStyles } from "./styles";

export interface PostDetailProps {
  post: {
    id: number;
    name: string;
    body: string;
  };
}

export const PostDetail = ({ post: { id, name, body } }: PostDetailProps) => {
  const theme = useTheme();
  const themedStyle = markdownStyles(theme);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const titleOptions: useMarkdownHookOptions = {
    styles: {
      ...themedStyle,
      text: themedStyle.h1,
    },
  };

  const bodyOptions: useMarkdownHookOptions = {
    styles: {
      ...themedStyle,
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
