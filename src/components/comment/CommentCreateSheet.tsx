import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { ThemedText } from "../ThemedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme, useTheme } from "@rn-app/theme";
import { StyleSheet, View } from "react-native";
import { usePostComment } from "@rn-app/pages/posts/hooks/useCommunities";
import Snackbar from "react-native-snackbar";
import { Button } from "react-native-paper";

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

  const { mutate: postComment } = usePostComment(
    postId,
    commentId,
    communityId
  );

  const handlePostComment = async () => {
    postComment("test", {
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
        <ThemedText>{`Replying to post ${postId}, comment: ${commentId}`}</ThemedText>
        <Button onPress={handlePostComment}>Post comment</Button>
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
  });
