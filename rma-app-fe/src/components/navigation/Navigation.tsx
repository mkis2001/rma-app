import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { MainMenu } from "../../pages/main-menu/MainMenu";
import { Project } from "../../pages/project/Project";
import { ProjectForm } from "../../pages/project/ProjectForm";

export type RootStackParamList = {
  MainMenu: undefined;
  Project: undefined;
  ProjectForm: { type: "create" | "edit" };
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
          <RootStack.Screen name="Project" component={Project} />
          <RootStack.Screen name="ProjectForm" component={ProjectForm} />
        </RootStack.Navigator>
        {/* <BarNavigation /> */}
      </NavigationContainer>
    </View>
  );
};
