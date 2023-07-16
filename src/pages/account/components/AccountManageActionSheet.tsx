import { User, authQueries } from "@rn-app/pods/auth/queries";
import { Theme, useTheme } from "@rn-app/theme";
import { Button, StyleSheet, View } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  deleteAccount,
  setActiveLemmySession,
  useUserSessions,
} from "../hooks/useAccount";
import { ThemedText } from "@rn-app/components";
import { getShortActorId } from "@rn-app/utils/actorUtils";
import RNRestart from "react-native-restart";

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

  const allAccounts = useUserSessions();
  const nextAccount = Object.keys(allAccounts ?? {}).find(
    (acc) => acc !== account.actorId
  );

  const handleLogout = () => {
    deleteAccount(account.actorId);
    if (isCurrentAccount && nextAccount) {
      setActiveLemmySession(nextAccount);
    }
    RNRestart.restart();
  };

  const setCurrentAccount = () => {
    setActiveLemmySession(account.actorId);
    RNRestart.restart();
  };

  return (
    <ActionSheet
      containerStyle={{
        paddingBottom: insets.bottom,
        backgroundColor: themedStyles.bottomSheetContent.backgroundColor,
      }}
    >
      <View style={themedStyles.bottomSheetContent}>
        <ThemedText
          style={{ textAlign: "center", marginBottom: 10 }}
          variant="subheading"
        >{`${account.username}@${getShortActorId(
          account.instance
        )}`}</ThemedText>
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
