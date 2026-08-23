import { RouteProp, useNavigation } from "@react-navigation/native";
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
import { createArtist } from "../../services/ArtistService";
import { CreateArtist } from "../../types/artistTypes";

type ArtistFormProps = RouteProp<RootStackParamList, "ArtistForm">;

type Props = {
  route: ArtistFormProps;
};

export const ArtistForm = ({ route }: Props) => {
  const { type } = route.params;
  const { control, handleSubmit } = useForm<CreateArtist>();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const [isCreatingArtist, setIsCreatingArtist] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const createArtistMutation = useMutation({
    mutationFn: (data: CreateArtist) => {
      setIsCreatingArtist(true);
      return createArtist(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["artists"] });
      setIsOpen(true);
    },
    onSettled: () => {
      setIsCreatingArtist(false);
    },
  });

  const onSubmit = (data: CreateArtist) => {
    createArtistMutation.mutate(data);
  };

  const closeModal = () => {
    setIsOpen(false);
    navigation.goBack();
  };

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
      <Header
        title={`${type == "create" ? "Create" : "Edit"} Artist`}
        type="h1"
      />
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
        title={isCreatingArtist ? "Creating..." : "Save"}
        onPress={handleSubmit(onSubmit)}
        icon="circle-check"
        type="submit"
      />

      {/* Success message modal */}
      <SuccessModal
        isOpen={isOpen}
        handleClose={closeModal}
        title="Artist successfully created"
      />
    </KeyboardAwareScrollView>
  );
};
