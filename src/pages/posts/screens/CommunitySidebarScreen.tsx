import { ThemedText } from "@rn-app/components";
import { markdownDefaultOptions } from "@rn-app/components/post/styles";
import { Theme, useTheme } from "@rn-app/theme";
import { getActorIdFromUrl } from "@rn-app/utils/actorUtils";
import { CommunityView } from "lemmy-js-client";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import { useMarkdown } from "react-native-marked";

export const CommunitySidebarScreen = ({ route, navigation }) => {
  const community = route.params.community as CommunityView;

  const theme = useTheme();
  const themedStyles = styles(theme);

  useEffect(() => {
    navigation.setOptions({
      title: community?.community.name,
    });
  }, [community]);

  console.log("community", Object.keys(community.community));

  const descriptionContent = useMarkdown(
    community.community.description ?? "",
    markdownDefaultOptions(theme)
  );

  return (
    <ScrollView style={themedStyles.container}>
      <View>
        <FastImage
          source={{ uri: community.community.icon }}
          style={{ width: 100, height: 100, alignSelf: "center" }}
          resizeMode="contain"
        />
        <ThemedText>
          {community.community.title ?? community.community.name}
        </ThemedText>
        <ThemedText>
          {getActorIdFromUrl(community.community.actor_id)}
        </ThemedText>
        <ThemedText>{community.community.banner}</ThemedText>
        <ThemedText>{descriptionContent}</ThemedText>
        <ThemedText>{community.subscribed}</ThemedText>
        {/* <ThemedText>{JSON.stringify(community.counts, null, 2)}</ThemedText> */}
      </View>
    </ScrollView>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 10,
    },
  });
