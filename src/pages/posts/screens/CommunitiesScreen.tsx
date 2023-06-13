import { ActivityIndicator, StyleSheet } from "react-native";
import { useCommunities } from "../hooks/useCommunities";
import { CommunityListItem } from "@rn-app/components/community/CommunityListItem";
import { Theme } from "@rn-app/theme";
import { getShortActorId } from "@rn-app/utils/actorUtils";
import { FlashList } from "@shopify/flash-list";
import { useCurrentUser } from "@rn-app/pages/account/hooks/useAccount";

export const CommunitiesScreen = ({ navigation }) => {
  const { data: communities, isLoading, invalidate } = useCommunities();

  const currentUser = useCurrentUser();

  const builtInCommunities = [];

  const allItem = {
    community: {
      id: undefined,
      name: "All",
      customIcon: "menu",
      communityType: "All",
      actor_id: currentUser?.instance ?? "https://lemmy.ml",
    },
  };
  builtInCommunities.push(allItem);

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
    builtInCommunities.push(subscribedItem);
  }

  return (
    <FlashList
      data={communities && [...builtInCommunities, ...(communities ?? [])]}
      onRefresh={() => {
        invalidate();
      }}
      refreshing={isLoading && !!communities}
      estimatedItemSize={60}
      ListHeaderComponent={() =>
        isLoading && !communities ? <ActivityIndicator /> : null
      }
      renderItem={({ item }) => {
        return (
          <CommunityListItem
            key={`community_${item.community.id}`}
            name={item.community.name}
            customIcon={item.community.customIcon}
            icon={item.community.icon}
            instanceName={getShortActorId(item.community.actor_id)}
            onPress={() => {
              navigation.navigate("CommunityFeed", {
                communityId: item.community.id,
                communityType: item.community.communityType,
              });
            }}
          />
        );
      }}
    />
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    sectionHeader: {
      padding: 10,
      backgroundColor: theme.colors.secondaryBackground,
    },
  });
