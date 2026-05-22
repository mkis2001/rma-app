import { Text } from "react-native";
import { colors, typography } from "../../theme";

export const BoldText = ({
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
    fontFamily: typography.fontFamilyBold,
    color: colors.text,
    fontSize: 20,
  },
};
