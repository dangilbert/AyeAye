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
  blockquote: {
    backgroundColor: string;
  };
  vote: {
    upvoteBackgroundColor: string;
    downvoteBackgroundColor: string;
  };
  image: {
    placeholder: {
      backgroundColor: string;
    };
  };
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
  border: "#cccccc",
  // List of bright, not gray, colors for comment indent highlight
  commentIndentHighlight: [
    "#ed8080",
    "#edcc80",
    "#c3ed80",
    "#80ed89",
    "#80edd5",
    "80baed",
    "#9280ed",
  ],
  blockquote: {
    backgroundColor: "#e2e2e2",
  },
  vote: {
    upvoteBackgroundColor: "#80ed89",
    downvoteBackgroundColor: "#ed8080",
  },
  image: {
    placeholder: {
      backgroundColor: "#444444",
    },
  },
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
  border: "#555555",
  commentIndentHighlight: [
    "#ed8080",
    "#edcc80",
    "#c3ed80",
    "#80ed89",
    "#80edd5",
    "80baed",
    "#9280ed",
  ],
  blockquote: {
    backgroundColor: "#424242",
  },
  vote: {
    upvoteBackgroundColor: "#80ed89",
    downvoteBackgroundColor: "#ed8080",
  },
  image: {
    placeholder: {
      backgroundColor: "#444444",
    },
  },
};
