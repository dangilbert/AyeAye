import ImageModal from "@dreamwalk-os/react-native-image-modal";
import { View, StyleSheet, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Snackbar from "react-native-snackbar";
import { handleDownload, shareImage } from "@rn-app/utils/mediaUtils";
import { useState } from "react";
import { Theme, useTheme } from "@rn-app/theme";

export const ImagePopover = ({
  uri,
  title,
}: {
  uri: string;
  title: string;
}) => {
  const themedStyle = styles(useTheme());
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  return (
    <ImageModal
      resizeMode="cover"
      modalImageResizeMode="contain"
      style={[themedStyle.imageBox, themedStyle.image]}
      source={{ uri: uri }}
      onClose={() => Snackbar.dismiss()}
      renderFooter={() => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <MaterialIcons
            name={"file-download"}
            style={[themedStyle.icon, { padding: 20 }]}
            onPress={() =>
              (async () => {
                setIsDownloading(true);
                await handleDownload({
                  uri: uri!!,
                  mimeType: "image/jpeg",
                });
                setIsDownloading(false);
              })()
            }
            disabled={isDownloading || isSharing}
          />
          <MaterialIcons
            name={Platform.OS === "ios" ? "ios-share" : "share"}
            style={[themedStyle.icon, { padding: 20 }]}
            onPress={() =>
              (async () => {
                setIsSharing(true);
                await shareImage(uri, title);
                setIsSharing(false);
              })()
            }
            disabled={isDownloading || isSharing}
          />
        </View>
      )}
    />
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    imageBox: {
      position: "absolute",
      top: 0,
      width: 60,
      height: 60,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: 5,
      backgroundColor: theme.colors.image.placeholder.backgroundColor,
    },
    image: {
      zIndex: 1,
    },
    icon: {
      color: theme.colors.text,
      margin: 10,
      fontSize: 30,
    },
  });
