import { StyleSheet } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";
import { MaterialIcons } from "@expo/vector-icons";

export type TabBarIconNames =
  | "dynamic-feed"
  | "inbox"
  | "person-outline"
  | "search"
  | "settings";

export interface TabBarIconProps {
  focused: boolean;
  icon: TabBarIconNames;
}

export const TabBarIcon = ({ focused, icon }: TabBarIconProps) => {
  const theme = useTheme();
  const themedStyles = styles(theme);

  return (
    <MaterialIcons
      name={icon}
      size={themedStyles.icon.size}
      color={focused ? themedStyles.icon.activeColor : themedStyles.icon.color}
    />
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    icon: {
      color: theme.colors.icon,
      activeColor: theme.colors.iconActive,
      size: theme.sizes.icon.tabBar,
    },
  });
