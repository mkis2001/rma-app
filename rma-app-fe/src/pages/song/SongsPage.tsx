import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { LoadingScreen } from "../../components/LoadingScreen";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { IconButton } from "../../components/pressable/IconButton";
import { MenuItem } from "../../components/pressable/menuItem";
import { ScrollableView } from "../../components/ScrollableView";
import { Header } from "../../components/typography/header";
import { getSongs } from "../../services/SongService";

type SongNavigation = NativeStackNavigationProp<RootStackParamList>;

export const SongsPage = () => {
  const navigation = useNavigation<SongNavigation>();

  const { data: songs, isLoading } = useQuery({
    queryKey: ["songs"],
    queryFn: () => getSongs(),
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Songs" />
      <ScrollableView>
        {songs?.map((song) => (
          <MenuItem
            key={song.id}
            title={song.name}
            secondaryTitle={song.project?.name}
            onPress={() => navigation.navigate("SongPage", { song })}
          />
        ))}
      </ScrollableView>
      <View style={{ display: "flex", alignItems: "flex-end" }}>
        <IconButton
          icon="plus"
          onPress={() => navigation.navigate("SongForm", { type: "create" })}
        />
      </View>
    </View>
  );
};
