import { useEffect } from "react";
import { AppState } from "react-native";

export function useAppState(onChange: any) {
  useEffect(() => {
    let listener: any;
    listener = AppState.addEventListener("change", onChange);
    return () => {
      listener?.removeEventListener?.invoke("change", onChange);
    };
  }, [onChange]);
}
