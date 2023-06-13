import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@rn-app/components";
import { ActivityIndicator, Button } from "react-native-paper";
import { useCurrentUserProfile } from "../hooks/useCurrentUserProfile";
import { useCurrentUser } from "../hooks/useAccount";
import { View } from "react-native";
import { getShortActorId } from "@rn-app/utils/actorUtils";
import { Avatar } from "@rn-app/components";

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
