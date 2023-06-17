import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@rn-app/components";
import { ActivityIndicator, Button } from "react-native-paper";
import { useCurrentUserProfile } from "../hooks/useCurrentUserProfile";
import { useCurrentUser } from "../hooks/useAccount";
import { StyleSheet, View } from "react-native";
import { getShortActorId } from "@rn-app/utils/actorUtils";
import { Avatar } from "@rn-app/components";
import { Theme, useTheme } from "@rn-app/theme";

export const ProfileScreen = () => {
  const currentSession = useCurrentUser();

  return !!currentSession ? (
    <LoggedInProfileScreen />
  ) : (
    <LoggedOutProfileScreen />
  );
};

const LoggedInProfileScreen = () => {
  const { data: currentUser } = useCurrentUserProfile();
  const userSession = useCurrentUser();

  const themedStyles = styles(useTheme());

  return (
    <>
      {currentUser ? (
        <View
          style={{
            alignItems: "center",
            padding: 16,
          }}
        >
          <Avatar
            name={currentUser.person_view.person.name}
            avatarUrl={currentUser.person_view.person.avatar}
          />
          <ThemedText variant={"subheading"}>
            {currentUser.person_view.person.name}
          </ThemedText>
          <ThemedText>@{getShortActorId(userSession?.instance)}</ThemedText>

          <View style={themedStyles.statItem}>
            <ThemedText style={themedStyles.statItemTitle}>
              Comment count
            </ThemedText>
            <ThemedText>
              {currentUser.person_view.counts.comment_count}
            </ThemedText>
          </View>
          <View style={themedStyles.statItem}>
            <ThemedText style={themedStyles.statItemTitle}>
              Comment score
            </ThemedText>
            <ThemedText>
              {currentUser.person_view.counts.comment_score}
            </ThemedText>
          </View>
          <View style={themedStyles.statItem}>
            <ThemedText style={themedStyles.statItemTitle}>
              Post count
            </ThemedText>
            <ThemedText>{currentUser.person_view.counts.post_count}</ThemedText>
          </View>
          <View style={themedStyles.statItem}>
            <ThemedText style={themedStyles.statItemTitle}>
              Post score
            </ThemedText>
            <ThemedText>{currentUser.person_view.counts.post_score}</ThemedText>
          </View>
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </>
  );
};

const LoggedOutProfileScreen = () => {
  const navigator = useNavigation();

  return (
    <>
      <ThemedText>Logged out</ThemedText>
      <Button onPress={() => navigator.navigate("Login")}>Add account</Button>
    </>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    statItem: {
      flexDirection: "row",
      maxWidth: 400,
      justifyContent: "space-between",
      padding: 10,
    },
    statItemTitle: {
      flex: 1,
    },
  });
