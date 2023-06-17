import { StyleSheet, Text, TextStyle } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";

export type TextVariant =
  | "heading"
  | "subheading"
  | "body"
  | "label"
  | "caption"
  | "link";

export interface ThemedTextProps {
  variant?: TextVariant;
  style?: TextStyle;
  children: string | React.ReactNode;
}

export const ThemedText = ({
  variant = "body",
  style,
  children,
  ...rest
}: ThemedTextProps) => {
  const theme = useTheme();
  const themedStyles = textStyles(theme);
  const variantStyle = themedStyles[variant];

  return (
    <Text style={[variantStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

const textStyles = (theme: Theme) =>
  StyleSheet.create({
    heading: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    subheading: {
      fontSize: 24,
      fontWeight: "500",
      color: theme.colors.text,
    },

    body: {
      fontSize: 16,
      fontWeight: "400",
      color: theme.colors.text,
    },
    label: {
      fontSize: 12,
      fontWeight: "400",
      color: theme.colors.text,
    },
    caption: {
      fontSize: 10,
      fontWeight: "300",
      color: theme.colors.text,
    },
    link: {
      fontSize: 16,
      fontWeight: "400",
      color: theme.colors.link,
    },
  });
