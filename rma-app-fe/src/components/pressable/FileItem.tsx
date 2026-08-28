import { FontAwesome6 } from "@expo/vector-icons";
import { View } from "moti";
import { MotiPressable } from "moti/interactions";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { colors, measures, typography } from "../../theme";
import { BoldText } from "../typography/boldText";
import { RegularText } from "../typography/regularText";

const mediaType: { [key: string]: { name: string; color: string } } = {
  video: { name: "Video", color: colors.accent },
  audio: { name: "Audio", color: colors.orange },
  "application/pdf": { name: "PDF", color: colors.error },
  "application/octet-stream": { name: "Application", color: colors.blue },
};

const getMediaType = (mimeType: string): { name: string; color: string } => {
  if (mediaType[mimeType]) return mediaType[mimeType];
  const prefix = mimeType.split("/")[0];
  if (mediaType[prefix]) return mediaType[prefix];
  return { name: mimeType, color: colors.textLighter };
};

export const FileItem = ({
  onPress,
  onLongPress,
  title,
  mimeType,
  icon,
}: {
  onPress?: () => void;
  onLongPress?: () => void;
  title: string;
  mimeType: string;
  icon?: React.ComponentProps<typeof FontAwesome6>["name"];
}) => {
  const { name, color } = getMediaType(mimeType);

  return (
    <MotiPressable
      style={styles.button}
      animate={useMemo(
        () =>
          ({ pressed }) => {
            "worklet";

            return {
              backgroundColor: pressed
                ? colors.background
                : colors.backgroundDarker,
            };
          },
        [],
      )}
      transition={{ type: "spring", duration: 150 }}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <RegularText style={styles.text}>{title}</RegularText>
          <BoldText style={[styles.buttonSecondaryText, { color }]}>
            {name}
          </BoldText>
        </View>
        {icon && (
          <FontAwesome6
            name={icon}
            size={32}
            color={colors.textLighter}
            style={styles.icon}
          />
        )}
      </View>
    </MotiPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: measures.padding,
    paddingHorizontal: measures.padding,
    borderRadius: measures.radius,
    backgroundColor: colors.backgroundDarker,
    marginBottom: 10,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontFamily: typography.fontFamilyBold,
    color: colors.text,
  },
  icon: {
    marginLeft: 12,
  },
  buttonSecondaryText: {
    fontSize: 14,
  },
});
