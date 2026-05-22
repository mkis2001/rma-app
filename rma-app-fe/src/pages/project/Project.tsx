import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { MenuItem } from "../../components/pressable/menuItem";
import { Header } from "../../components/typography/header";

type ProjectNavigation = {
  navigate: (
    screen: "ProjectForm",
    params: RootStackParamList["ProjectForm"],
  ) => void;
};
export const Project = () => {
  const navigation = useNavigation<ProjectNavigation>();

  return (
    <View>
      <Header title="Project" type="h1" />
      <MenuItem
        title="Start a new project"
        icon="circle-plus"
        onPress={() => navigation.navigate("ProjectForm", { type: "create" })}
      />
    </View>
  );
};
