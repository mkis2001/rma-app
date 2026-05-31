import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { LoadingScreen } from "../../components/LoadingScreen";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { MenuItem } from "../../components/pressable/menuItem";
import { ScrollableView } from "../../components/ScrollableView";
import { Header } from "../../components/typography/header";
import { getProjects } from "../../services/ProjectService";

type ProjectNavigation = NativeStackNavigationProp<RootStackParamList>;

export const ProjectsPage = () => {
  const navigation = useNavigation<ProjectNavigation>();

  const { data: projects, isFetching } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });

  return isFetching ? (
    <LoadingScreen />
  ) : (
    <View style={{ flex: 1 }}>
      <Header title="Projects" type="h1" />
      <ScrollableView>
        {projects?.map((project) => (
          <MenuItem
            key={project.id}
            title={project.name}
            secondaryTitle={`${project.artist.name} • ${project.type.name}`}
            onPress={() => navigation.navigate("ProjectPage", { project })}
          />
        ))}
      </ScrollableView>
      <MenuItem
        title="Start a new project"
        icon="circle-plus"
        onPress={() => navigation.navigate("ProjectForm", { type: "create" })}
      />
    </View>
  );
};
