import { RouteProp, useNavigation } from "@react-navigation/native";
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

type Props = {
  route: RouteProp<RootStackParamList, "SongsPage">;
};

export const SongsPage = ({ route }: Props) => {
  const navigation = useNavigation<SongNavigation>();

  const projectId = route.params?.projectId;
  const projectName = route.params?.projectName;

  const { data: songs, isLoading } = useQuery({
    queryKey: ["songs", { projectId }],
    queryFn: () => getSongs(projectId !== undefined ? { projectId } : undefined),
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Songs" subheader={projectName} />
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
