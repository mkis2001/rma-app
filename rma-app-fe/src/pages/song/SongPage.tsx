import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { MenuItem } from "../../components/pressable/menuItem";
import { BoldText } from "../../components/typography/boldText";
import { Lyrics } from "../../components/typography/lyrics";
import { getSongFiles } from "../../services/SongService";

type Props = {
  route: RouteProp<RootStackParamList, "SongPage">;
};

export const SongPage = ({ route }: Props) => {
  const { song } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: files } = useQuery({
    queryKey: ["songFiles", song.id],
    queryFn: () => getSongFiles(song.id),
  });

  return (
    <View>
      <BoldText>{song.name}</BoldText>
      <BoldText>{song.project?.name}</BoldText>
      <Lyrics lyrics={song.lyrics} />
      <MenuItem
        title="Song Files"
        secondaryTitle={`${files?.length ?? 0} ${files?.length != undefined && files?.length % 10 === 1 ? "file" : "files"}`}
        icon="file"
        onPress={() =>
          navigation.navigate("SongFilesPage", { song, files: files ?? [] })
        }
      />
    </View>
  );
};
