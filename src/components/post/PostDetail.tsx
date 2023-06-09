import { Fragment, useState } from "react";
import { useMarkdown, useMarkdownHookOptions } from "react-native-marked";
import { Theme, useTheme } from "@rn-app/theme";
import { Pressable, Image, StyleSheet, View } from "react-native";
import { markdownStyles } from "./styles";
import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@rn-app/components/ThemedText";
import { useNavigation } from "@react-navigation/native";

export interface PostDetailProps {
  post: {
    id: number;
    name: string;
    body?: string;
    url?: string;
    thumbnail_url?: string;
  };
}

export const PostDetail = ({
  post: { id, name, body, url, thumbnail_url },
}: PostDetailProps) => {
  const theme = useTheme();
  const themedMarkdownStyle = markdownStyles(theme);
  const themedStyle = styles(theme);
  const navigator = useNavigation();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const titleOptions: useMarkdownHookOptions = {
    styles: {
      ...themedMarkdownStyle,
      text: themedMarkdownStyle.h1,
    },
  };

  const bodyOptions: useMarkdownHookOptions = {
    styles: {
      ...themedMarkdownStyle,
    },
  };

  const postTitle = useMarkdown(name, titleOptions);
  const postBody = useMarkdown(body ?? "", bodyOptions);

  return (
    <Fragment key={`post_${id}`}>
      {thumbnail_url && url && (
        <Pressable
          onPress={() =>
            navigator.navigate("MediaModal", { imageUri: url ?? thumbnail_url })
          }
        >
          <Image style={themedStyle.image} source={{ uri: url }} />
        </Pressable>
      )}
      {!thumbnail_url && url && (
        <LinkPreview
          text={url}
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
      {!thumbnail_url && !url && (
        <View style={themedStyle.iconContainer}>
          <MaterialIcons
            name={"text-snippet"}
            size={themedStyle.icon.size}
            color={themedStyle.icon.color}
          />
        </View>
      )}
      {postTitle &&
        postTitle.map((element, index) => {
          return (
            <Pressable
              key={`title_${index}`}
              onPress={() => setCollapsed(!collapsed)}
            >
              <Fragment>{element}</Fragment>
            </Pressable>
          );
        })}
      {!thumbnail_url && url && (
        <LinkPreview
          text={url}
          renderLinkPreview={(previewData) => {
            return (
              <ThemedText>{previewData.previewData?.link ?? ""}</ThemedText>
            );
          }}
        />
      )}
      {postBody &&
        !collapsed &&
        postBody.map((element, index) => {
          return (
            <Pressable key={`body_${index}`} onPress={() => setCollapsed(true)}>
              <Fragment>{element}</Fragment>
            </Pressable>
          );
        })}
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
      borderRadius: 5,
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
  });
