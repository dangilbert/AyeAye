import { ThemedText } from "@rn-app/components";
import { useBooleanSetting } from "@rn-app/hooks/useSetting";
import { ScrollView, View } from "react-native";
import { Switch } from "react-native-paper";

export const SettingsRootScreen = () => {
  const { value: blurNSFW, setValue: setBlurNSFW } =
    useBooleanSetting("blur_nsfw");

  const { value: showUserInstanceNames, setValue: setShowUserInstanceNames } =
    useBooleanSetting("show_user_instance_names");

  const {
    value: showCommunityInstanceNames,
    setValue: setShowCommunityInstanceNames,
  } = useBooleanSetting("show_community_instance_names");

  const { value: showCommunityIcons, setValue: setShowCommunityIcons } =
    useBooleanSetting("show_community_icons");

  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedText variant="subheading" style={{ padding: 10 }}>
        Appearance
      </ThemedText>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
        }}
      >
        <ThemedText>Blur NSFW in feed</ThemedText>
        <Switch onValueChange={() => setBlurNSFW(!blurNSFW)} value={blurNSFW} />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
        }}
      >
        <ThemedText>Show user instance names</ThemedText>
        <Switch
          onValueChange={() => setShowUserInstanceNames(!showUserInstanceNames)}
          value={showUserInstanceNames}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
        }}
      >
        <ThemedText>Show community instance names</ThemedText>
        <Switch
          onValueChange={() =>
            setShowCommunityInstanceNames(!showCommunityInstanceNames)
          }
          value={showCommunityInstanceNames}
        />
      </View>

      <ThemedText variant="subheading" style={{ padding: 10 }}>
        Coming soon
      </ThemedText>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
        }}
      >
        <ThemedText>Show community icons on posts</ThemedText>
        <Switch
          onValueChange={() => setShowCommunityIcons(!showCommunityIcons)}
          value={showCommunityIcons}
          disabled
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
        }}
      >
        <ThemedText>Display posts as large cards</ThemedText>
        <Switch onValueChange={() => {}} value={false} disabled />
      </View>
    </ScrollView>
  );
};
