import { StyleSheet, View } from "react-native";
import { colors, measures, typography } from "../../theme";
import { RegularText } from "./regularText";

export const Lyrics = ({ lyrics }: { lyrics: string }) => {
  return (
    <View style={styles.container}>
      <RegularText style={{ fontFamily: typography.fontFamilyItalic }}>
        {lyrics}
      </RegularText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: colors.textLighter,
    borderLeftWidth: measures.borderWidth / 2,
    paddingLeft: measures.padding,
  },
});
