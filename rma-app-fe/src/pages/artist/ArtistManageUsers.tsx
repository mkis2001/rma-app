import { RouteProp } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UserContext } from "../../../App";
import { ConfirmationModal } from "../../components/modal/ConfirmationModal";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { MenuItem } from "../../components/pressable/menuItem";
import { BoldText } from "../../components/typography/boldText";
import { RegularText } from "../../components/typography/regularText";
import {
  addUserToArtist,
  removeUserFromArtist,
} from "../../services/ArtistService";
import { getUsersByUsername } from "../../services/UserService";
import { inputStyles } from "../../theme";

type Props = {
  route: RouteProp<RootStackParamList, "ArtistManageUsers">;
};

export const ArtistManageUsers = ({ route }: Props) => {
  const { artist } = route.params;
  const claims = useContext(UserContext);
  const currentUserId = claims?.sub;

  const [users, setUsers] = useState(
    artist.users.filter((user) => user.id !== currentUserId),
  );
  const [debouncedValue, setDebouncedValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState([false, null] as [
    boolean,
    number | null,
  ]);

  const queryClient = useQueryClient();

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

  // ADD new USER to artist and update the users state
  const addUserMutation = useMutation({
    mutationFn: (data: { artistId: number; userId: string }) => {
      return addUserToArtist(data.artistId, data.userId);
    },
    onSuccess: (data, variables) => {
      setUsers((prevUsers) => [
        ...prevUsers,
        data?.users.find((user) => user.id === variables.userId)!,
      ]);
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
  });

  // REMOVE USER from artist and update the users state
  const removeUserMutation = useMutation({
    mutationFn: (data: { artistId: number; userId: string }) => {
      return removeUserFromArtist(data.artistId, data.userId);
    },
    onSuccess: (data, variables) => {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== variables.userId),
      );
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
  });

  const handleAddUser = (userId: string) => {
    addUserMutation.mutate({ artistId: artist.id, userId });
  };
  const handleRemoveUser = (userId: string) => {
    removeUserMutation.mutate({ artistId: artist.id, userId });
  };

  return (
    <KeyboardAwareScrollView>
      {/* List of users */}
      <BoldText>Artist users</BoldText>
      <MenuItem
        title={`${artist.users.find((user) => user.id === currentUserId)?.username}`}
        icon="user"
      />
      {users.map((user) => (
        <MenuItem
          key={user.id}
          title={user.username}
          icon="square-minus"
          onPress={() => {
            setIsOpen([true, users.indexOf(user)]);
          }}
        />
      ))}

      {/* Add new user */}
      <BoldText>Add user</BoldText>
      <TextInput
        style={inputStyles.textInput}
        placeholder="Enter username"
        value={inputValue}
        onChangeText={setInputValue}
      />
      {isLoading && (
        <RegularText style={{ textType: "italic" }}>Loading...</RegularText>
      )}
      {foundUsers?.map((user) => {
        if (!users.find((u) => u.id === user.id)) {
          return (
            <MenuItem
              key={user.id}
              title={user.username}
              icon="square-plus"
              onPress={() => handleAddUser(user.id)}
            />
          );
        }
        return null;
      })}

      {/* Confirmation Modal */}
      <ConfirmationModal
        title="Are you sure you want to remove this user?"
        isOpen={isOpen[0]}
        onConfirm={() => {
          handleRemoveUser(users[isOpen[1]!].id);
          setIsOpen([false, null]);
        }}
        handleClose={() => setIsOpen([false, null])}
      />
    </KeyboardAwareScrollView>
  );
};
