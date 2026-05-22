import { StyleSheet, View } from "react-native";
import { colors, measures } from "../../theme";

export const FormContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.shadowContainer}>
      <View style={styles.container}>{children}</View>;
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    width: "100%",
    borderRadius: measures.radius,
    borderColor: colors.backgroundDarker,
    borderWidth: measures.borderWidth,
    padding: measures.padding,
    gap: measures.padding,
  },
  shadowContainer: {
    marginRight: 10,
    borderRadius: measures.radius,
    boxShadow: `10px 10px 0px ${colors.backgroundDarker}`,
    marginBottom: 20,
  },
});
