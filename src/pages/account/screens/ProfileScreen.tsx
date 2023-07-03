import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@rn-app/components";
import { Button } from "react-native-paper";
import {
  useUserComments,
  useUserPosts,
  useUserProfile,
} from "../hooks/useCurrentUserProfile";
import { useCurrentUser } from "../hooks/useAccount";
import { StyleSheet, View } from "react-native";
import { getShortActorId } from "@rn-app/utils/actorUtils";
import { Avatar } from "@rn-app/components";
import { Theme, useTheme } from "@rn-app/theme";
import { LoadingActivityView } from "@rn-app/components/feed/LoadingActivityView";
import {
  CommentView,
  GetPersonDetailsResponse,
  PostView,
} from "lemmy-js-client";
import { FlashList } from "@shopify/flash-list";
import { PostCard } from "@rn-app/components/post/PostCard";
import { SegmentedButtons } from "react-native-paper";
import { useState } from "react";
import { CommentItem } from "@rn-app/components/comment/CommentItem";

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
  const [currentView, setCurrentView] = useState<"posts" | "comments">("posts");

  const themedStyles = styles(useTheme());

  const {
    data: userPosts,
    isLoading: isLoadingPosts,
    hasNextPage: hasNextPostsPage,
    isFetchingNextPage: isFetchingNextPostsPage,
    fetchNextPage: fetchNextPostsPage,
    invalidate: invalidatePosts,
  } = useUserPosts(userId);

  const {
    data: userComments,
    isLoading: isLoadingComments,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage,
    fetchNextPage: fetchNextCommentsPage,
    invalidate: invalidateComments,
  } = useUserComments(userId);

  // TODO swap these when we switch between posts and comments
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
      ListHeaderComponent={() =>
        userProfile ? (
          <ProfileHeader
            userProfile={userProfile}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        ) : null
      }
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
    />
  );
};

const ProfileHeader = ({
  userProfile,
  currentView,
  setCurrentView,
}: {
  userProfile: GetPersonDetailsResponse;
  currentView: "posts" | "comments";
  setCurrentView: (currentView: "posts" | "comments") => void;
}) => {
  const themedStyles = styles(useTheme());
  return (
    <View
      style={{
        alignItems: "center",
        padding: 16,
      }}
    >
      <Avatar
        name={userProfile.person_view.person.name}
        avatarUrl={userProfile.person_view.person.avatar}
      />
      <ThemedText variant={"subheading"} style={{ marginTop: 10 }}>
        {userProfile.person_view.person.name}
      </ThemedText>
      <ThemedText>
        @{getShortActorId(userProfile.person_view.person.actor_id)}
      </ThemedText>

      <View style={themedStyles.statItem}>
        <ThemedText style={themedStyles.statItemTitle}>
          Comment count
        </ThemedText>
        <ThemedText>{userProfile.person_view.counts.comment_count}</ThemedText>
      </View>
      <View style={themedStyles.statItem}>
        <ThemedText style={themedStyles.statItemTitle}>
          Comment score
        </ThemedText>
        <ThemedText>{userProfile.person_view.counts.comment_score}</ThemedText>
      </View>
      <View style={themedStyles.statItem}>
        <ThemedText style={themedStyles.statItemTitle}>Post count</ThemedText>
        <ThemedText>{userProfile.person_view.counts.post_count}</ThemedText>
      </View>
      <View style={themedStyles.statItem}>
        <ThemedText style={themedStyles.statItemTitle}>Post score</ThemedText>
        <ThemedText>{userProfile.person_view.counts.post_score}</ThemedText>
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

const styles = (theme: Theme) =>
  StyleSheet.create({
    statItem: {
      flexDirection: "row",
      maxWidth: 400,
      justifyContent: "space-between",
      padding: 10,
    },
    statItemTitle: {
      flex: 1,
    },
  });
