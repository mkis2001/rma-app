import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
import { createSong, updateSong } from "../../services/SongService";
import { CreateSong, Song } from "../../types/songTypes";
import {
  LYRICS_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
} from "../../constants";

type SongFormProps = RouteProp<RootStackParamList, "SongForm">;

type SongFormNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "SongForm"
>;

type Props = {
  route: SongFormProps;
};

export const SongForm = ({ route }: Props) => {
  const params = route.params;
  const isEdit = params.type === "edit";
  const song = isEdit ? params.song : undefined;
  const initialProjectId = isEdit ? song?.project?.id : params.projectId;

  const { control, handleSubmit } = useForm<CreateSong>({
    defaultValues: {
      name: song?.name ?? "",
      lyrics: song?.lyrics ?? "",
      projectId: initialProjectId,
    },
  });
  const queryClient = useQueryClient();
  const navigation = useNavigation<SongFormNavigation>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [updatedSong, setUpdatedSong] = useState<Song | undefined>();

  const songMutation = useMutation({
    mutationFn: (data: CreateSong) => {
      setIsSubmitting(true);
      return isEdit && song ? updateSong(song.id, data) : createSong(data);
    },
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["songs"] }),
        queryClient.invalidateQueries({ queryKey: ["projectSongs"] }),
      ]);
      setUpdatedSong(result);
      setIsOpen(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["projectsShort"],
    queryFn: () => getProjectsShort(),
  });

  const onSubmit = (data: CreateSong) => {
    songMutation.mutate(data);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (isEdit && updatedSong) {
      navigation.popTo("SongPage", { song: updatedSong });
    } else {
      navigation.goBack();
    }
  };

  return (
    !isProjectsLoading && (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Header title={`${isEdit ? "Edit" : "Create"} Song`} />
        <FormContainer>
          <FormTextInput
            control={control}
            name="name"
            label="Name"
            placeholder="Song name"
            rules={{
              required: "Name is required",
              minLength: {
                value: NAME_MIN_LENGTH,
                message: `Name must be at least ${NAME_MIN_LENGTH} characters`,
              },
              maxLength: {
                value: NAME_MAX_LENGTH,
                message: `Name must be at most ${NAME_MAX_LENGTH} characters`,
              },
            }}
          />
          <FormSelectInput
            control={control}
            name="projectId"
            label="Project"
            placeholder="Select a project"
            rules={{ required: "Project is required" }}
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
            rules={{
              maxLength: {
                value: LYRICS_MAX_LENGTH,
                message: `Lyrics must be at most ${LYRICS_MAX_LENGTH} characters`,
              },
            }}
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
          title={`Song successfully ${isEdit ? "updated" : "created"}`}
        />
      </KeyboardAwareScrollView>
    )
  );
};
