import { Button, Text } from "react-native-paper";
import { ThemedMarkdown } from "@rn-app/components/ThemedMarkdown";
import { Theme, useTheme } from "@rn-app/theme";
import { getActorIdFromUrl } from "@rn-app/utils/actorUtils";
import { CommunityView } from "lemmy-js-client";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";

export const CommunitySidebarScreen = ({ route, navigation }) => {
  const community = route.params.community as CommunityView;

  const theme = useTheme();
  const themedStyles = styles(theme);

  useEffect(() => {
    navigation.setOptions({
      title: community?.community.name,
    });
  }, [community]);

  return (
    <ScrollView style={themedStyles.container}>
      <View>
        {community.community.banner && (
          <View style={{ position: "relative" }}>
            <FastImage
              source={{ uri: community.community.banner }}
              style={{ width: "100%", alignSelf: "center", aspectRatio: 2 }}
            />
            <FastImage
              source={{ uri: community.community.icon }}
              style={{
                width: 60,
                height: 60,
                alignSelf: "center",
                position: "absolute",
                bottom: 20,
                end: 20,
              }}
              resizeMode="contain"
            />
          </View>
        )}
        {!community.community.banner && (
          <FastImage
            source={{ uri: community.community.icon }}
            style={{ width: 100, height: 100, alignSelf: "center" }}
            resizeMode="contain"
          />
        )}
        <View style={{ padding: 10 }}>
          <View
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}
          >
            <Button
              icon={
                community.subscribed === "Subscribed"
                  ? "heart-off"
                  : community.subscribed === "NotSubscribed"
                  ? "heart"
                  : "calendar-heart"
              }
              mode="outlined"
              onPress={() => {
                navigation.navigate("CommunityCreatePost", {
                  community: community.community,
                });
              }}
            >
              {community.subscribed === "Subscribed"
                ? "Unsubscribe"
                : community.subscribed === "NotSubscribed"
                ? "Subscribe"
                : "Pending"}
            </Button>
            <Button
              icon="account-plus"
              mode="outlined"
              onPress={() => {
                navigation.navigate("CommunityCreatePost", {
                  community: community.community,
                });
              }}
            >
              Block
            </Button>
          </View>
          <Text variant={"headlineMedium"} style={{ marginVertical: 10 }}>
            {community.community.title ?? community.community.name}
          </Text>
          <Text variant={"labelMedium"}>
            {getActorIdFromUrl(community.community.actor_id)}
          </Text>
          <ThemedMarkdown>{community.community.description}</ThemedMarkdown>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {},
  });
