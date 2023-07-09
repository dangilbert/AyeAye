import { Pressable, StyleSheet, View } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";
import { MaterialIcons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { getActorIdFromUrl } from "@rn-app/utils/actorUtils";
import { Chip, Text } from "react-native-paper";

interface CommunityListItemProps {
  name: string;
  title?: string;
  actorId: string;
  icon?: string;
  customIcon?: "menu";
  instanceName?: string;
  subscribers?: number;
  onPress: () => void;
}

export const CommunityListItem = ({
  name,
  title,
  actorId,
  icon,
  customIcon,
  onPress,
  subscribers,
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
      <View style={{ flex: 1 }}>
        <Text variant="bodyMedium" numberOfLines={2} ellipsizeMode="tail">
          {title ?? name}
        </Text>
        <Text variant="labelSmall" numberOfLines={1}>
          {getActorIdFromUrl(actorId)}
        </Text>
      </View>
      {!!subscribers && (
        <View style={{ marginStart: 10 }}>
          <Chip icon="account-group-outline">{`${subscribers}`}</Chip>
        </View>
      )}
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
