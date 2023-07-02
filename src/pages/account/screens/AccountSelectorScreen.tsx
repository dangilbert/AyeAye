import { Pressable, StyleSheet, View } from "react-native";
import { useCurrentUser, useUserSessions } from "../hooks/useAccount";
import { Avatar, ThemedText } from "@rn-app/components";
import { getShortActorId } from "@rn-app/utils/actorUtils";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { User } from "@rn-app/pods/auth/queries";
import { Theme, useTheme } from "@rn-app/theme";
import { SheetManager, SheetProvider } from "react-native-actions-sheet";
import { PlaceholderAvatar } from "@rn-app/components/user/PlaceholderAvatar";

export const AccountSelectorScreen = () => {
  const accounts = useUserSessions();
  const currentSession = useCurrentUser({ enabled: true });

  const themedStyles = styles(useTheme());

  const accountItems = Object.entries(accounts ?? {}).map((account) => {
    return {
      account: account[1],
      isCurrent: account[1].actorId === currentSession?.actorId,
    };
  });

  const AccountItem: ListRenderItem<AccountItemProps> = ({ item }) => {
    return (
      <Pressable
        style={themedStyles.accountItem}
        onPress={() =>
          SheetManager.show("account-manage-sheet", {
            payload: {
              account: item.account,
              isCurrentAccount: item.isCurrent,
            },
          })
        }
      >
        {/* TODO: Store the profile picture of the user in the DB */}
        <Avatar name={item.account.username} avatarUrl={undefined} />
        <View style={{ flexDirection: "column", flex: 1 }}>
          <ThemedText>{item.account.username}</ThemedText>
          <ThemedText>{`@${getShortActorId(
            item.account.instance
          )}`}</ThemedText>
        </View>
        <ThemedText>{item.isCurrent ? "Current" : ""}</ThemedText>
      </Pressable>
    );
  };

  return (
    <>
      <SheetProvider>
        <FlashList
          data={accountItems}
          renderItem={AccountItem}
          estimatedItemSize={100}
          contentContainerStyle={themedStyles.listContentContainer}
        />
      </SheetProvider>
    </>
  );
};

interface AccountItemProps {
  account: User;
  isCurrent: boolean;
}

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
      borderWidth: 1,
      margin: 8,
      padding: 8,
      alignItems: "center",
      gap: 10,
    },
    bottomSheetContent: {
      backgroundColor: theme.colors.secondaryBackground,
      padding: 16,
    },
  });
