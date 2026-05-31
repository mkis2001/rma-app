import { NavigationProp, useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { MenuItem } from "../../components/pressable/menuItem";
import { Header } from "../../components/typography/header";

type Navigation = NavigationProp<RootStackParamList>;

export const MainMenu = () => {
  const navigation = useNavigation<Navigation>();
  const title = "Welcome back!";

  return (
    <View>
      <Header type="h1" title={title} />
      <MenuItem
        title="Projects"
        icon="record-vinyl"
        onPress={() => navigation.navigate("ProjectsPage")}
      />
      <MenuItem
        title="Songs"
        icon="music"
        onPress={() => navigation.navigate("SongsPage")}
      />
      <MenuItem title="Collaborators" icon="people-group" onPress={() => {}} />
      <MenuItem title="Profile" icon="user-large" onPress={() => {}} />
      <MenuItem title="Settings" icon="gear" onPress={() => {}} />
    </View>
  );
};
