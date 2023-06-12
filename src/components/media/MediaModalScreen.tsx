import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { Theme, useTheme } from "@rn-app/theme";
import { StyleSheet, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

export const MediaModalScreen = gestureHandlerRootHOC(({ route }) => {
  const imageUri = route.params?.imageUri;
  const themedStyle = styles(useTheme());
  return (
    <View style={themedStyle.container}>
      {imageUri && <ImageZoom uri={imageUri} />}
    </View>
  );
});

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
  });
