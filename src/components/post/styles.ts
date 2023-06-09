import { Theme } from "@rn-app/theme";
import { StyleSheet } from "react-native";

export const markdownStyles = (theme: Theme) =>
  StyleSheet.create({
    h1: {
      color: theme.colors.text,
      fontSize: theme.sizes.text.heading,
      fontWeight: "bold",
    },
    h2: {
      color: theme.colors.text,
      fontSize: theme.sizes.text.subheading,
      fontWeight: "bold",
    },
    text: {
      color: theme.colors.text,
      fontSize: theme.sizes.text.body,
    },
    strong: {
      color: theme.colors.text,
      fontSize: theme.sizes.text.body,
      fontWeight: "bold",
    },
    li: {
      color: theme.colors.text,
      paddingVertical: 4,
    },
  });
