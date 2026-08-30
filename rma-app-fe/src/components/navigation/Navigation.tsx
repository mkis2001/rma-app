import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { ArtistForm } from "../../pages/artist/ArtistForm";
import { ArtistManageUsers } from "../../pages/artist/ArtistManageUsers";
import { ArtistPage } from "../../pages/artist/ArtistPage";
import { ArtistsPage } from "../../pages/artist/ArtistsPage";
import { MainMenu } from "../../pages/main-menu/MainMenu";
import { ProjectForm } from "../../pages/project/ProjectForm";
import { ProjectPage } from "../../pages/project/ProjectPage";
import { ProjectsPage } from "../../pages/project/ProjectsPage";
import { SongForm } from "../../pages/song/SongForm";
import { SongPage } from "../../pages/song/SongPage";
import { SongFilesPage } from "../../pages/song/SongFilesPage";
import { SongsPage } from "../../pages/song/SongsPage";
import { Artist } from "../../types/artistTypes";
import { Project } from "../../types/projectTypes";
import { Song, SongFile } from "../../types/songTypes";

export type RootStackParamList = {
  MainMenu: undefined;
  ArtistsPage: undefined;
  ArtistPage: { artist: Artist };
  ArtistForm: { type: "create" } | { type: "edit"; artist: Artist };
  ArtistManageUsers: { artist: Artist };
  ProjectsPage: undefined;
  ProjectPage: { project: Project };
  ProjectForm: { type: "create" } | { type: "edit"; project: Project };
  SongsPage: undefined;
  SongPage: { song: Song };
  SongForm: { type: "create" } | { type: "edit"; song: Song };
  SongFilesPage: { song: Song; files: SongFile[] };
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
          <RootStack.Screen
            name="SongFilesPage"
            component={SongFilesPage}
            options={{ animation: "slide_from_right" }}
          />
          {/* ARTIST */}
          <RootStack.Screen
            name="ArtistsPage"
            component={ArtistsPage}
            options={{ animation: "slide_from_right" }}
          />
          <RootStack.Screen
            name="ArtistPage"
            component={ArtistPage}
            options={{ animation: "slide_from_right" }}
          />
          <RootStack.Screen
            name="ArtistManageUsers"
            component={ArtistManageUsers}
            options={{ animation: "slide_from_right" }}
          />
          <RootStack.Screen
            name="ArtistForm"
            component={ArtistForm}
            options={{ animation: "slide_from_right" }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
};
