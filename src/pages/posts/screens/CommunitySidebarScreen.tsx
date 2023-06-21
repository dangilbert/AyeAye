import { ThemedText } from "@rn-app/components";
import { CommunityView } from "lemmy-js-client";
import { useEffect } from "react";
import { View } from "react-native";
import FastImage from "react-native-fast-image";

export const CommunitySidebarScreen = ({ route, navigation }) => {
  const community = route.params.community as CommunityView;

  useEffect(() => {
    navigation.setOptions({
      title: community?.community.name,
    });
  }, [community]);

  console.log("community", Object.keys(community.community));

  return (
    <View>
      <View>
        <ThemedText>{community.community.name}</ThemedText>
        <ThemedText>{community.community.title}</ThemedText>
        <ThemedText>{community.community.banner}</ThemedText>
        <ThemedText>{community.community.description}</ThemedText>
        <ThemedText>{community.community.actor_id}</ThemedText>
        <ThemedText>{community.subscribed}</ThemedText>
        <ThemedText>{JSON.stringify(community.counts, null, 2)}</ThemedText>
        <FastImage
          source={{ uri: community.community.icon }}
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};
