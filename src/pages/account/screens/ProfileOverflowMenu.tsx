import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";
import { Menu } from "react-native-paper";
import { useState } from "react";
import { GetPersonDetailsResponse } from "lemmy-js-client";
import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native-paper";
import { useBlockPerson } from "../hooks/useCurrentUserProfile";

export const ProfileOverflowMenu = ({
  userProfile,
}: {
  userProfile: GetPersonDetailsResponse;
}) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const themedStyles = styles(useTheme());

  const { mutate: blockPerson, isLoading } = useBlockPerson({
    personId: userProfile.person_view.person.id,
    onSuccess: () => {
      navigation.goBack();
    },
  });

  const otherUserOptions = [
    {
      label: "Block user",
      icon: "block",
      action: () => {
        blockPerson(true);
      },
      disabled: isLoading,
    },
  ];

  return (
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
      {otherUserOptions.map((type) => (
        <Menu.Item
          key={type.label}
          onPress={() => {
            type.action?.();
            closeMenu();
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
