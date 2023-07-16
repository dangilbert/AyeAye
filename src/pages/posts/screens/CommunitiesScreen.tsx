import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useCommunities } from "../hooks/useCommunities";
import { Theme, useTheme } from "@rn-app/theme";
import { FlashList } from "@shopify/flash-list";
import { useCurrentUser } from "@rn-app/pages/account/hooks/useAccount";
import { ThemedText } from "@rn-app/components";
import {
  CommunityItem,
  CommunityListItemType,
  CommunityRenderItem,
} from "@rn-app/components/community/CommunityRenderItem";

export const CommunitiesScreen = () => {
  const themedStyles = styles(useTheme());
  const currentUser = useCurrentUser({ enabled: true });

  const {
    data: communities,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    invalidate,
  } = useCommunities(!!currentUser ? "Subscribed" : "All");

  // Fetch all the user's subscribed communities
  if (!!currentUser && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  const communitiesList: CommunityListItemType[] = [];

  communitiesList.push({ sectionTitle: "Feeds" });

  const allItem = {
    community: {
      id: undefined,
      name: "All",
      customIcon: "menu",
      communityType: "All",
      actor_id: currentUser?.instance ?? "https://lemmy.ml",
    },
  };
  communitiesList.push(allItem);

  const localItem = {
    community: {
      id: undefined,
      name: "Local",
      customIcon: "local-activity",
      communityType: "Local",
      actor_id: currentUser?.instance ?? "https://lemmy.ml",
    },
  };
  communitiesList.push(localItem);

  if (currentUser) {
    const subscribedItem = {
      community: {
        id: undefined,
        name: "Subscribed",
        customIcon: "multitrack-audio",
        communityType: "Subscribed",
        actor_id: currentUser.instance,
      },
    };
    communitiesList.push(subscribedItem);
  }

  if (!!currentUser) {
    communitiesList.push({ sectionTitle: "Subscribed Communities" });
  } else {
    communitiesList.push({ sectionTitle: "Top Communities" });
  }

  communities?.sort((a, b) => {
    if (a.community.name.toLowerCase() < b.community.name.toLowerCase()) {
      return -1;
    }
    if (a.community.name.toLowerCase() > b.community.name.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  const firstLetters = new Set<string>();

  communities?.forEach((community) => {
    if (!firstLetters.has(community.community.name[0].toUpperCase())) {
      firstLetters.add(community.community.name[0].toUpperCase());
      communitiesList.push({
        sectionTitle: community.community.name[0].toUpperCase(),
      });
    }
    communitiesList.push(community);
  });

  return (
    <FlashList
      keyboardShouldPersistTaps="handled"
      data={communities && [...communitiesList]}
      onRefresh={() => {
        invalidate();
      }}
      refreshing={isLoading && !!communities}
      estimatedItemSize={60}
      ListHeaderComponent={() =>
        isLoading && !communities ? <ActivityIndicator /> : null
      }
      renderItem={({ item }) => {
        if (Object.keys(item).includes("sectionTitle")) {
          return (
            <View style={themedStyles.sectionHeader}>
              <ThemedText>{(item as unknown as any).sectionTitle}</ThemedText>
            </View>
          );
        }
        switch (item) {
          default:
            return (
              <CommunityRenderItem item={item as unknown as CommunityItem} />
            );
        }
      }}
      onEndReached={() => {
        if (!!currentUser && hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? ActivityIndicator : null}
    />
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    sectionHeader: {
      padding: 10,
      backgroundColor: theme.colors.secondaryBackground,
    },
    container: {
      padding: 16,
    },
    dropdown: {
      height: 50,
      borderColor: "gray",
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      backgroundColor: theme.colors.secondaryBackground,
    },
    dropdownItemContainer: {
      borderColor: "gray",
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      backgroundColor: theme.colors.secondaryBackground,
    },
    selectedTextStyle: {
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors.secondaryBackground,
    },
  });
