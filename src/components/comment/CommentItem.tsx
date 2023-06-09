import { CommentView } from "lemmy-js-client";
import { ThemedText } from "../ThemedText";
import { StyleSheet, View } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";

export const CommentItem = ({ comment }: { comment: CommentView }) => {
  const theme = useTheme();

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
      }}
    >
      <ThemedText variant="label">{comment.comment.content}</ThemedText>
    </View>
  );
};

const styles = (theme: Theme) => StyleSheet.create({});
