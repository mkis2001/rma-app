import { Modal, StyleSheet, View } from "react-native";
import { colors, measures } from "../../theme";

export const ModalView = ({
  children,
  isOpen,
  handleClose,
  backgroundColor = colors.background,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  handleClose: () => void;
  backgroundColor?: string;
}) => {
  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      onRequestClose={handleClose}
      style={styles.container}
      transparent
    >
      <View style={[styles.container]}>
        <View style={[styles.modal, { backgroundColor }]}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.textTransparent,
  },
  modal: {
    padding: measures.padding,
    marginHorizontal: measures.padding,
    width: "80%",
    borderRadius: measures.radius,
    display: "flex",
    gap: measures.padding * 2,
    flexDirection: "column",
  },
});
