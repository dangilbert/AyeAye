import { ComponentType, ReactNode } from "react";
import { MarkdownProps } from "react-native-markdown-display";

declare module "react-native-youtube-iframe";
declare module "react-native-youtube-iframe-player";

declare module "react-native-markdown-display" {
  export const ExtendedMarkdown: ComponentType<
    {
      children: ReactNode;
    } & MarkdownProps
  >;
  export = ExtendedMarkdown;
}
