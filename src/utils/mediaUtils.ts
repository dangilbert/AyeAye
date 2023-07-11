import * as MediaLibrary from "expo-media-library";
import Snackbar from "react-native-snackbar";
import * as Haptics from "expo-haptics";

interface MediaSource {
  uri: string;
  mimeType: string;
}

export const handleDownload = async (mediaSource: MediaSource) => {
  Snackbar.show({ text: "Downloading", duration: Snackbar.LENGTH_INDEFINITE });
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  try {
    await saveImage(mediaSource.uri);
  } catch (err) {
    console.log("FS Err: ", err);
    Snackbar.dismiss();
  }
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

const saveImage = async (uri: string) => {
  console.log("In save image");
  try {
    // Request device storage access permission
    const { status } = await MediaLibrary.requestPermissionsAsync(true);
    if (status === "granted") {
      // Save image to media library
      await MediaLibrary.saveToLibraryAsync(uri);

      console.log("Image successfully saved");
      Snackbar.show({ text: "Saved" });
    } else {
      console.log("Permission denied", status);
      Snackbar.show({
        text: "Permission to save to your photos has been denied. Please enable it in your settings.",
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
