import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { MainMenu } from "../../pages/main-menu/MainMenu";
import { ProjectForm } from "../../pages/project/ProjectForm";
import { ProjectPage } from "../../pages/project/ProjectPage";
import { ProjectsPage } from "../../pages/project/ProjectsPage";
import { SongForm } from "../../pages/song/SongForm";
import { SongPage } from "../../pages/song/SongPage";
import { SongsPage } from "../../pages/song/SongsPage";
import { Project } from "../../types/projectTypes";
import { Song } from "../../types/songTypes";

export type RootStackParamList = {
  MainMenu: undefined;
  ProjectsPage: undefined;
  ProjectPage: { project: Project };
  ProjectForm: { type: "create" | "edit" };
  SongsPage: undefined;
  SongPage: { song: Song };
  SongForm: { type: "create" | "edit" };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

export const Navigation = () => {
  return (
    <View style={{ flex: 1, position: "relative" }}>
      <NavigationContainer theme={navigationTheme}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {/* MAIN MENU */}
          <RootStack.Screen name="MainMenu" component={MainMenu} />
          {/* PROJECT */}
          <RootStack.Screen
            name="ProjectsPage"
            component={ProjectsPage}
            options={{ animation: "slide_from_right" }}
          />
          <RootStack.Screen
            name="ProjectPage"
            component={ProjectPage}
            options={{ animation: "slide_from_right" }}
          />
          <RootStack.Screen
            name="ProjectForm"
            component={ProjectForm}
            options={{ animation: "slide_from_right" }}
          />
          {/* SONG */}
          <RootStack.Screen
            name="SongsPage"
            component={SongsPage}
            options={{ animation: "slide_from_right" }}
          />
          <RootStack.Screen
            name="SongPage"
            component={SongPage}
            options={{ animation: "slide_from_right" }}
          />
          <RootStack.Screen
            name="SongForm"
            component={SongForm}
            options={{ animation: "slide_from_right" }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
};
