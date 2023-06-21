import { Theme } from "@rn-app/theme";
import { customMarkdownRenderer } from "@rn-app/utils/CustomMarkdownRenderer";
import { StyleSheet } from "react-native";

export const markdownDefaultOptions = (theme: Theme, customStyles?: any) => ({
  styles: { ...markdownStyles(theme), ...customStyles },
  renderer: customMarkdownRenderer,
});

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
    h3: {
      color: theme.colors.text,
      fontSize: theme.sizes.text.label,
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
    em: {
      color: theme.colors.text,
      fontStyle: "italic",
    },
  });
