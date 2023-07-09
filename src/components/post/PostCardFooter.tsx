import { Theme, useTheme } from "@rn-app/theme";
import { View, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { PostView } from "lemmy-js-client";

export const PostCardFooter = ({ post }: { post: PostView }) => {
  const themedStyle = styles(useTheme());
  const navigation = useNavigation();

  return (
    <View style={themedStyle.footer}>
      <View style={themedStyle.footerAction}>
        <MaterialCommunityIcons
          name="comment-text-multiple-outline"
          size={themedStyle.footer.iconSize * 0.9}
          color={themedStyle.footer.iconColor}
        />
        <Text variant="labelSmall">{post.counts.comments}</Text>
      </View>
      <View style={themedStyle.footerAction}>
        <View style={{ flexDirection: "column" }}>
          <MaterialIcons
            name="arrow-upward"
            size={themedStyle.footer.iconSize / 2}
            color={themedStyle.footer.iconColor}
          />
          <MaterialIcons
            name="arrow-downward"
            size={themedStyle.footer.iconSize / 2}
            color={themedStyle.footer.iconColor}
          />
        </View>
        <Text variant="labelSmall">{post.counts.score}</Text>
      </View>
      <Pressable
        style={themedStyle.footerAction}
        onPress={() => {
          navigation.push("CommunityFeed", {
            communityId: post.community.id,
            communityType: undefined,
          });
        }}
      >
        {post.community.icon && (
          <FastImage
            source={{ uri: post.community.icon }}
            style={{
              width: themedStyle.icon.fontSize / 2,
              height: themedStyle.icon.fontSize / 2,
              borderRadius: themedStyle.icon.fontSize / 2,
            }}
          />
        )}
        <Text variant="labelMedium">{post.community.name}</Text>
      </Pressable>
    </View>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.secondaryBackground,
      padding: 10,
      flexDirection: "row",
    },
    rightContent: {
      flex: 1,
      flexDirection: "column",
    },
    footer: {
      flexDirection: "row",
      iconColor: theme.colors.icon,
      iconSize: 20,
      marginTop: 10,
      gap: 15,
    },
    footerAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    imageContainer: {
      position: "relative",
      width: 60,
      height: 60,
      marginEnd: 10,
    },
    imageBox: {
      position: "absolute",
      top: 0,
      width: 60,
      height: 60,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: 5,
      backgroundColor: theme.colors.image.placeholder.backgroundColor,
    },
    image: {
      zIndex: 1,
    },
    imageBlur: {
      zIndex: 2,
    },
    warningIcon: {
      alignSelf: "center",
    },
    title: {
      flex: 1,
    },
    icon: {
      color: theme.colors.text,
      margin: 10,
      fontSize: 30,
    },
    iconContainer: {
      width: 60,
      height: 60,
      marginEnd: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
  });
