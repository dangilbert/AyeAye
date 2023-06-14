import { CommentView } from "lemmy-js-client";
import { ThemedText, CreatorLine } from "@rn-app/components";
import { StyleSheet, View } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useMarkdown, useMarkdownHookOptions } from "react-native-marked";
import { markdownStyles } from "../post/styles";
import { Fragment } from "react";

export const CommentItem = ({ comment }: { comment: CommentView }) => {
  const theme = useTheme();
  const themedStyle = styles(theme);

  const commentIndentColors = theme.colors.commentIndentHighlight;
  const commentIndent = comment.comment.path.split(".").length - 2;

  const themedMarkdownStyle = markdownStyles(theme);
  const bodyOptions: useMarkdownHookOptions = {
    styles: {
      ...themedMarkdownStyle,
    },
  };
  const commentBody = useMarkdown(comment.comment.content, bodyOptions);

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
        actorId={comment.creator.actor_id}
        published={new Date(comment.comment.published)}
        updated={
          comment.comment.updated
            ? new Date(comment.comment.updated)
            : undefined
        }
      />
      {commentBody &&
        commentBody.map((element, index) => {
          return (
            <Fragment key={`comment_${comment.comment.id}_body_${index}`}>
              {element}
            </Fragment>
          );
        })}
      <View style={themedStyle.footer}>
        <View style={themedStyle.footerAction}>
          <MaterialIcons
            name="arrow-upward"
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
          />
          <ThemedText variant="label">{comment.counts.score}</ThemedText>
          <MaterialIcons
            name="arrow-downward"
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
          />
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
