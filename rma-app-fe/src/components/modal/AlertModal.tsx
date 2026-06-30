import { colors } from "../../theme";
import { BoldText } from "../typography/boldText";
import { RegularText } from "../typography/regularText";
import { ModalView } from "./ModalView";

export const AlertModal = ({
  title,
  description,
  isOpen,
  handleClose,
}: {
  title: string;
  description: string;
  isOpen: boolean;
  handleClose: () => void;
}) => {
  return (
    <ModalView
      isOpen={isOpen}
      handleClose={handleClose}
      backgroundColor={colors.error}
    >
      <BoldText style={{ color: colors.background }}>{title}</BoldText>
      <RegularText style={{ color: colors.background }}>
        {description}
      </RegularText>
    </ModalView>
  );
};
