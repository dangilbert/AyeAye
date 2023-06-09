import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { ThemedText } from "../ThemedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme, useTheme } from "@rn-app/theme";
import { StyleSheet, TextInput, View } from "react-native";
import { usePostComment } from "@rn-app/pages/posts/hooks/useCommunities";
import Snackbar from "react-native-snackbar";
import { Button } from "react-native-paper";
import { useState } from "react";
import { useCurrentUser } from "@rn-app/pages/account/hooks/useAccount";

interface CommentCreateSheetProps {
  postId: string;
  commentId?: string;
  communityId?: string;
}

export const CommentCreateSheet = ({
  sheetId,
  payload: { postId, commentId, communityId },
}: SheetProps<CommentCreateSheetProps>) => {
  const themedStyles = styles(useTheme());
  const insets = useSafeAreaInsets();

  const [commentContent, onChangeText] = useState("");
  const currentUser = useCurrentUser({ enabled: true });

  const { mutate: postComment, isLoading: isPostingComment } = usePostComment(
    postId,
    commentId,
    communityId
  );

  const handlePostComment = async () => {
    postComment(commentContent, {
      onSuccess: () => {
        closeSheet();
      },
      onError: () => {
        Snackbar.show({
          text: "Error posting comment",
        });
      },
    });
  };

  const closeSheet = () => {
    SheetManager.hide(sheetId);
  };

  return (
    <ActionSheet
      containerStyle={{
        paddingBottom: insets.bottom,
        backgroundColor: themedStyles.bottomSheetContent.backgroundColor,
      }}
    >
      <View style={themedStyles.bottomSheetContent}>
        <ThemedText>Response:</ThemedText>
        <TextInput
          editable
          multiline
          numberOfLines={4}
          onChangeText={(text) => onChangeText(text)}
          value={commentContent}
          style={themedStyles.commentBox}
        />
        {currentUser ? (
          <Button
            onPress={handlePostComment}
            disabled={!commentContent.length || isPostingComment}
          >
            Post comment
          </Button>
        ) : (
          <ThemedText style={{ textAlign: "center" }}>
            You must be signed in to comment
          </ThemedText>
        )}
      </View>
    </ActionSheet>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    listContentContainer: {
      padding: 16,
    },
    accountItem: {
      flexDirection: "row",
      borderRadius: theme.sizes.borderRadius,
      borderColor: theme.colors.border,
    },
    bottomSheetContent: {
      backgroundColor: theme.colors.secondaryBackground,
      padding: 16,
    },
    commentBox: {
      height: 200,
      backgroundColor: theme.colors.secondaryBackground,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.sizes.borderRadius,
      padding: 8,
      marginVertical: 8,
      color: theme.colors.text,
    },
  });
