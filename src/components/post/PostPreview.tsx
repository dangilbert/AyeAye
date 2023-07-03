import { Community, Person, PostView } from "lemmy-js-client";
import { useState } from "react";
import { Theme, useTheme } from "@rn-app/theme";
import { Pressable, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText, CreatorLine } from "@rn-app/components";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { getPostType } from "@rn-app/utils/postUtils";
import FastImage from "react-native-fast-image";
import ImageModal from "@dreamwalk-os/react-native-image-modal";
import { ThemedMarkdown } from "../ThemedMarkdown";
import { Thumbnail } from "react-native-thumbnail-video";
import { isYoutubeUrl } from "@rn-app/utils/urlUtils";

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
  const postType = getPostType(post.post);

  let content;
  if (postType === "Text") {
    content = (
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
    content = (
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
    content = (
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
    content = (
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
        embed_video_url={embed_video_url!!}
      />
    );
  }

  if (!content) {
    // console.log("Post type not built", JSON.stringify(post.post, null, 2));
  }

  content = content || <ThemedText>Post type not built</ThemedText>;

  return <View style={{ margin: 10 }}>{content}</View>;
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
          <FastImage
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
          <ThemedText variant={"label"} style={{ fontStyle: "italic" }}>
            {new URL(url).host}
          </ThemedText>
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
            community={community}
            communityActorId={community.actor_id}
            published={published}
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
      <ImageModal
        style={themedStyle.image}
        source={{ uri: url }}
        resizeMode="cover"
        modalImageResizeMode="contain"
      />
      <View style={themedStyle.titleLine}>
        <View style={themedStyle.titleAndCreator}>
          <Pressable onPress={() => setCollapsed(!collapsed)}>
            <PostTitle text={name} />
          </Pressable>
          <CreatorLine
            creator={creator}
            actorId={creator.actor_id}
            community={community}
            communityActorId={community.actor_id}
            published={published}
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
          <FastImage
            style={themedStyle.imageThumb}
            source={{ uri: thumbnail_url }}
          />
        ) : isYoutubeUrl(url) ? (
          <Thumbnail
            url={url}
            onPress={() =>
              navigator.navigate("MediaModal", {
                videoUri: embed_video_url,
              })
            }
          />
        ) : (
          <View style={themedStyle.iconContainer}>
            <MaterialIcons name={"link"} style={themedStyle.icon} />
          </View>
        )}

        <ThemedText variant={"label"} style={{ marginTop: 10 }}>
          {embed_title}
        </ThemedText>
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
            community={community}
            communityActorId={community.actor_id}
            published={published}
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
            community={community}
            communityActorId={community.actor_id}
            published={published}
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
}
const MarkdownText = ({ text, type }: MarkdownTextProps) => {
  return (
    <View style={{ marginVertical: 5 }}>
      <ThemedMarkdown>{`${
        type === "title" ? "#### " : ""
      }${text}`}</ThemedMarkdown>
    </View>
  );
};
export const PostTitle = ({ text }: PostTextProps) => {
  return <MarkdownText text={text} type={"title"} />;
};

export const PostBody = ({ text }: PostTextProps) => {
  return text && text.length ? (
    <MarkdownText text={text} type={"body"} />
  ) : (
    <></>
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
      justifyContent: "center",
    },
    image: {
      aspectRatio: 4 / 3,
      borderRadius: 5,
      width: "100%",
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
      color: theme.colors.text,
      margin: 10,
      fontSize: 20,
    },
    iconContainer: {
      width: 50,
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
