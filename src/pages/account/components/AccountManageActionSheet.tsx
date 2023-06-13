import { User, authQueries } from "@rn-app/pods/auth/queries";
import { Theme, useTheme } from "@rn-app/theme";
import { Button, StyleSheet, View } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { deleteAccount } from "../hooks/useAccount";
import { useQueryClient } from "@tanstack/react-query";

interface AccountManageActionSheetProps {
  account: User;
  isCurrentAccount: boolean;
}

export const AccountManageActionSheet = ({
  sheetId,
  payload: { account, isCurrentAccount },
}: SheetProps<AccountManageActionSheetProps>) => {
  const themedStyles = styles(useTheme());
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    deleteAccount(account.actorId);
    if (isCurrentAccount) {
      queryClient.invalidateQueries();
    } else {
      queryClient.invalidateQueries(authQueries.users().queryKey);
    }
    SheetManager.hide(sheetId);
  };

  const setCurrentAccount = () => {
    if (isCurrentAccount) {
      queryClient.invalidateQueries();
    } else {
      queryClient.invalidateQueries(authQueries.users().queryKey);
    }
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
        <Button
          title={`Set as current account${isCurrentAccount ? ": active" : ""}`}
          disabled={isCurrentAccount}
          onPress={setCurrentAccount}
        />
        <Button title={"Log out"} onPress={handleLogout} />
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
