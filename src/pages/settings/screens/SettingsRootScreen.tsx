import { ThemedText } from "@rn-app/components";
import { useBooleanSetting } from "@rn-app/hooks/useSetting";
import { ScrollView, View } from "react-native";
import { Switch, ToggleButton } from "react-native-paper";

export const SettingsRootScreen = () => {
  const { value: blurNSFW, setValue: setBlurNSFW } = useBooleanSetting(
    "blur_nsfw",
    true
  );

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
        <Switch onValueChange={() => {}} value={false} disabled />
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
        <Switch onValueChange={() => {}} value={false} disabled />
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
        <Switch onValueChange={() => {}} value={false} disabled />
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
