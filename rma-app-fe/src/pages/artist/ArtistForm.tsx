import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormContainer } from "../../components/form/formContainer";
import { FormTextInput } from "../../components/form/formTextInput";
import { SuccessModal } from "../../components/modal/SuccessModal";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { FormButton } from "../../components/pressable/formButton";
import { Header } from "../../components/typography/header";
import { createArtist, updateArtist } from "../../services/ArtistService";
import { Artist, CreateArtist } from "../../types/artistTypes";

type ArtistFormProps = RouteProp<RootStackParamList, "ArtistForm">;

type ArtistFormNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "ArtistForm"
>;

type Props = {
  route: ArtistFormProps;
};

export const ArtistForm = ({ route }: Props) => {
  const params = route.params;
  const isEdit = params.type === "edit";
  const artist = isEdit ? params.artist : undefined;

  const { control, handleSubmit } = useForm<CreateArtist>({
    defaultValues: {
      name: artist?.name ?? "",
      description: artist?.description ?? "",
    },
  });
  const queryClient = useQueryClient();
  const navigation = useNavigation<ArtistFormNavigation>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [updatedArtist, setUpdatedArtist] = useState<Artist | undefined>();

  const artistMutation = useMutation({
    mutationFn: (data: CreateArtist) => {
      setIsSubmitting(true);
      return isEdit && artist
        ? updateArtist(artist.id, data)
        : createArtist(data);
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ["artists"] });
      setUpdatedArtist(result);
      setIsOpen(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: CreateArtist) => {
    artistMutation.mutate(data);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (isEdit && updatedArtist) {
      navigation.popTo("ArtistPage", { artist: updatedArtist });
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
      <Header title={`${isEdit ? "Edit" : "Create"} Artist`} type="h1" />
      <FormContainer>
        <FormTextInput
          control={control}
          name="name"
          label="Name"
          placeholder="Artist name"
        />
        <FormTextInput
          control={control}
          name="description"
          label="Description"
          placeholder="Artist description..."
          multiline={true}
        />
      </FormContainer>
      <FormButton
        title={isSubmitting ? "Saving..." : "Save"}
        onPress={handleSubmit(onSubmit)}
        icon="circle-check"
        type="submit"
      />

      {/* Success message modal */}
      <SuccessModal
        isOpen={isOpen}
        handleClose={closeModal}
        title={`Artist successfully ${isEdit ? "updated" : "created"}`}
      />
    </KeyboardAwareScrollView>
  );
};
