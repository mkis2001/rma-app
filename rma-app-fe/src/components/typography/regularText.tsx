import { Text } from "react-native";
import { typography } from "../../theme";

export const RegularText = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = {
  text: {
    fontFamily: typography.fontFamily,
    color: typography.color,
    fontSize: typography.fontSize,
  },
};
