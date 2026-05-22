import { FontAwesome6 } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { MotiPressable } from "moti/interactions";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { colors, measures } from "../../theme";
import { RootStackParamList } from "./Navigation";

type Navigation = NavigationProp<RootStackParamList>;

export const NavigationButton = ({
  icon,
  onPress,
}: {
  icon?: React.ComponentProps<typeof FontAwesome6>["name"];
  onPress: () => void;
}) => {
  return (
    <View style={styles.buttonContainer}>
      <MotiPressable
        style={styles.button}
        animate={useMemo(
          () =>
            ({ pressed }) => {
              "worklet";

              return {
                transform: pressed ? [{ scale: 0.9 }] : [{ scale: 1 }],
              };
            },
          [],
        )}
        transition={{ type: "spring", duration: 150 }}
        onPress={onPress}
      >
        <FontAwesome6 name={icon} size={24} color={colors.background} />
      </MotiPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
  },
  button: {
    alignItems: "center",
    padding: measures.padding,
  },
});
