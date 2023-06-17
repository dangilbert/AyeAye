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
      <ThemedText variant="subheading">Appearance</ThemedText>
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
    </ScrollView>
  );
};
