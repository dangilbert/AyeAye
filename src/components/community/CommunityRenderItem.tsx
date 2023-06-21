import { useNavigation } from "@react-navigation/native";
import { CommunityListItem } from "./CommunityListItem";
import { getShortActorId } from "@rn-app/utils/actorUtils";

export type CommunityListItemType =
  | CommunityItem
  | SectionHeader
  | "CommunityTypeSelector";
export type CommunityItem = {
  community: {
    id?: string;
    name: string;
    customIcon?: string;
    icon?: string;
    communityType: string;
    actor_id?: string;
    instanceName?: string;
  };
};

export type SectionHeader = {
  sectionTitle: string;
};

export const CommunityRenderItem = ({ item }: { item: CommunityItem }) => {
  const navigation = useNavigation();
  return (
    <CommunityListItem
      key={`community_${item.community.id}`}
      name={item.community.name}
      title={item.community.title}
      customIcon={item.community.customIcon}
      icon={item.community.icon}
      instanceName={getShortActorId(item.community.actor_id)}
      actorId={item.community.actor_id}
      onPress={() => {
        navigation.navigate("CommunityFeed", {
          communityId: item.community.id,
          communityType: item.community.communityType,
        });
      }}
    />
  );
};
