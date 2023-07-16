import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@rn-app/components";
import { Button, Chip } from "react-native-paper";
import {
  useUserComments,
  useUserPosts,
  useUserProfile,
} from "../hooks/useCurrentUserProfile";
import { useCurrentUser } from "../hooks/useAccount";
import { View } from "react-native";
import { getShortActorId } from "@rn-app/utils/actorUtils";
import { Avatar } from "@rn-app/components";
import { LoadingActivityView } from "@rn-app/components/feed/LoadingActivityView";
import {
  CommentView,
  GetPersonDetailsResponse,
  PostView,
} from "lemmy-js-client";
import { FlashList } from "@shopify/flash-list";
import { PostCard } from "@rn-app/components/post/PostCard";
import { SegmentedButtons } from "react-native-paper";
import { useEffect, useState } from "react";
import { CommentItem } from "@rn-app/components/comment/CommentItem";
import { ProfileOverflowMenu } from "./ProfileOverflowMenu";

export const ProfileScreen = ({ route }) => {
  console.log("route", route);
  const { userId } = route.params ?? { userId: undefined };

  const currentSession = useCurrentUser({ enabled: !userId });

  return !!currentSession || userId ? (
    <LoggedInProfileScreen userId={userId ?? currentSession?.id} />
  ) : (
    <LoggedOutProfileScreen />
  );
};

const LoggedInProfileScreen = ({ userId }: { userId: number }) => {
  const { data: userProfile } = useUserProfile(userId);
  const currentSession = useCurrentUser({ enabled: !userId });
  const [currentView, setCurrentView] = useState<"posts" | "comments">("posts");
  const navigation = useNavigation();

  const {
    data: userPosts,
    isLoading: isLoadingPosts,
    hasNextPage: hasNextPostsPage,
    isFetchingNextPage: isFetchingNextPostsPage,
    fetchNextPage: fetchNextPostsPage,
    invalidate: invalidatePosts,
  } = useUserPosts(userId);

  console.log(userProfile);

  const {
    data: userComments,
    isLoading: isLoadingComments,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage,
    fetchNextPage: fetchNextCommentsPage,
    invalidate: invalidateComments,
  } = useUserComments(userId);

  useEffect(() => {
    if (
      !currentSession ||
      !userProfile ||
      userProfile?.person_view.person.id === currentSession.id
    ) {
      return;
    }
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          {userProfile && <ProfileOverflowMenu userProfile={userProfile} />}
        </View>
      ),
    });
  }, [userProfile]);

  const hasNextPage =
    currentView == "posts" ? hasNextPostsPage : hasNextCommentsPage;
  const fetchNextPage =
    currentView == "posts" ? fetchNextPostsPage : fetchNextCommentsPage;
  const isLoading = currentView == "posts" ? isLoadingPosts : isLoadingComments;
  const isFetchingNextPage =
    currentView == "posts"
      ? isFetchingNextPostsPage
      : isFetchingNextCommentsPage;
  const invalidate =
    currentView == "posts" ? invalidatePosts : invalidateComments;

  return (
    <FlashList<PostView | CommentView>
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={() => (
        <ProfileHeader
          userProfile={userProfile}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      )}
      estimatedItemSize={100}
      data={
        currentView == "posts"
          ? userPosts?.pages.flatMap((page) => page.posts) ?? []
          : userComments?.pages.flatMap((page) => page.comments) ?? []
      }
      renderItem={({ item }) =>
        currentView == "posts" ? (
          <PostCard key={item.post.id} post={item as PostView} />
        ) : (
          // TODO Include the post detail for the comment
          <CommentItem
            key={item.comment.id}
            comment={item as CommentView}
            indentDisabled
            swipeDisabled
            openPostOnTap
          />
        )
      }
      getItemType={(item) => (currentView == "posts" ? "post" : "comment")}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      ListFooterComponent={isFetchingNextPage ? LoadingActivityView : null}
      onRefresh={() => invalidate()}
      refreshing={isLoading && !!userPosts}
      ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
    />
  );
};

const ProfileHeader = ({
  userProfile,
  currentView,
  setCurrentView,
}: {
  userProfile?: GetPersonDetailsResponse;
  currentView: "posts" | "comments";
  setCurrentView: (currentView: "posts" | "comments") => void;
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        padding: 16,
      }}
    >
      <Avatar
        name={userProfile?.person_view.person.name ?? "?"}
        avatarUrl={userProfile?.person_view.person.avatar}
      />
      <ThemedText variant={"subheading"} style={{ marginTop: 10 }}>
        {userProfile?.person_view.person.name}
      </ThemedText>
      <ThemedText>
        @{getShortActorId(userProfile?.person_view.person.actor_id)}
      </ThemedText>

      <View style={{ flexDirection: "row", gap: 10, margin: 10 }}>
        <Chip icon="comment-text-multiple-outline">
          {userProfile?.person_view.counts.comment_score ?? 0}
        </Chip>
        <Chip icon="text">{userProfile?.person_view.counts.post_score}</Chip>
      </View>

      <SegmentedButtons
        value={currentView}
        onValueChange={(value) => setCurrentView(value as "posts" | "comments")}
        buttons={[
          {
            value: "posts",
            label: "Posts",
          },
          {
            value: "comments",
            label: "Comments",
          },
        ]}
      />
    </View>
  );
};

const LoggedOutProfileScreen = () => {
  const navigator = useNavigation();

  return (
    <>
      <ThemedText>Logged out</ThemedText>
      <Button onPress={() => navigator.navigate("Login")}>Add account</Button>
    </>
  );
};
