import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@rn-app/components/ThemedText";
import { useCommunities, useInstances } from "../hooks/useCommunities";
import { CommunityListItem } from "@rn-app/components/community/CommunityListItem";
import { Theme, useTheme } from "@rn-app/theme";
import { getShortActorId } from "@rn-app/utils/actorUtils";

export const CommunitiesScreen = ({ navigation }) => {
  const { data: communities } = useCommunities();
  const themedStyles = styles(useTheme());

  return (
    <ScrollView>
      <View style={themedStyles.sectionHeader}>
        <ThemedText variant="subheading">Communities@lemmy.ml</ThemedText>
      </View>
      <CommunityListItem
        key={"all@lemmy.ml"}
        name={`All@lemmy.ml`}
        customIcon="menu"
        onPress={() => {
          navigation.navigate("CommunityFeed", {
            communityId: undefined,
            communityType: "All",
          });
        }}
      />
      {communities &&
        communities.map((community) => {
          return (
            <CommunityListItem
              key={`community_${community.community.id}`}
              name={community.community.name}
              icon={community.community.icon}
              instanceName={getShortActorId(community.community.actor_id)}
              onPress={() => {
                navigation.navigate("CommunityFeed", {
                  communityId: community.community.id,
                });
              }}
            />
          );
        })}
    </ScrollView>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    sectionHeader: {
      padding: 10,
      backgroundColor: theme.colors.secondaryBackground,
    },
  });
