import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@rn-app/components";
import { ActivityIndicator, Button } from "react-native-paper";
import { useCurrentUserProfile } from "../hooks/useCurrentUserProfile";
import { useQueryClient } from "@tanstack/react-query";
import { deleteAccount, useCurrentUser } from "../hooks/useAccount";

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
  const queryClient = useQueryClient();

  return currentUser ? (
    <>
      <ThemedText>
        Fetching the user profile: {currentUser.person_view.person.name}
      </ThemedText>
      <Button
        onPress={() => {
          deleteAccount(currentUser.person_view.person.actor_id);
          queryClient.invalidateQueries();
        }}
      >
        Log out
      </Button>
    </>
  ) : (
    <ActivityIndicator />
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
