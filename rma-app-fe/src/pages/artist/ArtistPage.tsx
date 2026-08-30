import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "react-native";
import { ScrollableView } from "../../components/ScrollableView";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { IconButton } from "../../components/pressable/IconButton";
import { MenuItem } from "../../components/pressable/menuItem";
import { BoldText } from "../../components/typography/boldText";

type Props = {
  route: RouteProp<RootStackParamList, "ArtistPage">;
};

type ArtistNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "ArtistPage"
>;

export const ArtistPage = ({ route }: Props) => {
  const navigation = useNavigation<ArtistNavigation>();
  const { artist } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <BoldText>{artist.name}</BoldText>
      <ScrollableView>
        <BoldText>{artist.description}</BoldText>
        {artist.users?.map((user) => (
          <BoldText key={user.id}>{user.username}</BoldText>
        ))}
      </ScrollableView>
      <MenuItem
        title="Manage users"
        onPress={() => {
          navigation.navigate("ArtistManageUsers", { artist });
        }}
      />
      <View style={{ display: "flex", alignItems: "flex-end" }}>
        <IconButton
          icon="pen"
          onPress={() =>
            navigation.navigate("ArtistForm", { type: "edit", artist })
          }
        />
      </View>
    </View>
  );
};
