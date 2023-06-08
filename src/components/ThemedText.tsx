import { StyleSheet, Text } from "react-native";
import { Theme, useTheme } from "../theme";

export type TextVariant = "heading" | "subheading" | "body" | "label";

export interface ThemedTextProps {
  variant?: TextVariant;
  children: string | React.ReactNode;
}

export const ThemedText = ({ variant = "body", children }: ThemedTextProps) => {
  const theme = useTheme();
  const themedStyles = textStyles(theme);
  const variantStyle = themedStyles[variant];

  return <Text style={variantStyle}>{children}</Text>;
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
  });
