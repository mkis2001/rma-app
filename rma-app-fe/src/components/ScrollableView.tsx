import { ScrollView, StyleSheet } from "react-native";
import { measures } from "../theme";

export const ScrollableView = ({ children }: { children: React.ReactNode }) => {
  return <ScrollView style={styles.list}>{children}</ScrollView>;
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginBottom: 20,
    borderRadius: measures.radius,
  },
});
