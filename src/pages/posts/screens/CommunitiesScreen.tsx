import { StyleSheet } from "react-native";
import { useCommunities } from "../hooks/useCommunities";
import { CommunityListItem } from "@rn-app/components/community/CommunityListItem";
import { Theme } from "@rn-app/theme";
import { getShortActorId } from "@rn-app/utils/actorUtils";
import { FlashList } from "@shopify/flash-list";

export const CommunitiesScreen = ({ navigation }) => {
  const { data: communities, isLoading, invalidate } = useCommunities();

  const allItem = {
    community: {
      id: undefined,
      name: "All",
      customIcon: "menu",
      communityType: "All",
      actor_id: "https://lemmy.ml",
    },
  };

  return (
    <FlashList
      data={[allItem, ...(communities ?? [])]}
      onRefresh={() => {
        invalidate();
      }}
      refreshing={isLoading}
      estimatedItemSize={60}
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
