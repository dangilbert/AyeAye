import { storage } from "@rn-app/utils/storage";
import { useState } from "react";
import { useMMKVListener } from "react-native-mmkv";

type setting = "blur_nsfw" | "card_style";

export const useStringSetting = (name: setting, defaultValue: string) => {
  const setValue = (value: string) => storage.set(`setting.${name}`, value);
  const [value, setInternalValue] = useState(() =>
    storage.getString(`setting.${name}`)
  );
  useMMKVListener((key) => {
    if (key !== `setting.${name}`) return;
    setInternalValue(storage.getString(`setting.${name}`));
  }, storage);
  return { value: value ?? defaultValue, setValue };
};

export const useBooleanSetting = (name: setting, defaultValue: boolean) => {
  const setValue = (value: boolean) => storage.set(`setting.${name}`, value);
  const [value, setInternalValue] = useState(
    storage.getBoolean(`setting.${name}`)
  );
  useMMKVListener((key) => {
    if (key !== `setting.${name}`) return;
    setInternalValue(storage.getBoolean(`setting.${name}`));
  }, storage);
  return { value: value ?? defaultValue, setValue };
};
