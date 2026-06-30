import { JwtPayload } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { createContext } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navigation } from "./src/components/navigation/Navigation";
import { useAuth } from "./src/pages/auth/AuthHooks";
import { AuthPage } from "./src/pages/auth/AuthPage";
import { colors } from "./src/theme";

const queryClient = new QueryClient();

export const UserContext = createContext<JwtPayload | null>(null);

function App() {
  const { claims } = useAuth();

  const [fontsLoaded] = useFonts({
    "SNPro-Bold": require("./assets/fonts/SN_Pro/static/SNPro-Bold.ttf"),
    "SNPro-Regular": require("./assets/fonts/SN_Pro/static/SNPro-Regular.ttf"),
    "SNPro-Italic": require("./assets/fonts/SN_Pro/static/SNPro-Italic.ttf"),
    "Oi-Regular": require("./assets/fonts/Oi/Oi-Regular.ttf"),
    "Sigmar-Regular": require("./assets/fonts/Sigmar/Sigmar-Regular.ttf"),
    "DMMono-Regular": require("./assets/fonts/DM_Mono/DMMono-Regular.ttf"),
    Playwrite: require("./assets/fonts/Playwrite_AU_VIC_Guides/PlaywriteAUVICGuides-Regular.ttf"),
    Cormorant: require("./assets/fonts/Cormorant/static/Cormorant-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={[styles.container, styles.colors]}>
        {!claims ? (
          <AuthPage />
        ) : (
          <UserContext.Provider value={claims}>
            <Navigation />
          </UserContext.Provider>
        )}
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  colors: {
    backgroundColor: colors.background,
  },
});

export default App;
