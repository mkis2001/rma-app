import { FontAwesome6 } from "@expo/vector-icons";
import { colors } from "../../theme";
import { Pressable } from "./pressable";

export const FormButton = ({
  onPress,
  title,
  icon,
  type,
}: {
  onPress?: () => void;
  title: string;
  icon?: React.ComponentProps<typeof FontAwesome6>["name"];
  type: "submit" | "cancel";
}) => {
  return (
    <Pressable
      onPress={onPress}
      title={title}
      icon={icon}
      color={colors.background}
      backgroundColor={buttonColors[type].backgroundColor}
      shadowColor={buttonColors[type].shadowColor}
    />
  );
};

const buttonColors: {
  [key in "submit" | "cancel"]: {
    backgroundColor: string;
    shadowColor: string;
  };
} = {
  submit: {
    backgroundColor: colors.accent,
    shadowColor: colors.accentDarker,
  },
  cancel: {
    backgroundColor: colors.error,
    shadowColor: colors.errorDarker,
  },
};
