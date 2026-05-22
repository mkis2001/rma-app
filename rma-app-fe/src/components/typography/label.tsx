import { StyleSheet, Text } from "react-native";
import { colors, typography } from "../../theme";

export const Label = ({ title }: { title: string }) => {
  return <Text style={styles.label}>{title}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontFamily: typography.fontFamily,
    color: colors.textLighter,
  },
});
