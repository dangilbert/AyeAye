import { ThemedText } from "../ThemedText";

export const EndOfContentView = () => {
  return (
    <>
      <ThemedText
        variant="subheading"
        style={{ textAlign: "center", margin: 10 }}
      >
        You've reached the end of Lemmy
      </ThemedText>
      <ThemedText variant="body" style={{ textAlign: "center", margin: 10 }}>
        Maybe there's new stuff back at the top?
      </ThemedText>
    </>
  );
};
