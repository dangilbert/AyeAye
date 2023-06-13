import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";

export const AddIconButton = () => {
  const navigator = useNavigation();

  return <IconButton icon="plus" onPress={() => navigator.navigate("Login")} />;
};
