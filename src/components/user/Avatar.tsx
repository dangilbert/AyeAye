import FastImage from "react-native-fast-image";
import { PlaceholderAvatar } from "./PlaceholderAvatar";

interface AvatarProps {
  name: string;
  avatarUrl?: string;
}

export const Avatar = ({ name, avatarUrl }: AvatarProps) => {
  return avatarUrl ? (
    <FastImage
      source={{ uri: avatarUrl }}
      style={{ width: 100, height: 100 }}
    />
  ) : (
    <PlaceholderAvatar name={name} />
  );
};
