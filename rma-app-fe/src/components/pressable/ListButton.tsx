import { FontAwesome6 } from "@expo/vector-icons";
import { MotiPressable } from "moti/interactions";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { colors, measures, typography } from "../../theme";
import { RegularText } from "../typography/regularText";

export const ListButton = ({
  label,
  icon,
  backgroundColor = colors.textLighter,
  labelColor = colors.background,
  iconColor = colors.backgroundDarker,
  onPress,
  onLongPress,
}: {
  label: string;
  icon?: React.ComponentProps<typeof FontAwesome6>["name"];
  backgroundColor?: string;
  labelColor?: string;
  iconColor?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}) => {
  return (
    <MotiPressable
      style={[styles.button, { backgroundColor }]}
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
      onLongPress={onLongPress}
    >
      <View style={styles.row}>
        <RegularText style={[styles.label, { color: labelColor }]}>
          {label}
        </RegularText>
        {icon && <FontAwesome6 name={icon} size={24} color={iconColor} />}
      </View>
    </MotiPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: measures.radius,
    paddingVertical: measures.padding,
    paddingHorizontal: measures.padding,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 24,
  },
  label: {
    color: colors.background,
    fontFamily: typography.fontFamilyBold,
    fontSize: typography.fontSize,
  },
});
