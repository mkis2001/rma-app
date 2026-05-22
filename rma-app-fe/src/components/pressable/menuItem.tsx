import { FontAwesome6 } from "@expo/vector-icons";
import { colors } from "../../theme";
import { Pressable } from "./pressable";

export const MenuItem = ({
  onPress,
  title,
  icon,
}: {
  onPress?: () => void;
  title: string;
  icon?: React.ComponentProps<typeof FontAwesome6>["name"];
}) => {
  return (
    <Pressable
      onPress={onPress}
      title={title}
      icon={icon}
      color={colors.background}
      backgroundColor={colors.textLighter}
      shadowColor={colors.text}
    />
  );
};
