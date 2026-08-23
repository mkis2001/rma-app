import { View } from "react-native";
import { ModalButton } from "../pressable/modalButton";
import { RegularText } from "../typography/regularText";
import { ModalView } from "./ModalView";

export const ConfirmationModal = ({
  title,
  isOpen,
  onConfirm,
  handleClose,
}: {
  title: string;
  isOpen: boolean;
  onConfirm: () => void;
  handleClose: () => void;
}) => {
  return (
    <ModalView isOpen={isOpen} handleClose={handleClose}>
      <RegularText>{title}</RegularText>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <ModalButton onPress={onConfirm} title="Confirm" />
        <ModalButton onPress={handleClose} title="Cancel" />
      </View>
    </ModalView>
  );
};
