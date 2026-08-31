import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { View } from "react-native";
import { UserContext } from "../../../App";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { MenuItem } from "../../components/pressable/menuItem";
import { Header } from "../../components/typography/header";
import { supabase } from "../../services/Supabase";
import { getUserById } from "../../services/UserService";

type Navigation = NavigationProp<RootStackParamList>;

export const MainMenu = () => {
  const navigation = useNavigation<Navigation>();
  const claims = useContext(UserContext);

  const { data: user } = useQuery({
    queryKey: ["user", claims?.sub],
    queryFn: () => getUserById(claims!.sub),
    enabled: !!claims?.sub,
  });

  return (
    <View>
      <Header title={"Hello " + (user?.username || "User") + "!"} />
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
      <MenuItem
        title="Artist"
        icon="people-group"
        onPress={() => navigation.navigate("ArtistsPage")}
      />
      <MenuItem
        title="Logout"
        icon="right-from-bracket"
        onPress={() => supabase.auth.signOut()}
      />
    </View>
  );
};
