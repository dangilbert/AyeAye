import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { Theme, useTheme } from "@rn-app/theme";
import { StyleSheet, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";

export const MediaModalScreen = gestureHandlerRootHOC(({ route }) => {
  const imageUri = route.params?.imageUri;
  const themedStyle = styles(useTheme());
  return (
    <View style={themedStyle.container}>
      {imageUri && (
        <ImageZoom
          uri={imageUri}
          renderLoader={() => (
            <View style={{ flex: 1 }}>
              <ActivityIndicator />
            </View>
          )}
        />
      )}
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
