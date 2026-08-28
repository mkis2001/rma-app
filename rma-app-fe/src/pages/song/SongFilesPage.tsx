import { RouteProp } from "@react-navigation/native";
import { View } from "react-native";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { FileItem } from "../../components/pressable/FileItem";
import { ScrollableView } from "../../components/ScrollableView";
import { Header } from "../../components/typography/header";
import { downloadSongFile } from "../../services/SongService";

type Props = {
  route: RouteProp<RootStackParamList, "SongFilesPage">;
};

export const SongFilesPage = ({ route }: Props) => {
  const { song, files } = route.params;

  const handleDownload = async (fileId: number) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    try {
      await downloadSongFile(song.id, file);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title={`${song.name} - Files`} />
      <ScrollableView>
        {files.map((file) => (
          <FileItem
            key={file.id}
            title={file.name}
            mimeType={file.mimeType}
            icon="download"
            onPress={() => handleDownload(file.id)}
          />
        ))}
      </ScrollableView>
    </View>
  );
};
