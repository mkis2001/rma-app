import { FontAwesome } from "@expo/vector-icons";
import { MotiPressable } from "moti/interactions";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { colors, measures, typography } from "../../theme";
import { RegularText } from "../typography/regularText";

export const SongsButton = ({
  count,
  onPress,
}: {
  count: number;
  onPress?: () => void;
}) => {
  const word = count % 10 === 1 ? "song" : "songs";

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
      <RegularText style={styles.text}>
        {count > 0 ? (
          <>
            <RegularText style={styles.count}>{count}</RegularText>
            <RegularText style={styles.word}> {word}</RegularText>
          </>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <RegularText style={styles.word}>Add songs</RegularText>
            <FontAwesome
              name="plus"
              size={18}
              style={{ transform: [{ translateY: 2 }] }}
              color={colors.backgroundDarker}
            />
          </View>
        )}
      </RegularText>
    </MotiPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.textLighter,
    borderRadius: measures.radius,
    paddingVertical: measures.padding,
    paddingHorizontal: measures.padding,
    justifyContent: "center",
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
