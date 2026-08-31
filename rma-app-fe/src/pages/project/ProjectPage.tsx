import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, View } from "react-native";
import { LoadingScreen } from "../../components/LoadingScreen";
import { Chip } from "../../components/chip/Chip";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { IconButton } from "../../components/pressable/IconButton";
import { SongsButton } from "../../components/pressable/SongsButton";
import { BoldText } from "../../components/typography/boldText";
import { Header } from "../../components/typography/header";
import { RegularText } from "../../components/typography/regularText";
import { getProjectSongs } from "../../services/ProjectService";
import { colors, measures } from "../../theme";
import { ProjectImage } from "./ProjectImage";

type Props = {
  route: RouteProp<RootStackParamList, "ProjectPage">;
};

const projectTypeColor: { [key: string]: string } = {
  Album: colors.blue,
  EP: colors.accent,
  Single: colors.error,
  Demo: colors.orange,
  Split: colors.textLighter,
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
      <Header title={project.name} subheader={"Project"} />
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.headerLeftTop}>
            <RegularText>
              by <BoldText>{project.artist.name}</BoldText>
            </RegularText>
            <Chip
              label={project.type.name}
              backgroundColor={projectTypeColor[project.type.name] || "gray"}
            />
          </View>
          <SongsButton count={songs?.length ?? 0} />
        </View>
        <View style={styles.imageWrapper}>
          <ProjectImage projectId={project.id} />
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <RegularText style={styles.descriptionHeader}>Description</RegularText>
        <ScrollView showsVerticalScrollIndicator={false}>
          <RegularText>{project.description}</RegularText>
        </ScrollView>
      </View>
      <View style={styles.footer}>
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
  footer: {
    alignItems: "flex-end",
    marginTop: "auto",
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerLeftTop: {
    gap: 10,
  },
  imageWrapper: {
    flex: 1,
    aspectRatio: 1,
  },
  descriptionHeader: {
    fontFamily: "SNPro-Italic",
    color: colors.textLighter,
    fontSize: 14,
  },
  descriptionContainer: {
    flexShrink: 1,
    backgroundColor: colors.backgroundDarker,
    padding: measures.padding,
    borderRadius: measures.radius,
  },
});
