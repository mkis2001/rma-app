import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import { colors } from "../theme";

export const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/animations/loading_animation (1).json")}
        autoPlay
        loop
        style={{
          width: "80%",
          height: 300,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    marginBottom: 100,
    alignItems: "center",
  },
});
