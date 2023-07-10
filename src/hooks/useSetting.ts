import { storage } from "@rn-app/utils/storage";
import { useState } from "react";
import { useMMKVListener } from "react-native-mmkv";

export type setting =
  | "blur_nsfw"
  | "card_style"
  | "show_user_instance_names"
  | "show_community_instance_names"
  | "show_community_icons";

const defaults = {
  blur_nsfw: true,
  card_style: "compact",
  show_user_instance_names: false,
  show_community_instance_names: false,
  show_community_icons: true,
};

export const useStringSetting = (name: setting) => {
  const setValue = (value: string) => storage.set(`setting.${name}`, value);
  const [value, setInternalValue] = useState(() =>
    storage.getString(`setting.${name}`)
  );
  useMMKVListener((key) => {
    if (key !== `setting.${name}`) return;
    setInternalValue(storage.getString(`setting.${name}`));
  }, storage);
  return { value: value ?? (defaults[name] as string), setValue };
};

export const useBooleanSetting = (name: setting) => {
  const setValue = (value: boolean) => storage.set(`setting.${name}`, value);
  const [value, setInternalValue] = useState(
    storage.getBoolean(`setting.${name}`)
  );
  useMMKVListener((key) => {
    if (key !== `setting.${name}`) return;
    setInternalValue(storage.getBoolean(`setting.${name}`));
  }, storage);
  return { value: value ?? (defaults[name] as boolean), setValue };
};
