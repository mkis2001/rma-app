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
import { getArtistsShort } from "../../services/ArtistService";
import { createProject, getProjectTypes } from "../../services/ProjectService";
import { CreateProject } from "../../types/projectTypes";

type ProjectFormProps = RouteProp<RootStackParamList, "ProjectForm">;

type Props = {
  route: ProjectFormProps;
};

export const ProjectForm = ({ route }: Props) => {
  const { type } = route.params;
  const { control, handleSubmit } = useForm<CreateProject>();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const createProjectMutation = useMutation({
    mutationFn: (data: CreateProject) => {
      setIsCreatingProject(true);
      return createProject(data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({ queryKey: ["projectsShort"] }),
      ]);
      setIsOpen(true);
    },
    onSettled: () => {
      setIsCreatingProject(false);
    },
  });

  const { data: artists, isLoading: isArtistsLoading } = useQuery({
    queryKey: ["artists"],
    queryFn: () => getArtistsShort(),
  });
  const { data: projectTypes, isLoading: isProjectTypesLoading } = useQuery({
    queryKey: ["projectTypes"],
    queryFn: () => getProjectTypes(),
  });

  const onSubmit = (data: CreateProject) => {
    createProjectMutation.mutate(data);
  };

  const closeModal = () => {
    setIsOpen(false);
    navigation.goBack();
  };

  return (
    !isArtistsLoading &&
    !isProjectTypesLoading && (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Header
          title={`${type == "create" ? "Create" : "Edit"} Project`}
          type="h1"
        />
        <FormContainer>
          <FormTextInput
            control={control}
            name="name"
            label="Name"
            placeholder="Project name"
          />
          <FormSelectInput
            control={control}
            name="typeId"
            label="Project type"
            placeholder="Select a project type"
            options={
              projectTypes?.map((type) => ({
                label: type.name,
                value: type.id,
              })) || []
            }
          />
          <FormTextInput
            control={control}
            name="description"
            label="Description"
            placeholder="Project description..."
            multiline={true}
          />
          <FormSelectInput
            control={control}
            name="artistId"
            label="Artist"
            placeholder="Select an artist"
            options={
              artists?.map((artist) => ({
                label: artist.name,
                value: artist.id,
              })) || []
            }
          />
        </FormContainer>
        <FormButton
          title={isCreatingProject ? "Creating..." : "Save"}
          onPress={handleSubmit(onSubmit)}
          icon="circle-check"
          type="submit"
        />

        {/* Success message modal */}
        <SuccessModal
          isOpen={isOpen}
          handleClose={closeModal}
          title="Project successfully created"
        />
      </KeyboardAwareScrollView>
    )
  );
};
