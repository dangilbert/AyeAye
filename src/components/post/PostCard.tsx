import { PostView } from "lemmy-js-client";
import { Theme, useTheme } from "@rn-app/theme";
import { Pressable, StyleSheet, View, Platform, Share } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { CreatorLine } from "@rn-app/components";
import { useStringSetting } from "@rn-app/hooks/useSetting";
import { CompactPostCard } from "./compact/CompactPostCard";
import { LargePostCard } from "./large/LargePostCard";

export interface PostCardProps {
  post: PostView;
}

// TODO pass the Id and fetch this from reeact query
export const PostCard = ({ post }: PostCardProps) => {
  const { value: cardStyle } = useStringSetting("card_style");

  if (cardStyle === "compact") {
    return <CompactPostCard post={post} />;
  } else {
    return <LargePostCard post={post} />;
  }
};
