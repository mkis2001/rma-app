import { RouteProp } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ConfirmationModal } from "../../components/modal/ConfirmationModal";
import { SuccessModal } from "../../components/modal/SuccessModal";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { ListButton } from "../../components/pressable/ListButton";
import { Header } from "../../components/typography/header";
import { RegularText } from "../../components/typography/regularText";
import { addUserToArtist, getArtist } from "../../services/ArtistService";
import { getUsersByUsername } from "../../services/UserService";
import { User } from "../../types/userTypes";
import { colors, inputStyles, typography } from "../../theme";

type Props = {
  route: RouteProp<RootStackParamList, "ArtistAddUser">;
};

export const ArtistAddUser = ({ route }: Props) => {
  const { artist: artistParam } = route.params;

  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [userToAdd, setUserToAdd] = useState<User | null>(null);
  const [addedUsername, setAddedUsername] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Live artist so the "already a member" check stays current.
  const { data: artist } = useQuery({
    queryKey: ["artist", artistParam.id],
    queryFn: () => getArtist(artistParam.id),
    initialData: artistParam,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const { data: foundUsers, isLoading } = useQuery({
    queryKey: ["usersByUsername", debouncedValue],
    queryFn: () => getUsersByUsername(debouncedValue),
    enabled: debouncedValue.length > 0,
  });

  const addUserMutation = useMutation({
    mutationFn: (userId: string) => addUserToArtist(artist.id, userId),
    onSuccess: (data, userId) => {
      queryClient.setQueryData(["artist", artist.id], data);
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      const added = data.users.find((user) => user.id === userId);
      setAddedUsername(added?.username ?? null);
    },
  });

  const confirmAddUser = () => {
    if (userToAdd) {
      addUserMutation.mutate(userToAdd.id);
    }
    setUserToAdd(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title={artist.name} subheader="Add User" />
      <TextInput
        style={inputStyles.textInput}
        placeholder="Enter username"
        value={inputValue}
        onChangeText={setInputValue}
        autoFocus
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading && (
          <RegularText style={{ fontFamily: typography.fontFamilyItalic }}>
            Loading...
          </RegularText>
        )}
        {foundUsers?.map((user) => {
          if (!artist.users.find((u) => u.id === user.id)) {
            return (
              <ListButton
                key={user.id}
                label={user.username}
                icon="plus"
                backgroundColor={colors.backgroundDarker}
                labelColor={colors.text}
                iconColor={colors.text}
                onPress={() => setUserToAdd(user)}
              />
            );
          }
          return null;
        })}
      </KeyboardAwareScrollView>

      {/* Confirm adding a user */}
      <ConfirmationModal
        title={`Add ${userToAdd?.username} to ${artist.name}?`}
        isOpen={userToAdd !== null}
        onConfirm={confirmAddUser}
        handleClose={() => setUserToAdd(null)}
      />

      {/* Success message */}
      <SuccessModal
        title={`${addedUsername} added successfully`}
        isOpen={addedUsername !== null}
        handleClose={() => setAddedUsername(null)}
      />
    </View>
  );
};
