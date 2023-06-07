import { useEffect } from "react";
import { AppState } from "react-native";

export function useAppState(onChange) {
  useEffect(() => {
    let listener;
    listener = AppState.addEventListener("change", onChange);
    return () => {
      listener?.removeEventListener?.invoke("change", onChange);
    };
  }, [onChange]);
}
