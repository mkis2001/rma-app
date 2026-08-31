import { RouteProp } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { View } from "react-native";
import { ConfirmationModal } from "../../components/modal/ConfirmationModal";
import { ModalView } from "../../components/modal/ModalView";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { FileItem } from "../../components/pressable/FileItem";
import { IconButton } from "../../components/pressable/IconButton";
import { ModalButton } from "../../components/pressable/modalButton";
import { ScrollableView } from "../../components/ScrollableView";
import { BoldText } from "../../components/typography/boldText";
import { Header } from "../../components/typography/header";
import {
  deleteSongFile,
  downloadSongFile,
  getSongFiles,
  uploadSongFile,
} from "../../services/SongService";
import { SongFile } from "../../types/songTypes";

type Props = {
  route: RouteProp<RootStackParamList, "SongFilesPage">;
};

export const SongFilesPage = ({ route }: Props) => {
  const { song, files: initialFiles } = route.params;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<SongFile | null>(null);
  const queryClient = useQueryClient();

  const { data: files } = useQuery({
    queryKey: ["songFiles", song.id],
    queryFn: () => getSongFiles(song.id),
    initialData: initialFiles,
  });

  const uploadMutation = useMutation({
    mutationFn: (params: { uri: string; fileName: string; mimeType: string }) =>
      uploadSongFile(song.id, params.uri, params.fileName, params.mimeType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songFiles", song.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (fileId: number) => deleteSongFile(song.id, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songFiles", song.id] });
    },
  });

  const handleDownload = async (fileId: number) => {
    const file = files?.find((f) => f.id === fileId);
    if (!file) return;

    try {
      await downloadSongFile(song.id, file);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handlePickFile = async () => {
    setIsModalOpen(false);

    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      uploadMutation.mutate({
        uri: asset.uri,
        fileName: asset.name,
        mimeType: asset.mimeType || "application/octet-stream",
      });
    }
  };

  const handlePickVideo = async () => {
    setIsModalOpen(false);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const fileName = asset.fileName || asset.uri.split("/").pop() || "video";
      const mimeType = asset.mimeType || "video/mp4";
      uploadMutation.mutate({ uri: asset.uri, fileName, mimeType });
    }
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      deleteMutation.mutate(fileToDelete.id);
    }
    setFileToDelete(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title={song.name} subheader={"Files"} />
      <ScrollableView>
        {files?.map((file) => (
          <FileItem
            key={file.id}
            title={file.name}
            mimeType={file.mimeType}
            icon="download"
            onPress={() => handleDownload(file.id)}
            onLongPress={() => setFileToDelete(file)}
          />
        ))}
      </ScrollableView>
      <View style={{ display: "flex", alignItems: "flex-end" }}>
        <IconButton icon="plus" onPress={() => setIsModalOpen(true)} />
      </View>

      <ModalView isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)}>
        <BoldText>Upload File</BoldText>
        <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <ModalButton title="File" onPress={handlePickFile} />
          <ModalButton title="Video" onPress={handlePickVideo} />
          <ModalButton title="Cancel" onPress={() => setIsModalOpen(false)} />
        </View>
      </ModalView>

      <ConfirmationModal
        isOpen={fileToDelete !== null}
        title={`Delete "${fileToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        handleClose={() => setFileToDelete(null)}
      />
    </View>
  );
};
