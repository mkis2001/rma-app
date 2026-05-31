import { RouteProp, useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormContainer } from "../../components/form/formContainer";
import { FormSelectInput } from "../../components/form/formSelectInput";
import { FormTextInput } from "../../components/form/formTextInput";
import { SuccessModal } from "../../components/modal/SuccessModal";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { FormButton } from "../../components/pressable/formButton";
import { Header } from "../../components/typography/header";
import { getProjectsShort } from "../../services/ProjectService";
import { createSong } from "../../services/SongService";
import { CreateSong } from "../../types/songTypes";

type SongFormProps = RouteProp<RootStackParamList, "SongForm">;

type Props = {
  route: SongFormProps;
};

export const SongForm = ({ route }: Props) => {
  const { type } = route.params;
  const { control, handleSubmit } = useForm<CreateSong>();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const [isCreatingSong, setIsCreatingSong] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const createSongMutation = useMutation({
    mutationFn: (data: CreateSong) => {
      setIsCreatingSong(true);
      return createSong(data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["songs"] }),
        queryClient.invalidateQueries({ queryKey: ["projectSongs"] }),
      ]);
      setIsOpen(true);
    },
    onSettled: () => {
      setIsCreatingSong(false);
    },
  });

  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["projectsShort"],
    queryFn: () => getProjectsShort(),
  });

  const onSubmit = (data: CreateSong) => {
    createSongMutation.mutate(data);
  };
  const closeModal = () => {
    setIsOpen(false);
    navigation.goBack();
  };

  return (
    !isProjectsLoading && (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Header
          title={`${type == "create" ? "Create" : "Edit"} Song`}
          type="h1"
        />
        <FormContainer>
          <FormTextInput
            control={control}
            name="name"
            label="Name"
            placeholder="Song name"
          />
          <FormSelectInput
            control={control}
            name="projectId"
            label="Project"
            placeholder="Select a project"
            options={
              projects?.map((project) => ({
                label: project.name,
                value: project.id,
              })) || []
            }
          />
          <FormTextInput
            control={control}
            name="lyrics"
            label="Lyrics"
            placeholder="Song lyrics..."
            multiline={true}
          />
        </FormContainer>
        <FormButton
          title={isCreatingSong ? "Creating..." : "Save"}
          onPress={handleSubmit(onSubmit)}
          icon="circle-check"
          type="submit"
        />

        {/* Success message modal */}
        <SuccessModal
          isOpen={isOpen}
          handleClose={closeModal}
          title="Song successfully created"
        />
      </KeyboardAwareScrollView>
    )
  );
};
