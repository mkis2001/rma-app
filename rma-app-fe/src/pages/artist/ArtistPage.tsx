import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, View } from "react-native";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { CountButton } from "../../components/pressable/CountButton";
import { IconButton } from "../../components/pressable/IconButton";
import { Header } from "../../components/typography/header";
import { RegularText } from "../../components/typography/regularText";
import { getArtist } from "../../services/ArtistService";
import { colors, measures } from "../../theme";

type Props = {
  route: RouteProp<RootStackParamList, "ArtistPage">;
};

type ArtistNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "ArtistPage"
>;

export const ArtistPage = ({ route }: Props) => {
  const navigation = useNavigation<ArtistNavigation>();
  const { artist: artistParam } = route.params;

  const { data: artist } = useQuery({
    queryKey: ["artist", artistParam.id],
    queryFn: () => getArtist(artistParam.id),
    initialData: artistParam,
  });

  return (
    <View style={{ flex: 1 }}>
      <Header title={artist.name} subheader={"Artist"} />
      <View style={styles.usersButton}>
        <CountButton
          count={artist.users?.length ?? 0}
          singular="user"
          plural="users"
          icon="user"
          onPress={() => {
            navigation.navigate("ArtistManageUsers", { artist });
          }}
        />
      </View>
      <View style={styles.descriptionContainer}>
        <RegularText style={styles.descriptionHeader}>Description</RegularText>
        <ScrollView showsVerticalScrollIndicator={false}>
          <RegularText>{artist.description}</RegularText>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <IconButton
          icon="pen"
          onPress={() =>
            navigation.navigate("ArtistForm", { type: "edit", artist })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  usersButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  descriptionContainer: {
    flexShrink: 1,
    backgroundColor: colors.backgroundDarker,
    padding: measures.padding,
    borderRadius: measures.radius,
  },
  descriptionHeader: {
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
