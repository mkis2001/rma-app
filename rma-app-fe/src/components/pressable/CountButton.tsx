import { FontAwesome6 } from "@expo/vector-icons";
import { MotiPressable } from "moti/interactions";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { colors, measures, typography } from "../../theme";
import { RegularText } from "../typography/regularText";

export const CountButton = ({
  count,
  singular,
  plural,
  icon,
  onPress,
}: {
  count: number;
  singular: string;
  plural: string;
  icon: React.ComponentProps<typeof FontAwesome6>["name"];
  onPress?: () => void;
}) => {
  const word = count % 10 === 1 ? singular : plural;

  return (
    <MotiPressable
      style={styles.button}
      animate={useMemo(
        () =>
          ({ pressed }) => {
            "worklet";

            return {
              opacity: pressed ? 0.85 : 1,
            };
          },
        [],
      )}
      transition={{ type: "timing", duration: 100 }}
      onPress={onPress}
    >
      <View style={styles.row}>
        <RegularText style={styles.text}>
          <RegularText style={styles.count}>{count}</RegularText>
          <RegularText style={styles.word}> {word}</RegularText>
        </RegularText>
        <FontAwesome6 name={icon} size={24} color={colors.backgroundDarker} />
      </View>
    </MotiPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.textLighter,
    borderRadius: measures.radius,
    paddingVertical: measures.padding,
    paddingHorizontal: measures.padding,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontFamily: typography.fontFamilyBold,
  },
  count: {
    color: colors.backgroundDarker,
    fontFamily: typography.fontFamilyBold,
    fontSize: 24,
  },
  word: {
    color: colors.background,
    fontFamily: typography.fontFamilyBold,
    fontSize: typography.fontSize,
  },
});
