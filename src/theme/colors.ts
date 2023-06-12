export type ThemeColors = {
  background: string;
  secondaryBackground: string;
  text: string;
  icon: string;
  iconActive: string;
  button: string;
  buttonText: string;
  linkText: string;
  border: string;
  commentIndentHighlight: string[];
};

// Light theme colors
export const lightColors = {
  background: "white",
  secondaryBackground: "#f2f2f2",
  text: "black",
  icon: "#e68a00",
  iconActive: "#e68a00",
  button: "black",
  buttonText: "#e68a00",
  linkText: "#e68a00",
  border: "#e68a00",
  // List of bright, not gray, colors for comment indent highlight
  commentIndentHighlight: ["#f2f200", "#e600e6", "#00d9d9", "#c0c0ff"],
};

// Dark theme colors
export const darkColors = {
  background: "black",
  secondaryBackground: "#1e1e1e",
  text: "#FFFFFF",
  icon: "white",
  iconActive: "#e68a00",
  button: "orange",
  buttonText: "black",
  linkText: "#e68a00",
  border: "#e68a00",
  commentIndentHighlight: ["#f2f200", "#e600e6", "#00d9d9", "#c0c0ff"],
};
