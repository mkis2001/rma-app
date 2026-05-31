import { FontAwesome6 } from "@expo/vector-icons";
import { View } from "moti";
import { MotiPressable } from "moti/interactions";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Shadow } from "react-native-shadow-2";
import { colors, measures, typography } from "../../theme";
import { RegularText } from "../typography/regularText";

export const Pressable = ({
  onPress,
  title,
  secondaryTitle,
  icon,
  color = colors.background,
  secondaryColor = colors.backgroundDarker,
  backgroundColor = colors.textLighter,
  shadowColor = colors.text,
}: {
  onPress?: () => void;
  title: string;
  secondaryTitle?: string;
  icon?: React.ComponentProps<typeof FontAwesome6>["name"];
  color?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  shadowColor?: string;
}) => (
  <Shadow
    distance={1}
    offset={[10, 10]}
    startColor={shadowColor}
    endColor={shadowColor}
    style={{ width: "100%", marginBottom: 20 }}
  >
    <MotiPressable
      style={[styles.button, { backgroundColor: backgroundColor }]}
      animate={useMemo(
        () =>
          ({ pressed }) => {
            "worklet";

            return {
              transform: pressed
                ? [{ translateX: 3 }, { translateY: 3 }]
                : [{ translateX: 0 }, { translateY: 0 }],
            };
          },
        [],
      )}
      transition={{ type: "spring", duration: 150 }}
      onPress={onPress}
    >
      <View style={styles.buttonRow}>
        <RegularText style={[styles.text, { color: color }]}>
          {title}
        </RegularText>
        {icon && <FontAwesome6 name={icon} size={32} color={color} />}
      </View>
      {secondaryTitle && (
        <View>
          <RegularText
            style={[styles.buttonSecondaryText, { color: secondaryColor }]}
          >
            {secondaryTitle}
          </RegularText>
        </View>
      )}
    </MotiPressable>
  </Shadow>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: measures.padding,
    paddingHorizontal: measures.padding,
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
  buttonSecondaryText: {
    fontSize: 14,
  },
  text: {
    fontFamily: typography.fontFamilyBold,
  },
});
