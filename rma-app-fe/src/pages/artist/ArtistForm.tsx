import { RouteProp } from "@react-navigation/native";
import { View } from "react-native";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { RegularText } from "../../components/typography/regularText";

type ArtistFormProps = RouteProp<RootStackParamList, "ArtistForm">;

type Props = {
  route: ArtistFormProps;
};

export const ArtistForm = ({ route }: Props) => {
  const { type } = route.params;

  return (
    <View>
      <RegularText>Artist Form</RegularText>
    </View>
  );
};
