import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navigation } from "./src/components/navigation/Navigation";
import { colors } from "./src/theme";

function App() {
  const [fontsLoaded] = useFonts({
    "SNPro-Bold": require("./assets/fonts/SN_Pro/static/SNPro-Bold.ttf"),
    "SNPro-Regular": require("./assets/fonts/SN_Pro/static/SNPro-Regular.ttf"),
    "Oi-Regular": require("./assets/fonts/Oi/Oi-Regular.ttf"),
    "Sigmar-Regular": require("./assets/fonts/Sigmar/Sigmar-Regular.ttf"),
    "DMMono-Regular": require("./assets/fonts/DM_Mono/DMMono-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, styles.colors]}>
      <Navigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  colors: {
    backgroundColor: colors.background,
  },
});

export default App;
