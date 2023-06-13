import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { useTheme } from "@rn-app/theme";

interface PlaceholderAvatarProps {
  name: string;
}

export const PlaceholderAvatar = ({ name }: PlaceholderAvatarProps) => {
  const theme = useTheme();
  return (
    <View
      style={{
        width: theme.sizes.avatar.size,
        height: theme.sizes.avatar.size,
        borderRadius: theme.sizes.avatar.borderRadius,
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText variant="heading">
        {name.substring(0, 1).toUpperCase()}
      </ThemedText>
    </View>
  );
};
