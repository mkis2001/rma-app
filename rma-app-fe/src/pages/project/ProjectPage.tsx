import { RouteProp } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { LoadingScreen } from "../../components/LoadingScreen";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { BoldText } from "../../components/typography/boldText";
import { RegularText } from "../../components/typography/regularText";
import { getProjectSongs } from "../../services/ProjectService";

type Props = {
  route: RouteProp<RootStackParamList, "ProjectPage">;
};

export const ProjectPage = ({ route }: Props) => {
  const { project } = route.params;

  const { data: songs, isFetching } = useQuery({
    queryKey: ["projectSongs", project.id],
    queryFn: () => getProjectSongs(project.id),
  });

  return isFetching ? (
    <LoadingScreen />
  ) : (
    <View>
      <BoldText>{project.name}</BoldText>
      <BoldText>{project.type.name}</BoldText>
      <RegularText>{project.description}</RegularText>
      {songs?.map((song) => (
        <View key={song.id}>
          <RegularText>{song.name}</RegularText>
        </View>
      ))}
    </View>
  );
};
