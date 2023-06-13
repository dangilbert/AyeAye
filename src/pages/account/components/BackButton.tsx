import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";

export const BackButton = () => {
  const navigator = useNavigation();

  return <IconButton icon="close" onPress={() => navigator.goBack()} />;
};
