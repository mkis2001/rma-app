import { StyleSheet, View } from "react-native";
import { Shadow } from "react-native-shadow-2";
import { colors, measures } from "../../theme";

export const FormContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Shadow
      distance={1}
      offset={[10, 10]}
      startColor={colors.backgroundDarker}
      endColor={colors.backgroundDarker}
      style={styles.shadowContainer}
    >
      <View style={styles.container}>{children}</View>
    </Shadow>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    marginRight: 10,
    borderRadius: measures.radius,
    borderColor: colors.backgroundDarker,
    borderWidth: measures.borderWidth,
    padding: measures.padding,
    gap: measures.padding,
  },
  shadowContainer: {
    width: "100%",
    marginBottom: 20,
  },
});
