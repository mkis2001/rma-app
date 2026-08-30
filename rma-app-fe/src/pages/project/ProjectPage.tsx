import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { LoadingScreen } from "../../components/LoadingScreen";
import { Chip } from "../../components/chip/Chip";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { IconButton } from "../../components/pressable/IconButton";
import { BoldText } from "../../components/typography/boldText";
import { RegularText } from "../../components/typography/regularText";
import { getProjectSongs } from "../../services/ProjectService";
import { ProjectImage } from "./ProjectImage";

type Props = {
  route: RouteProp<RootStackParamList, "ProjectPage">;
};

export const ProjectPage = ({ route }: Props) => {
  const { project } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: songs, isFetching } = useQuery({
    queryKey: ["projectSongs", project.id],
    queryFn: () => getProjectSongs(project.id),
  });

  return isFetching ? (
    <LoadingScreen />
  ) : (
    <View style={{ flex: 1 }}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <BoldText>{project.name}</BoldText>
          <RegularText>{project.artist.name}</RegularText>
          <Chip label={project.type.name} />
        </View>
        <ProjectImage projectId={project.id} />
      </View>
      <RegularText>{project.description}</RegularText>
      {songs?.map((song) => (
        <View key={song.id}>
          <RegularText>{song.name}</RegularText>
        </View>
      ))}
      <View
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          icon="pen"
          onPress={() =>
            navigation.navigate("ProjectForm", { type: "edit", project })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
    gap: 5,
  },
});
