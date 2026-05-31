import { RouteProp } from "@react-navigation/native";
import { View } from "react-native";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { BoldText } from "../../components/typography/boldText";
import { Lyrics } from "../../components/typography/lyrics";

type Props = {
  route: RouteProp<RootStackParamList, "SongPage">;
};

export const SongPage = ({ route }: Props) => {
  const { song } = route.params;

  return (
    <View>
      <BoldText>{song.name}</BoldText>
      <BoldText>{song.project?.name}</BoldText>
      <Lyrics lyrics={song.lyrics} />
    </View>
  );
};
