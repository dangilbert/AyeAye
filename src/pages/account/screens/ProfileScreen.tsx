import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@rn-app/components";
import { Button } from "react-native-paper";
import { useUserProfile } from "../hooks/useCurrentUserProfile";
import { useCurrentUser } from "../hooks/useAccount";
import { StyleSheet, View } from "react-native";
import { getShortActorId } from "@rn-app/utils/actorUtils";
import { Avatar } from "@rn-app/components";
import { Theme, useTheme } from "@rn-app/theme";
import { LoadingActivityView } from "@rn-app/components/feed/LoadingActivityView";

export const ProfileScreen = ({ route }) => {
  console.log("route", route);
  const { userId } = route.params ?? { userId: undefined };

  const currentSession = useCurrentUser({ enabled: !userId });

  return !!currentSession || userId ? (
    <LoggedInProfileScreen userId={userId} />
  ) : (
    <LoggedOutProfileScreen />
  );
};

const LoggedInProfileScreen = ({ userId }: { userId?: number }) => {
  const { data: userProfile } = useUserProfile(userId);

  const themedStyles = styles(useTheme());

  return (
    <>
      {userProfile ? (
        <View
          style={{
            alignItems: "center",
            padding: 16,
          }}
        >
          <Avatar
            name={userProfile.person_view.person.name}
            avatarUrl={userProfile.person_view.person.avatar}
          />
          <ThemedText variant={"subheading"} style={{ marginTop: 10 }}>
            {userProfile.person_view.person.name}
          </ThemedText>
          <ThemedText>
            @{getShortActorId(userProfile.person_view.person.actor_id)}
          </ThemedText>

          <View style={themedStyles.statItem}>
            <ThemedText style={themedStyles.statItemTitle}>
              Comment count
            </ThemedText>
            <ThemedText>
              {userProfile.person_view.counts.comment_count}
            </ThemedText>
          </View>
          <View style={themedStyles.statItem}>
            <ThemedText style={themedStyles.statItemTitle}>
              Comment score
            </ThemedText>
            <ThemedText>
              {userProfile.person_view.counts.comment_score}
            </ThemedText>
          </View>
          <View style={themedStyles.statItem}>
            <ThemedText style={themedStyles.statItemTitle}>
              Post count
            </ThemedText>
            <ThemedText>{userProfile.person_view.counts.post_count}</ThemedText>
          </View>
          <View style={themedStyles.statItem}>
            <ThemedText style={themedStyles.statItemTitle}>
              Post score
            </ThemedText>
            <ThemedText>{userProfile.person_view.counts.post_score}</ThemedText>
          </View>
        </View>
      ) : (
        <LoadingActivityView />
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
