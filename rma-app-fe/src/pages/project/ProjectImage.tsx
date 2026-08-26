import { FontAwesome6 } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { Shadow } from "react-native-shadow-2";
import { ModalView } from "../../components/modal/ModalView";
import { ModalButton } from "../../components/pressable/modalButton";
import { BoldText } from "../../components/typography/boldText";
import { RegularText } from "../../components/typography/regularText";
import {
  deleteProjectImage,
  getProjectImage,
  uploadProjectImage,
} from "../../services/ProjectService";
import { colors, measures } from "../../theme";

type Props = {
  projectId: number;
};

export const ProjectImage = ({ projectId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: imageUrl } = useQuery({
    queryKey: ["projectImage", projectId],
    queryFn: () => getProjectImage(projectId),
  });

  const uploadMutation = useMutation({
    mutationFn: (params: { uri: string; fileName: string; mimeType: string }) =>
      uploadProjectImage(
        projectId,
        params.uri,
        params.fileName,
        params.mimeType,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectImage", projectId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProjectImage(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectImage", projectId] });
    },
  });

  const handleUploadImage = async () => {
    setIsModalOpen(false);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const fileName = asset.fileName || "image.jpg";
      const mimeType = asset.mimeType || "image/jpeg";
      uploadMutation.mutate({ uri: asset.uri, fileName, mimeType });
    }
  };

  const handleRemoveImage = () => {
    setIsModalOpen(false);
    deleteMutation.mutate();
  };

  return (
    <>
      <Shadow
        distance={1}
        offset={[10, 10]}
        startColor={colors.backgroundDarker}
        endColor={colors.text}
      >
        <Pressable
          onPress={() => setIsModalOpen(true)}
          style={[
            styles.imageContainer,
            !imageUrl && { backgroundColor: colors.textLighter },
          ]}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <FontAwesome6
                name="image"
                size={32}
                color={colors.backgroundDarker}
              />
              <RegularText style={styles.placeholderText}>
                Add project image
              </RegularText>
            </View>
          )}
        </Pressable>
      </Shadow>

      <ModalView isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)}>
        <BoldText>Project Image</BoldText>
        <View style={styles.modalButtons}>
          <ModalButton title="Upload new image" onPress={handleUploadImage} />
          {imageUrl && (
            <ModalButton
              title="Remove image"
              onPress={handleRemoveImage}
              backgroundColor={colors.error}
              color={colors.background}
            />
          )}
          <ModalButton title="Cancel" onPress={() => setIsModalOpen(false)} />
        </View>
      </ModalView>
    </>
  );
};

const IMAGE_SIZE = (Dimensions.get("window").width - 40) / 2;

const styles = StyleSheet.create({
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: colors.text,
    borderRadius: measures.radius,
    overflow: "hidden",
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  placeholderText: {
    color: colors.background,
  },
  modalButtons: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
});
