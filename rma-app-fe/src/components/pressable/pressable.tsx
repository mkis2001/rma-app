import { FontAwesome6 } from "@expo/vector-icons";
import { MotiPressable } from "moti/interactions";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { colors, measures, typography } from "../../theme";
import { RegularText } from "../typography/regularText";

export const Pressable = ({
  onPress,
  title,
  icon,
  color = colors.background,
  backgroundColor = colors.textLighter,
  shadowColor = colors.text,
}: {
  onPress?: () => void;
  title: string;
  icon?: React.ComponentProps<typeof FontAwesome6>["name"];
  color?: string;
  backgroundColor?: string;
  shadowColor?: string;
}) => {
  const styles = StyleSheet.create({
    shadowContainer: {
      marginRight: 10,
      borderRadius: measures.radius,
      boxShadow: `10px 10px 0px ${shadowColor}`,
      marginBottom: 20,
    },
    button: {
      backgroundColor: backgroundColor,
      paddingVertical: measures.padding,
      paddingHorizontal: measures.padding,
      borderRadius: measures.radius,
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    text: {
      color: color,
      fontFamily: typography.fontFamilyBold,
    },
  });

  return (
    <View style={styles.shadowContainer}>
      <MotiPressable
        style={styles.button}
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
        <RegularText style={styles.text}>{title}</RegularText>
        {icon && <FontAwesome6 name={icon} size={32} color={color} />}
      </MotiPressable>
    </View>
  );
};
