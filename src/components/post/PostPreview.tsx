import { Community, Person, PostView } from "lemmy-js-client";
import { Fragment, useState } from "react";
import { useMarkdown, useMarkdownHookOptions } from "react-native-marked";
import { Theme, useTheme } from "@rn-app/theme";
import { Pressable, Image, StyleSheet, View } from "react-native";
import { markdownStyles } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText, CreatorLine } from "@rn-app/components";
import { useNavigation } from "@react-navigation/native";
import { isImage } from "@rn-app/utils/urlUtils";
import * as WebBrowser from "expo-web-browser";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getPostType } from "@rn-app/utils/postUtils";

interface PostPreviewProps {
  post: PostView;
}

export const PostPreview = ({
  post: {
    post: {
      thumbnail_url,
      url,
      embed_title,
      embed_description,
      embed_video_url,
      name,
      body,
      published,
    },
    creator,
    community,
  },
  post,
}: PostPreviewProps) => {
  console.log("Post", {
    post: post.post,
  });

  const postType = getPostType(post.post);

  if (postType === "Text") {
    return (
      <TextPost
        name={name}
        body={body}
        creator={creator}
        community={community}
        published={published}
      />
    );
  }

  if (postType === "Image") {
    // This is probably an image post
    return (
      <ImagePost
        name={name}
        body={body}
        creator={creator}
        community={community}
        published={published}
        url={url!!}
      />
    );
  }

  // This is a link post with embed information
  if (postType === "Link" || postType === "SimpleLink") {
    return (
      <LinkPost
        name={name}
        body={body}
        creator={creator}
        community={community}
        published={published}
        url={url!!}
        embed_title={embed_title ?? url!!}
        embed_description={embed_description}
        thumbnail_url={thumbnail_url}
      />
    );
  }

  if (postType === "Video") {
    <VideoPost
      name={name}
      body={body}
      creator={creator}
      community={community}
      published={published}
      url={url!!}
      embed_title={embed_title ?? url!!}
      embed_description={embed_description}
      thumbnail_url={thumbnail_url}
      embed_video_url={embed_video_url}
    />;
  }

  return (
    <>
      <ThemedText>Post type not built</ThemedText>
    </>
  );
};

interface LinkPostProps {
  name: string;
  body?: string;
  creator: Person;
  community: Community;
  published: string;
  url: string;
  embed_title: string;
  embed_description?: string;
  thumbnail_url?: string;
}

const LinkPost = ({
  name,
  body,
  creator,
  community,
  published,
  url,
  embed_title,
  embed_description,
  thumbnail_url,
}: LinkPostProps) => {
  const themedStyle = styles(useTheme());
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const handleOpenBrowserAsync = async () => {
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <>
      <Pressable
        style={themedStyle.linkContainer}
        onPress={() => handleOpenBrowserAsync()}
      >
        {thumbnail_url ? (
          <Image
            style={themedStyle.imageThumb}
            source={{ uri: thumbnail_url }}
          />
        ) : (
          <View style={themedStyle.iconContainer}>
            <MaterialIcons
              name={"link"}
              size={themedStyle.icon.size}
              color={themedStyle.icon.color}
            />
          </View>
        )}
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <ThemedText variant={"label"}>{embed_title}</ThemedText>
          {embed_description && (
            <ThemedText variant={"caption"}>{embed_description}</ThemedText>
          )}
        </View>
      </Pressable>
      <View style={themedStyle.titleLine}>
        <View style={themedStyle.titleAndCreator}>
          <Pressable onPress={() => setCollapsed(!collapsed)}>
            <PostTitle text={name} />
          </Pressable>
          <CreatorLine
            creator={creator}
            actorId={creator.actor_id}
            community={community.name}
            communityActorId={community.actor_id}
            published={new Date(published)}
          />
        </View>
      </View>
      {!collapsed && (
        <Pressable onPress={() => setCollapsed(!collapsed)}>
          <PostBody text={body} />
        </Pressable>
      )}
    </>
  );
};

interface ImagePostProps {
  name: string;
  body?: string;
  creator: Person;
  community: Community;
  published: string;
  url: string;
}

const ImagePost = ({
  name,
  body,
  creator,
  community,
  published,
  url,
}: ImagePostProps) => {
  const themedStyle = styles(useTheme());
  const navigator = useNavigation();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <>
      <Pressable
        onPress={() => navigator.navigate("MediaModal", { imageUri: url })}
      >
        <Image style={themedStyle.image} source={{ uri: url }} />
      </Pressable>
      <View style={themedStyle.titleLine}>
        <View style={themedStyle.titleAndCreator}>
          <Pressable onPress={() => setCollapsed(!collapsed)}>
            <PostTitle text={name} />
          </Pressable>
          <CreatorLine
            creator={creator}
            actorId={creator.actor_id}
            community={community.name}
            communityActorId={community.actor_id}
            published={new Date(published)}
          />
        </View>
      </View>
      {!collapsed && (
        <Pressable onPress={() => setCollapsed(!collapsed)}>
          <PostBody text={body} />
        </Pressable>
      )}
    </>
  );
};

interface VideoPostProps {
  name: string;
  body?: string;
  creator: Person;
  community: Community;
  published: string;
  url: string;
  embed_title: string;
  embed_description?: string;
  thumbnail_url?: string;
  embed_video_url: string;
}

const VideoPost = ({
  name,
  body,
  creator,
  community,
  published,
  url,
  embed_title,
  embed_description,
  thumbnail_url,
  embed_video_url,
}: VideoPostProps) => {
  const themedStyle = styles(useTheme());
  const navigator = useNavigation();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <>
      <Pressable
        onPress={() =>
          navigator.navigate("MediaModal", { embed_video_url, thumbnail_url })
        }
      >
        {thumbnail_url ? (
          <Image
            style={themedStyle.imageThumb}
            source={{ uri: thumbnail_url }}
          />
        ) : (
          <View style={themedStyle.iconContainer}>
            <MaterialIcons
              name={"link"}
              size={themedStyle.icon.size}
              color={themedStyle.icon.color}
            />
          </View>
        )}

        <ThemedText variant={"label"}>{embed_title}</ThemedText>
        {embed_description && (
          <ThemedText variant={"caption"}>{embed_description}</ThemedText>
        )}
      </Pressable>
      <View style={themedStyle.titleLine}>
        <View style={themedStyle.titleAndCreator}>
          <Pressable onPress={() => setCollapsed(!collapsed)}>
            <PostTitle text={name} />
          </Pressable>
          <CreatorLine
            creator={creator}
            actorId={creator.actor_id}
            community={community.name}
            communityActorId={community.actor_id}
            published={new Date(published)}
          />
        </View>
      </View>
      {!collapsed && (
        <Pressable onPress={() => setCollapsed(!collapsed)}>
          <PostBody text={body} />
        </Pressable>
      )}
    </>
  );
};

interface TextPostProps {
  name: string;
  body?: string;
  creator: Person;
  community: Community;
  published: string;
}

const TextPost = ({
  name,
  body,
  creator,
  community,
  published,
}: TextPostProps) => {
  const themedStyle = styles(useTheme());

  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <>
      <View style={themedStyle.titleLine}>
        <View style={themedStyle.iconContainer}>
          <MaterialIcons
            name={"text-snippet"}
            size={themedStyle.icon.size}
            color={themedStyle.icon.color}
          />
        </View>
        <View style={themedStyle.titleAndCreator}>
          <Pressable onPress={() => setCollapsed(!collapsed)}>
            <PostTitle text={name} />
          </Pressable>
          <CreatorLine
            creator={creator}
            actorId={creator.actor_id}
            community={community.name}
            communityActorId={community.actor_id}
            published={new Date(published)}
          />
        </View>
      </View>
      {!collapsed && (
        <Pressable onPress={() => setCollapsed(!collapsed)}>
          <PostBody text={body} />
        </Pressable>
      )}
    </>
  );
};

interface PostTextProps {
  text?: string;
}
interface MarkdownTextProps {
  type: "title" | "body";
  text?: string;
  options?: useMarkdownHookOptions;
}
const MarkdownText = ({ text, type, options }: MarkdownTextProps) => {
  const postBody = useMarkdown(text ?? "", options);

  return (
    <>
      {postBody &&
        postBody.map((element, index) => {
          return (
            <Fragment key={`paragraph_${type}_${index}`}>{element}</Fragment>
          );
        })}
    </>
  );
};
const PostTitle = ({ text }: PostTextProps) => {
  const themedMarkdownStyle = markdownStyles(useTheme());

  const titleOptions: useMarkdownHookOptions = {
    styles: {
      ...themedMarkdownStyle,
      text: themedMarkdownStyle.h1,
    },
  };
  return <MarkdownText text={text} type={"title"} options={titleOptions} />;
};

const PostBody = ({ text }: PostTextProps) => {
  const themedMarkdownStyle = markdownStyles(useTheme());

  const bodyOptions: useMarkdownHookOptions = {
    styles: {
      ...themedMarkdownStyle,
    },
  };
  return <MarkdownText text={text} type={"body"} options={bodyOptions} />;
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
      justifyContent: "center",
    },
    image: {
      flex: 1,
      aspectRatio: 4 / 3,
      borderRadius: 5,
      resizeMode: "cover",
      backgroundColor: theme.colors.secondaryBackground,
    },
    imageThumb: {
      width: 50,
      height: 50,
      marginEnd: 10,
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
    linkContainer: {
      flexDirection: "row",
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 10,
    },
  });