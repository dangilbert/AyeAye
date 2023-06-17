import { storage } from "@rn-app/utils/storage";
import { useMMKVString } from "react-native-mmkv";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";
import { Menu } from "react-native-paper";
import { useState } from "react";
import { ThemedText } from "../ThemedText";

export const PostSortTypeSelector = () => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const [sortType, setSortType] = useMMKVString(
    "settings.post-sort-type",
    storage
  );
  const themedStyles = styles(useTheme());

  const sortTypes = [
    { label: "Hot", value: "Hot", icon: "whatshot" },
    { label: "Active", value: "Active", icon: "chat" },
    { label: "New", value: "New", icon: "fiber-new" },
    { label: "Old", value: "Old", icon: "access-time" },
    { label: "Top Day", value: "TopDay", icon: "today" },
    { label: "Top Week", value: "TopWeek", icon: "view-week" },
    { label: "Top Month", value: "TopMonth", icon: "date-range" },
    { label: "Top Year", value: "TopYear", icon: "view-module" },
    { label: "Top All", value: "TopAll", icon: "view-list" },
  ];

  const selectedType =
    sortTypes.find((type) => type.value === sortType) ?? sortTypes[0];

  return (
    // <PaperProvider>
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <MaterialIcons
          onPress={openMenu}
          name={selectedType.icon}
          style={themedStyles.icon}
        />
      }
    >
      {sortTypes.map((type) => (
        <Menu.Item
          key={type.value}
          onPress={() => {
            setSortType(type.value);
            closeMenu();
          }}
          title={
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <MaterialIcons name={type.icon} style={themedStyles.icon} />
              <ThemedText>{type.label}</ThemedText>
            </View>
          }
        />
      ))}
    </Menu>
    // </PaperProvider>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    icon: {
      color: theme.colors.iconActive,
      fontSize: 24,
    },
  });
