import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { useUserSessions } from "../hooks/useAccount";

export const ManageAccountsButton = () => {
  const navigator = useNavigation();
  const users = useUserSessions();

  return Object.keys(users ?? {}).length > 0 ? (
    <IconButton
      icon={"account-group-outline"}
      onPress={() => navigator.navigate("AccountSelector")}
    />
  ) : (
    <IconButton icon={"plus"} onPress={() => navigator.navigate("Login")} />
  );
};
