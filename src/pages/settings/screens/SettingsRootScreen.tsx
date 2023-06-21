import { ThemedText } from "@rn-app/components";
import { setting, useBooleanSetting } from "@rn-app/hooks/useSetting";
import { Theme, useTheme } from "@rn-app/theme";
import {
  Image,
  SectionList,
  SectionListData,
  SectionListRenderItem,
  SectionListRenderItemInfo,
  StyleSheet,
  View,
} from "react-native";
import { Switch } from "react-native-paper";

interface SettingItem {
  type: "switch" | "multi-option" | "static";
  displayName: string;
  disabled?: boolean;
}

interface StaticSettingItem {
  type: "static";
  view: (isFirstElement: boolean, isLastElement: boolean) => JSX.Element;
}

interface SwitchSetting extends SettingItem {
  type: "switch";
  settingKey: setting;
}

interface MultiOptionSetting extends SettingItem {
  type: "multi-option";
  settingKey: setting;
  options: [{ name: string; value: string }];
}

interface Section {
  title: string;
  icon: string;
  data: readonly (SwitchSetting | MultiOptionSetting)[];
}

type SectionListItemTypes =
  | SwitchSetting
  | MultiOptionSetting
  | StaticSettingItem;

const renderItem: SectionListRenderItem<SectionListItemTypes, Section> = ({
  index,
  section,
  item,
}: SectionListRenderItemInfo<SectionListItemTypes>) => {
  const isFirstElement = index === 0;
  const isLastElement = index === section.data.length - 1;

  const themedStyles = styles(useTheme());

  let renderItem;
  switch (item.type) {
    case "switch":
      renderItem = (
        <SwitchSettingsListItem
          item={item}
          isFirstElement={isFirstElement}
          isLastElement={isLastElement}
        />
      );
      break;
    case "multi-option":
      renderItem = (
        <MultiOptionSettingsListItem
          item={item}
          isFirstElement={isFirstElement}
          isLastElement={isLastElement}
        />
      );
      break;
    case "static":
      renderItem = item.view(isFirstElement, isLastElement);
      break;
  }

  return (
    <View
      style={[
        themedStyles.settingsItem,
        isFirstElement && themedStyles.settingsItemFirst,
        isLastElement && themedStyles.settingsItemLast,
      ]}
    >
      {renderItem}
    </View>
  );
};

const renderSectionHeader = ({
  section,
}: {
  section: SectionListData<SectionListItemTypes, Section>;
}) => {
  return <SettingsListSectionHeader icon={section.icon} section={section} />;
};

const sections = [
  {
    title: "Appearance",
    icon: "eye",
    data: [
      {
        type: "switch",
        settingKey: "blur_nsfw",
        displayName: "Blur NSFW in feed",
      },
      {
        type: "switch",
        settingKey: "show_user_instance_names",
        displayName: "Show user instance names",
      },
      {
        type: "switch",
        settingKey: "show_community_instance_names",
        displayName: "Show community instance names",
      },
      {
        type: "switch",
        settingKey: "show_community_icons",
        displayName: "Show community icons",
      },
    ],
  },
  {
    title: "About",
    icon: "eye",
    data: [
      {
        type: "static",
        view: () => <AboutSection />,
      },
    ],
  },
] as Section[];

export const SettingsRootScreen = () => {
  const themedStyles = styles(useTheme());

  return (
    <SectionList
      sections={sections}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.5}
      ItemSeparatorComponent={() => <View style={themedStyles.divider} />}
      keyExtractor={(it) => JSON.stringify(it)}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={false}
    />
  );
};

const SwitchSettingsListItem = ({
  item,
}: {
  item: SwitchSetting;
  isFirstElement: boolean;
  isLastElement: boolean;
}) => {
  const themedStyles = styles(useTheme());

  const { value, setValue } = useBooleanSetting(item.settingKey);

  return (
    <View style={themedStyles.settingsRow}>
      <ThemedText>{item.displayName}</ThemedText>
      <Switch onValueChange={() => setValue(!value)} value={value} />
    </View>
  );
};

const MultiOptionSettingsListItem = ({
  item,
}: {
  item: MultiOptionSetting;
  isFirstElement: boolean;
  isLastElement: boolean;
}) => {
  return <></>;
};

const SettingsListSectionHeader = ({
  icon,
  section,
}: {
  icon: string;
  section: Section;
}) => {
  const themedStyles = styles(useTheme());

  return (
    <ThemedText variant="subheading" style={themedStyles.sectionHeader}>
      {section.title}
    </ThemedText>
  );
};

const AboutSection = () => {
  const themedStyles = styles(useTheme());
  return (
    <>
      <Image
        source={require("@rn-app/../assets/icon.png")}
        style={themedStyles.appIcon}
      />
      <ThemedText>An item for the about section</ThemedText>
    </>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    sectionHeader: {
      padding: 10,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.background,
    },
    settingsItem: {
      padding: 10,
      backgroundColor: theme.colors.secondaryBackground,
      marginHorizontal: 10,
    },
    settingsItemFirst: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    settingsItemLast: {
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    settingsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    appIcon: {
      width: 80,
      height: 80,
      alignSelf: "center",
      borderRadius: 50,
      margin: 10,
    },
  });
