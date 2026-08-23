import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { LoadingScreen } from "../../components/LoadingScreen";
import { ScrollableView } from "../../components/ScrollableView";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { MenuItem } from "../../components/pressable/menuItem";
import { Header } from "../../components/typography/header";
import { getArtists } from "../../services/ArtistService";

type ArtistNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "ArtistPage"
>;

export const ArtistsPage = () => {
  const navigation = useNavigation<ArtistNavigation>();

  const { data: artists, isLoading } = useQuery({
    queryKey: ["artists"],
    queryFn: () => getArtists(),
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Artist Page" />
      <ScrollableView>
        {artists?.map((artist) => (
          <MenuItem
            key={artist.id}
            title={artist.name}
            secondaryTitle={`${artist.users.length} members`}
            onPress={() => navigation.navigate("ArtistPage", { artist })}
          />
        ))}
        <MenuItem
          title="Create a new artist"
          icon="circle-plus"
          onPress={() => navigation.navigate("ArtistForm", { type: "create" })}
        />
      </ScrollableView>
    </View>
  );
};
