import { useState, useEffect, useContext, createContext } from "react";
import { lightColors, darkColors, ThemeColors } from "./colors";
import { ThemeSizes } from "./dimens";
import { Appearance } from "react-native";

export type Theme = {
  isDark: boolean;
  colors: ThemeColors;
  sizes: typeof ThemeSizes;
  setScheme(scheme: Theme): void;
};

export const ThemeContext = createContext<Theme>({
  isDark: false,
  colors: lightColors,
  sizes: ThemeSizes,
  setScheme: (scheme: Theme) => {},
});

export const ThemeProvider = (props) => {
  // Getting the device color theme, this will also work with react-native-web
  const colorScheme = Appearance.getColorScheme(); // Can be dark | light | no-preference

  /*
   * To enable changing the app theme dynamicly in the app (run-time)
   * we're gonna use useState so we can override the default device theme
   */
  const [isDark, setIsDark] = useState(colorScheme === "dark");

  // Listening to changes of device appearance while in run-time
  useEffect(() => {
    setIsDark(colorScheme === "dark");
  }, [colorScheme]);

  const defaultTheme = {
    isDark,
    // Changing color schemes according to theme
    colors: isDark ? darkColors : lightColors,
    // Sizes are the same for all themes (currently)
    sizes: ThemeSizes,
    // Overrides the isDark value will cause re-render inside the context.
    setScheme: (scheme) => setIsDark(scheme === "dark"),
  };

  return (
    <ThemeContext.Provider value={defaultTheme}>
      {props.children}
    </ThemeContext.Provider>
  );
};

// Custom hook to get the theme object returns {isDark, colors, setScheme}
export const useTheme = () => useContext(ThemeContext);
