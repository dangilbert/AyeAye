import * as FileSystem from "expo-file-system";
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
  let date = new Date().toISOString();
  let fileUri = FileSystem.documentDirectory + `${date}.jpg`;
  try {
    const res = await FileSystem.downloadAsync(mediaSource.uri, fileUri);
    saveFile(res.uri);
  } catch (err) {
    console.log("FS Err: ", err);
  }
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

const saveFile = async (fileUri: string) => {
  const { status } = await MediaLibrary.getPermissionsAsync();
  if (status === "granted") {
    try {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      const album = await MediaLibrary.getAlbumAsync("Download");
      if (album == null) {
        await MediaLibrary.createAlbumAsync("Download", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Snackbar.show({ text: "File downloaded" });
    } catch (err) {
      console.log("Save err: ", err);
    }
  } else if (status === "denied") {
    alert("please allow permissions to download");
  }
};
