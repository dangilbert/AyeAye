import { ThemedText } from "./ThemedText";

export const LoggedOutEmptyView = () => {
  return (
    <>
      <ThemedText variant="heading">No user account</ThemedText>
      <ThemedText variant="body">Log in to see content</ThemedText>
    </>
  );
};
