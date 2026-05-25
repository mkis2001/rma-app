import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { MenuItem } from "../../components/pressable/menuItem";
import { Header } from "../../components/typography/header";
import { RegularText } from "../../components/typography/regularText";
import { getProjects } from "../../services/ProjectService";

type ProjectNavigation = {
  navigate: (
    screen: "ProjectForm",
    params: RootStackParamList["ProjectForm"],
  ) => void;
};
export const Project = () => {
  const navigation = useNavigation<ProjectNavigation>();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["project"],
    queryFn: () => getProjects(),
  });

  return (
    !isLoading && (
      <View>
        <Header title="Project" type="h1" />
        <View>
          {projects?.map((project) => (
            <RegularText key={project.id}>{project.name}</RegularText>
          ))}
        </View>
        <MenuItem
          title="Start a new project"
          icon="circle-plus"
          onPress={() => navigation.navigate("ProjectForm", { type: "create" })}
        />
      </View>
    )
  );
};
