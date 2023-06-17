import { useInbox } from "../hooks/useInbox";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator } from "react-native";
import { InboxItem } from "@rn-app/components/messaging/InboxItem";
import { SegmentedButtons } from "react-native-paper";
import { useState } from "react";
import { useCurrentUser } from "@rn-app/pages/account/hooks/useAccount";

export const InboxScreen = () => {
  const [inboxType, setInboxType] = useState("inbox");
  const currentUser = useCurrentUser();
  const {
    data: messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInbox();

  const filteredMessages = messages?.pages
    .flatMap((p) => p.private_messages)
    .filter((m) =>
      inboxType === "inbox"
        ? m.creator.id !== currentUser?.id
        : m.creator.id === currentUser?.id
    );

  return (
    <>
      <SegmentedButtons
        value={inboxType}
        onValueChange={setInboxType}
        style={{ margin: 16 }}
        buttons={[
          {
            value: "inbox",
            label: "Inbox",
          },
          {
            value: "sent",
            label: "Sent",
          },
        ]}
      />
      <FlashList
        data={filteredMessages}
        estimatedItemSize={100}
        renderItem={({ item }) => <InboxItem message={item} />}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={() =>
          isLoading && !messages ? <ActivityIndicator /> : null
        }
        ListFooterComponent={isFetchingNextPage ? ActivityIndicator : null}
      />
    </>
  );
};
