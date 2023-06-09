import { CommentView } from "lemmy-js-client";
import { ThemedText, CreatorLine } from "@rn-app/components";
import { StyleSheet, View } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";
import { MaterialIcons } from "@expo/vector-icons";

export const CommentItem = ({ comment }: { comment: CommentView }) => {
  const theme = useTheme();
  const themedStyle = styles(theme);

  const commentIndentColors = theme.colors.commentIndentHighlight;
  const commentIndent = comment.comment.path.split(".").length - 2;

  return (
    <View
      style={{
        borderBottomColor: theme.colors.border,
        borderBottomWidth: 1,
        marginStart: commentIndent * 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderStartColor:
          commentIndentColors[commentIndent % commentIndentColors.length],
        borderStartWidth: 5,
        backgroundColor: theme.colors.secondaryBackground,
        flexDirection: "column",
        gap: 5,
      }}
    >
      <CreatorLine
        creator={comment.creator}
        published={new Date(comment.comment.published)}
      />
      <ThemedText variant="label">{comment.comment.content}</ThemedText>
      <View style={themedStyle.footer}>
        <View style={themedStyle.footerAction}>
          <MaterialIcons
            name="keyboard-arrow-up"
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
          />
          <ThemedText variant="label">{comment.counts.upvotes}</ThemedText>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
          />
          <ThemedText variant="label">{comment.counts.downvotes}</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    footer: {
      flexDirection: "row",
      iconColor: theme.colors.icon,
      iconSize: 20,
      justifyContent: "flex-end",
    },
    footerAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
  });
