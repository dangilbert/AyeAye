import { ReactNode } from "react";
import { Text, TextStyle } from "react-native";
import { Renderer } from "react-native-marked";
import type { RendererInterface } from "react-native-marked";
import * as WebBrowser from "expo-web-browser";

class CustomRenderer extends Renderer implements RendererInterface {
  constructor() {
    super();
  }

  link(
    children: string | ReactNode[],
    href: string,
    styles?: TextStyle | undefined
  ): ReactNode {
    console.log("link", children, href, styles);
    return (
      <Text
        selectable
        accessibilityRole="link"
        accessibilityHint="Opens in a new window"
        key={this.getKey()}
        onPress={() => WebBrowser.openBrowserAsync(href)}
        style={styles}
      >
        {children}
      </Text>
    );
  }
}

export const customMarkdownRenderer = new CustomRenderer();
