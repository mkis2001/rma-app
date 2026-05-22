import { StyleSheet, View } from "react-native";
import { colors, measures } from "../../theme";
import { NavigationButton } from "./navigationButton";

export const BarNavigation = () => {
  return (
    <View style={styles.container}>
      <NavigationButton
        icon="house"
        onPress={() => navigation.navigate("Project")}
      />
      <NavigationButton
        icon="user-large"
        onPress={() => navigation.navigate("Profile")}
      />
      <NavigationButton
        icon="gear"
        onPress={() => navigation.navigate("Settings")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: measures.padding,
    borderRadius: measures.radius * 3,
  },
});
