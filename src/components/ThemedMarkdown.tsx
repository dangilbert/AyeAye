import { Theme, useTheme } from "@rn-app/theme";
import { ReactNode } from "react";
import { StyleSheet, Platform, View } from "react-native";
import Markdown, {
  MarkdownProps,
  RenderRules,
} from "react-native-markdown-display";
import * as WebBrowser from "expo-web-browser";
import { Text } from "react-native-paper";
import { urlHost } from "@rn-app/utils/urlUtils";
import { typescale } from "@rn-app/theme/paper-copy/tokens";
import { ImagePopover } from "./post/media/ImagePopover";

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
      rules={rules}
    >
      {children}
    </Markdown>
  );
};

const rules = {
  image: (node) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: "white",
          borderRadius: 5,
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
          margin: 5,
        }}
        key={node.key}
      >
        <View style={{ width: 70, height: 70, margin: 10 }}>
          <ImagePopover
            uri={node.attributes.src}
            title={
              node.attributes.alt ??
              new URL(node.attributes.src).pathname.split("/").slice(-1)
            }
          />
        </View>
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          {!!node.attributes.alt?.length && (
            <Text
              style={{ marginEnd: 10, marginTop: 10 }}
              variant={"labelSmall"}
            >
              {node.attributes.alt}
            </Text>
          )}
          <Text
            variant={"labelSmall"}
            style={{ marginEnd: 10, marginBottom: 10 }}
          >
            {urlHost(node.attributes.src)}
          </Text>
        </View>
      </View>
    );
  },
} as RenderRules;

const styles = (theme: Theme) =>
  StyleSheet.create({
    // The main container
    body: {
      color: theme.colors.text,
      backgroundColor: "transparent",
      ...typescale.bodyMedium,
    },
    text: {
      color: theme.colors.text,
    },

    // Headings
    heading1: {
      flexDirection: "row",
      ...typescale.headlineLarge,
    },
    heading2: {
      flexDirection: "row",
      ...typescale.headlineMedium,
    },
    heading3: {
      flexDirection: "row",
      ...typescale.headlineSmall,
    },
    heading4: {
      flexDirection: "row",
      ...typescale.titleLarge,
    },
    heading5: {
      flexDirection: "row",
      ...typescale.titleMedium,
    },
    heading6: {
      flexDirection: "row",
      ...typescale.titleSmall,
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
      margin: 5,
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
      borderRadius: 5,
      margin: 5,
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
      borderRadius: 5,
      margin: 5,
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
