import { FontAwesome6 } from "@expo/vector-icons";
import { colors } from "../../theme";
import { Pressable } from "./pressable";

export const MenuItem = ({
  onPress,
  title,
  secondaryTitle,
  icon,
}: {
  onPress?: () => void;
  title: string;
  secondaryTitle?: string;
  icon?: React.ComponentProps<typeof FontAwesome6>["name"];
}) => {
  return (
    <Pressable
      onPress={onPress}
      title={title}
      secondaryTitle={secondaryTitle}
      icon={icon}
      color={colors.background}
      iconColor={colors.backgroundDarker}
      backgroundColor={colors.textLighter}
      shadowColor={colors.text}
    />
  );
};
