import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { View } from "react-native";
import { UserContext } from "../../../App";
import { ConfirmationModal } from "../../components/modal/ConfirmationModal";
import { ScrollableView } from "../../components/ScrollableView";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { IconButton } from "../../components/pressable/IconButton";
import { ListButton } from "../../components/pressable/ListButton";
import { Header } from "../../components/typography/header";
import {
  getArtist,
  removeUserFromArtist,
} from "../../services/ArtistService";
import { User } from "../../types/userTypes";
import { colors } from "../../theme";

type Props = {
  route: RouteProp<RootStackParamList, "ArtistManageUsers">;
};

type ArtistNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "ArtistManageUsers"
>;

export const ArtistManageUsers = ({ route }: Props) => {
  const { artist: artistParam } = route.params;
  const navigation = useNavigation<ArtistNavigation>();
  const claims = useContext(UserContext);
  const currentUserId = claims?.sub;

  const queryClient = useQueryClient();

  const { data: artist } = useQuery({
    queryKey: ["artist", artistParam.id],
    queryFn: () => getArtist(artistParam.id),
    initialData: artistParam,
  });

  const [userToRemove, setUserToRemove] = useState<User | null>(null);

  const currentUser = artist.users.find((user) => user.id === currentUserId);
  const otherUsers = artist.users.filter((user) => user.id !== currentUserId);

  const removeUserMutation = useMutation({
    mutationFn: (userId: string) => removeUserFromArtist(artist.id, userId),
    onSuccess: (data) => {
      queryClient.setQueryData(["artist", artist.id], data);
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <Header title={artist.name} subheader="Manage Users" />

      <ScrollableView>
        {currentUser && (
          <ListButton
            label={currentUser.username}
            icon="user"
            backgroundColor={colors.text}
          />
        )}
        {otherUsers.map((user) => (
          <ListButton
            key={user.id}
            label={user.username}
            onLongPress={() => setUserToRemove(user)}
          />
        ))}
      </ScrollableView>

      <View style={{ display: "flex", alignItems: "flex-end" }}>
        <IconButton
          icon="plus"
          onPress={() => navigation.navigate("ArtistAddUser", { artist })}
        />
      </View>

      {/* Confirmation Modal */}
      <ConfirmationModal
        title="Are you sure you want to remove this user?"
        isOpen={userToRemove !== null}
        onConfirm={() => {
          if (userToRemove) {
            removeUserMutation.mutate(userToRemove.id);
          }
          setUserToRemove(null);
        }}
        handleClose={() => setUserToRemove(null)}
      />
    </View>
  );
};
