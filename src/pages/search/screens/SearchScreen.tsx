import { ThemedText } from "@rn-app/components";
import { CommunityRenderItem } from "@rn-app/components/community/CommunityRenderItem";
import { useCommunities } from "@rn-app/pages/posts/hooks/useCommunities";
import { CommunityType } from "@rn-app/pods/communities/queries";
import { Theme, useTheme } from "@rn-app/theme";
import { storage } from "@rn-app/utils/storage";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { ActivityIndicator, TextInput } from "react-native-paper";

type CommunityListItemType =
  | CommunityItem
  | SectionHeader
  | "CommunityTypeSelector";
type CommunityItem = {
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
type SectionHeader = {
  sectionTitle: string;
};

export const SearchScreen = () => {
  const themedStyles = styles(useTheme());

  const [communityTypeSelector, setCommunityTypeSelector] =
    useState<CommunityType>("All");
  const {
    data: communities,
    isLoading,
    invalidate,
  } = useCommunities(communityTypeSelector);

  const communitiesList: CommunityListItemType[] = [];

  communitiesList.push({ sectionTitle: "Communities" });
  communitiesList.push("CommunityTypeSelector");

  communities?.sort((a, b) => {
    if (a.community.name < b.community.name) {
      return -1;
    }
    if (a.community.name > b.community.name) {
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
    <>
      <TextInput />
      <FlashList
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
            case "CommunityTypeSelector":
              return (
                <CommunityTypeSelectorRenderItem
                  updateCommunityTypeSelector={setCommunityTypeSelector}
                />
              );
            default:
              return <CommunityRenderItem item={item} />;
          }
        }}
      />
    </>
  );
};

const CommunityTypeSelectorRenderItem = ({
  updateCommunityTypeSelector,
}: {
  updateCommunityTypeSelector: (type: CommunityType) => void;
}) => {
  const data = [
    { label: "All", value: "All" },
    { label: "Subscribed", value: "Subscribed" },
    { label: "Local", value: "Local" },
  ];

  const [value, setValue] = useState(
    storage.getString("communityTypeSelector") ?? "All"
  );

  const themedStyles = styles(useTheme());

  return (
    <View style={themedStyles.container}>
      <Dropdown
        style={themedStyles.dropdown}
        selectedTextStyle={themedStyles.selectedTextStyle}
        itemContainerStyle={themedStyles.dropdownItemContainer}
        itemTextStyle={themedStyles.selectedTextStyle}
        activeColor={themedStyles.selectedTextStyle.backgroundColor}
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        onChange={(item) => {
          storage.set("communityTypeSelector", item.value);
          setValue(item.value);
          updateCommunityTypeSelector(item.value as CommunityType);
        }}
      />
    </View>
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
