import { StyleSheet, Text, TextStyle } from "react-native";
import { colors, typography } from "../../theme";

type HeaderProps = {
  title: string;
  type?: "h1" | "h2" | "h3";
  style?: any;
};

const types: Record<NonNullable<HeaderProps["type"]>, TextStyle> = {
  h1: { fontSize: 32 },
  h2: { fontSize: 24 },
  h3: { fontSize: 18 },
};

export const Header = ({ title, type = "h1", style }: HeaderProps) => {
  return <Text style={[styles.title, types[type], style]}>{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
    fontFamily: typography.fontFamilyHeader,
    color: colors.textLighter,
  },
});
