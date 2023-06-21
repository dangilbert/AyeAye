import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";
import { Menu } from "react-native-paper";
import { useState } from "react";
import { ThemedText } from "../ThemedText";
import { CommunityView } from "lemmy-js-client";
import { useNavigation } from "@react-navigation/native";

export const CommunityOverflowMenu = ({
  community,
}: {
  community: CommunityView;
}) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const themedStyles = styles(useTheme());

  const menuOptions = [
    {
      label: "View Sidebar",
      icon: "whatshot",
      action: () => {
        navigation.navigate("CommunitySidebar", { community });
      },
    },
    {
      label:
        community.subscribed === "NotSubscribed"
          ? "Subscribe"
          : community.subscribed === "Pending"
          ? "Pending"
          : "Subscribe",
      icon: "chat",
      ection: () => {
        switch (community.subscribed) {
          case "NotSubscribed":
            break;
          case "Pending":
            break;
          case "Subscribed":
            break;
        }
      },
    },
  ];

  return (
    // <PaperProvider>
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <MaterialIcons
          onPress={openMenu}
          name={"more-vert"}
          style={themedStyles.headerIcon}
        />
      }
    >
      {menuOptions.map((type) => (
        <Menu.Item
          key={type.label}
          onPress={() => {
            type.action?.();
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
    headerIcon: {
      color: theme.colors.icon,
      fontSize: 24,
      paddingHorizontal: 5,
      marginStart: 10,
    },
    icon: {
      color: theme.colors.icon,
      fontSize: 24,
    },
  });
