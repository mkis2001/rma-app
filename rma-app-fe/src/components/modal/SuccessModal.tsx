import { colors } from "../../theme";
import { ModalButton } from "../pressable/modalButton";
import { RegularText } from "../typography/regularText";
import { ModalView } from "./ModalView";

export const SuccessModal = ({
  title,
  isOpen,
  handleClose,
}: {
  title: string;
  isOpen: boolean;
  handleClose: () => void;
}) => {
  return (
    <ModalView
      isOpen={isOpen}
      handleClose={handleClose}
      backgroundColor={colors.accent}
    >
      <RegularText style={{ color: colors.background }}>{title}</RegularText>
      <ModalButton
        onPress={handleClose}
        title="OK"
        backgroundColor={colors.accentDarker}
        color={colors.background}
      />
    </ModalView>
  );
};
