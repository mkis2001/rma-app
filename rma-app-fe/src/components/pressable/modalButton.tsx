import { MotiPressable } from "moti/interactions";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { colors, measures, typography } from "../../theme";
import { RegularText } from "../typography/regularText";

export const ModalButton = ({
  onPress,
  title,
  color = colors.background,
  backgroundColor = colors.textLighter,
}: {
  onPress?: () => void;
  title: string;
  color?: string;
  backgroundColor?: string;
}) => {
  const styles = StyleSheet.create({
    button: {
      alignSelf: "flex-end",
      backgroundColor: backgroundColor,
      paddingVertical: measures.padding / 2,
      paddingHorizontal: measures.padding * 2,
      borderRadius: measures.radius,
      justifyContent: "space-between",
      flexDirection: "column",
      marginRight: 10,
    },
    buttonRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    text: {
      color: color,
      fontFamily: typography.fontFamilyBold,
    },
  });

  return (
    <MotiPressable
      style={styles.button}
      animate={useMemo(
        () =>
          ({ pressed }) => {
            "worklet";

            return {
              transform: pressed ? [{ translateY: 3 }] : [{ translateY: 0 }],
            };
          },
        [],
      )}
      transition={{ type: "spring", duration: 150 }}
      onPress={onPress}
    >
      <RegularText style={styles.text}>{title}</RegularText>
    </MotiPressable>
  );
};
