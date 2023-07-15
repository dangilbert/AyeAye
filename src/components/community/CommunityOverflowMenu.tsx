import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";
import { Menu } from "react-native-paper";
import { useState } from "react";
import { Text } from "react-native-paper";
import { CommunityView } from "lemmy-js-client";
import { useNavigation } from "@react-navigation/native";
import { useChangeSubscription } from "@rn-app/pages/posts/hooks/useCommunities";

export const CommunityOverflowMenu = ({
  community,
}: {
  community: CommunityView;
}) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const {
    mutate: changeCommunitySubscription,
    isLoading: changingSubscription,
  } = useChangeSubscription({
    communityId: community.community.id,
  });

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
          : community.subscribed === "Subscribed"
          ? "Unsubscribe"
          : "Subscribe",
      icon: "chat",
      action: () => {
        switch (community.subscribed) {
          case "NotSubscribed":
            changeCommunitySubscription(true);
            break;
          case "Pending":
          case "Subscribed":
            changeCommunitySubscription(false);
            break;
        }
      },
      disabled: changingSubscription,
      closeMenu: false,
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
            type.closeMenu !== false && closeMenu();
          }}
          disabled={type.disabled}
          title={
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <MaterialIcons name={type.icon} style={themedStyles.icon} />
              <Text>{type.label}</Text>
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
