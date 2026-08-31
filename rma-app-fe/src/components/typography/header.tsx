import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../../theme";

type HeaderProps = {
  title: string;
  subheader?: string;
  style?: any;
};

export const Header = ({ title, subheader, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      {subheader ? <Text style={styles.subheader}>{subheader}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  subheader: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    color: colors.textTransparent,
  },
  title: {
    fontSize: 40,
    fontFamily: typography.fontFamilyHeader,
    color: colors.textLighter,
  },
});
