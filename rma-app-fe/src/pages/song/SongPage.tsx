import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, View } from "react-native";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { IconButton } from "../../components/pressable/IconButton";
import { SongFilesButton } from "../../components/pressable/SongFilesButton";
import { BoldText } from "../../components/typography/boldText";
import { Header } from "../../components/typography/header";
import { Lyrics } from "../../components/typography/lyrics";
import { RegularText } from "../../components/typography/regularText";
import { getSongFiles } from "../../services/SongService";
import { colors, measures } from "../../theme";

type Props = {
  route: RouteProp<RootStackParamList, "SongPage">;
};

export const SongPage = ({ route }: Props) => {
  const { song } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: files } = useQuery({
    queryKey: ["songFiles", song.id],
    queryFn: () => getSongFiles(song.id),
  });

  return (
    <View style={{ flex: 1 }}>
      <Header title={song.name} subheader={"Song"} />
      <RegularText>
        from <BoldText>{song.project?.name}</BoldText>
      </RegularText>
      <View style={styles.filesButton}>
        <SongFilesButton
          count={files?.length ?? 0}
          onPress={() =>
            navigation.navigate("SongFilesPage", { song, files: files ?? [] })
          }
        />
      </View>
      <View style={styles.lyricsContainer}>
        <RegularText style={styles.lyricsHeader}>Lyrics</RegularText>
        <ScrollView showsVerticalScrollIndicator={false}>
          {song.lyrics && <Lyrics lyrics={song.lyrics} />}
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <IconButton
          icon="pen"
          onPress={() =>
            navigation.navigate("SongForm", { type: "edit", song })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filesButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  lyricsContainer: {
    flexShrink: 1,
    backgroundColor: colors.backgroundDarker,
    padding: measures.padding,
    borderRadius: measures.radius,
  },
  lyricsHeader: {
    fontFamily: "SNPro-Italic",
    color: colors.textLighter,
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    alignItems: "flex-end",
    marginTop: "auto",
    paddingTop: 20,
  },
});
