import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { View } from "react-native";
import { UserContext } from "../../../App";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { MenuItem } from "../../components/pressable/menuItem";
import { Header } from "../../components/typography/header";
import { supabase } from "../../services/Supabase";

type Navigation = NavigationProp<RootStackParamList>;

export const MainMenu = () => {
  const navigation = useNavigation<Navigation>();
  const claims = useContext(UserContext);

  return (
    <View>
      <Header type="h1" title={"Hello, " + (claims?.email || "User")} />
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
      <MenuItem
        title="Logout"
        icon="right-from-bracket"
        onPress={() => supabase.auth.signOut()}
      />
    </View>
  );
};
