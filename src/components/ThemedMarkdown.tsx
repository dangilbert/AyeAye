import { Theme, useTheme } from "@rn-app/theme";
import { ReactNode } from "react";
import { StyleSheet, Platform } from "react-native";
import Markdown, { MarkdownProps } from "react-native-markdown-display";
import * as WebBrowser from "expo-web-browser";

export const ThemedMarkdown = ({
  children,
}: {
  children: ReactNode;
} & MarkdownProps) => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  return (
    <Markdown
      style={themedStyles}
      onLinkPress={(url) => {
        WebBrowser.openBrowserAsync(url);
        return false;
      }}
    >
      {children}
    </Markdown>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    // The main container
    body: {
      color: theme.colors.text,
      backgroundColor: "transparent",
    },
    text: {
      color: theme.colors.text,
    },

    // Headings
    heading1: {
      flexDirection: "row",
      fontSize: 32,
    },
    heading2: {
      flexDirection: "row",
      fontSize: 24,
    },
    heading3: {
      flexDirection: "row",
      fontSize: 18,
    },
    heading4: {
      flexDirection: "row",
      fontSize: 16,
    },
    heading5: {
      flexDirection: "row",
      fontSize: 13,
    },
    heading6: {
      flexDirection: "row",
      fontSize: 11,
    },

    // Horizontal Rule
    hr: {
      backgroundColor: theme.colors.text,
      height: 1,
    },

    // Emphasis
    strong: {
      fontWeight: "bold",
    },
    em: {
      fontStyle: "italic",
    },
    s: {
      textDecorationLine: "line-through",
    },

    // Blockquotes
    blockquote: {
      backgroundColor: theme.colors.blockquote.backgroundColor,
      borderColor: "#CCC",
      borderLeftWidth: 4,
      marginLeft: 5,
      paddingHorizontal: 5,
    },

    // Lists
    bullet_list: {},
    ordered_list: {},
    list_item: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    // @pseudo class, does not have a unique render rule
    bullet_list_icon: {
      marginLeft: 10,
      marginRight: 10,
    },
    // @pseudo class, does not have a unique render rule
    bullet_list_content: {
      flex: 1,
    },
    // @pseudo class, does not have a unique render rule
    ordered_list_icon: {
      marginLeft: 10,
      marginRight: 10,
    },
    // @pseudo class, does not have a unique render rule
    ordered_list_content: {
      flex: 1,
    },

    // Code
    code_inline: {
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: "#CCCCCC",
      backgroundColor: theme.colors.blockquote.backgroundColor,
      padding: 10,
      borderRadius: 4,
      ...Platform.select({
        ["ios"]: {
          fontFamily: "Courier",
        },
        ["android"]: {
          fontFamily: "monospace",
        },
      }),
    },
    code_block: {
      borderWidth: 1,
      borderColor: "#CCCCCC",
      backgroundColor: theme.colors.blockquote.backgroundColor,
      padding: 10,
      borderRadius: 4,
      ...Platform.select({
        ["ios"]: {
          fontFamily: "Courier",
        },
        ["android"]: {
          fontFamily: "monospace",
        },
      }),
    },
    fence: {
      borderWidth: 1,
      borderColor: "#CCCCCC",
      backgroundColor: theme.colors.blockquote.backgroundColor,
      padding: 10,
      borderRadius: 4,
      ...Platform.select({
        ["ios"]: {
          fontFamily: "Courier",
        },
        ["android"]: {
          fontFamily: "monospace",
        },
      }),
    },

    // Tables
    table: {
      borderWidth: 1,
      borderColor: "#000000",
      borderRadius: 3,
    },
    thead: {},
    tbody: {},
    th: {
      flex: 1,
      padding: 5,
    },
    tr: {
      borderBottomWidth: 1,
      borderColor: "#000000",
      flexDirection: "row",
    },
    td: {
      flex: 1,
      padding: 5,
    },

    // Links
    link: {
      textDecorationLine: "underline",
    },
    blocklink: {
      flex: 1,
      borderColor: "#000000",
      borderBottomWidth: 1,
    },

    // Images
    image: {
      flex: 1,
    },

    // Text Output
    textgroup: {},
    paragraph: {
      marginTop: 10,
      marginBottom: 10,
      flexWrap: "wrap",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: "100%",
    },
    hardbreak: {
      width: "100%",
      height: 1,
    },
    softbreak: {},

    // Believe these are never used but retained for completeness
    pre: {},
    inline: {},
    span: {},
  });