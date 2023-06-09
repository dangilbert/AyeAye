import { Button } from "react-native";
import { ThemedText } from "@rn-app/components/ThemedText";
import { LemmyHttp, CommunityView } from "lemmy-js-client";
import { useEffect, useState } from "react";

export const CommunitiesScreen = ({ navigation }) => {
  const [communities, setCommunities] = useState<CommunityView[]>();

  useEffect(() => {
    (async () => {
      try {
        let client: LemmyHttp = new LemmyHttp("https://lemmy.ml");
        const res = await client.listCommunities({
          type_: "All",
        });

        setCommunities(res.communities);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [setCommunities]);

  return (
    <>
      <ThemedText variant="subheading">Communities@lemmy.ml</ThemedText>
      <Button
        key={"all@lemmy.ml"}
        title={`All@lemmy.ml`}
        onPress={() => {
          navigation.navigate("CommunityFeed", {
            communityId: undefined,
          });
        }}
      />
      {communities &&
        communities.map((community) => {
          return (
            <Button
              key={community.community.id}
              title={`${community.community.name}@${community.community.instance_id}`}
              onPress={() => {
                navigation.navigate("CommunityFeed", {
                  communityId: community.community.id,
                });
              }}
            />
          );
        })}
    </>
  );
};
