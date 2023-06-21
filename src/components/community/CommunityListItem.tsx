import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { Theme, useTheme } from "@rn-app/theme";
import { MaterialIcons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { getActorIdFromUrl } from "@rn-app/utils/actorUtils";

interface CommunityListItemProps {
  name: string;
  title?: string;
  actorId: string;
  icon?: string;
  customIcon?: "menu";
  instanceName?: string;
  onPress: () => void;
}

export const CommunityListItem = ({
  name,
  title,
  actorId,
  icon,
  customIcon,
  onPress,
}: CommunityListItemProps) => {
  const themedStyles = styles(useTheme());

  return (
    <Pressable onPress={onPress} style={themedStyles.container}>
      {icon ? (
        <FastImage source={{ uri: icon }} style={themedStyles.image} />
      ) : (
        <View style={themedStyles.materialIcon}>
          <MaterialIcons
            name={customIcon ?? "menu"}
            size={themedStyles.materialIcon.iconSize}
            color={themedStyles.materialIcon.iconColor}
          />
        </View>
      )}
      <View>
        <ThemedText variant="labelBold">{title ?? name}</ThemedText>
        <ThemedText variant="label">{getActorIdFromUrl(actorId)}</ThemedText>
      </View>
    </Pressable>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      backgroundColor: theme.colors.background,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    materialIcon: {
      backgroundColor: theme.colors.icon,
      iconColor: theme.colors.background,
      borderRadius: 25,
      width: 50,
      height: 50,
      iconSize: 25,
      padding: 10,
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },
  });
