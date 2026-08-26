import { StyleSheet, View } from "react-native";
import { colors, measures, typography } from "../../theme";
import { RegularText } from "../typography/regularText";

export const Chip = ({
  label,
  backgroundColor = colors.textLighter,
  color = colors.background,
}: {
  label: string;
  backgroundColor?: string;
  color?: string;
}) => {
  return (
    <View style={[styles.chip, { backgroundColor }]}>
      <RegularText style={[styles.text, { color }]}>{label}</RegularText>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    paddingVertical: measures.padding / 3,
    paddingHorizontal: measures.padding,
    borderRadius: 50,
  },
  text: {
    fontSize: 14,
    fontFamily: typography.fontFamilyBold,
  },
});
