import { FontAwesome6 } from "@expo/vector-icons";
import { MotiPressable } from "moti/interactions";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Shadow } from "react-native-shadow-2";
import { colors } from "../../theme";

export const IconButton = ({
  onPress,
  icon,
  size = 24,
  iconColor = colors.backgroundDarker,
  backgroundColor = colors.textLighter,
  shadowColor = colors.text,
}: {
  onPress?: () => void;
  icon: React.ComponentProps<typeof FontAwesome6>["name"];
  size?: number;
  iconColor?: string;
  backgroundColor?: string;
  shadowColor?: string;
}) => {
  const buttonSize = size + 24;

  return (
    <Shadow
      distance={1}
      offset={[6, 6]}
      startColor={shadowColor}
      endColor={shadowColor}
    >
      <MotiPressable
        style={[
          styles.button,
          {
            backgroundColor,
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            marginRight: 8,
            marginBottom: 8,
          },
        ]}
        animate={useMemo(
          () =>
            ({ pressed }) => {
              "worklet";

              return {
                transform: pressed
                  ? [{ translateX: 2 }, { translateY: 2 }]
                  : [{ translateX: 0 }, { translateY: 0 }],
              };
            },
          [],
        )}
        transition={{ type: "spring", duration: 150 }}
        onPress={onPress}
      >
        <FontAwesome6 name={icon} size={size} color={iconColor} />
      </MotiPressable>
    </Shadow>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});
