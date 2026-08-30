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
import { getArtistsShort } from "../../services/ArtistService";
import {
  createProject,
  getProjectTypes,
  updateProject,
} from "../../services/ProjectService";
import { CreateProject, Project } from "../../types/projectTypes";
import {
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
} from "../../constants";

type ProjectFormProps = RouteProp<RootStackParamList, "ProjectForm">;

type ProjectFormNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "ProjectForm"
>;

type Props = {
  route: ProjectFormProps;
};

export const ProjectForm = ({ route }: Props) => {
  const params = route.params;
  const isEdit = params.type === "edit";
  const project = isEdit ? params.project : undefined;

  const { control, handleSubmit } = useForm<CreateProject>({
    defaultValues: {
      name: project?.name ?? "",
      typeId: project?.type?.id,
      description: project?.description ?? "",
      artistId: project?.artist?.id,
    },
  });
  const queryClient = useQueryClient();
  const navigation = useNavigation<ProjectFormNavigation>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [updatedProject, setUpdatedProject] = useState<Project | undefined>();

  const projectMutation = useMutation({
    mutationFn: (data: CreateProject) => {
      setIsSubmitting(true);
      return isEdit && project
        ? updateProject(project.id, data)
        : createProject(data);
    },
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({ queryKey: ["projectsShort"] }),
      ]);
      setUpdatedProject(result);
      setIsOpen(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const { data: artists, isLoading: isArtistsLoading } = useQuery({
    queryKey: ["artistsShort"],
    queryFn: () => getArtistsShort(),
  });
  const { data: projectTypes, isLoading: isProjectTypesLoading } = useQuery({
    queryKey: ["projectTypes"],
    queryFn: () => getProjectTypes(),
  });

  const onSubmit = (data: CreateProject) => {
    projectMutation.mutate(data);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (isEdit && updatedProject) {
      navigation.popTo("ProjectPage", { project: updatedProject });
    } else {
      navigation.goBack();
    }
  };

  return (
    !isArtistsLoading &&
    !isProjectTypesLoading && (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Header title={`${isEdit ? "Edit" : "Create"} Project`} type="h1" />
        <FormContainer>
          <FormTextInput
            control={control}
            name="name"
            label="Name"
            placeholder="Project name"
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
            name="typeId"
            label="Project type"
            placeholder="Select a project type"
            rules={{ required: "Project type is required" }}
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
            rules={{
              maxLength: {
                value: DESCRIPTION_MAX_LENGTH,
                message: `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`,
              },
            }}
          />
          <FormSelectInput
            control={control}
            name="artistId"
            label="Artist"
            placeholder="Select an artist"
            rules={{ required: "Artist is required" }}
            options={
              artists?.map((artist) => ({
                label: artist.name,
                value: artist.id,
              })) || []
            }
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
          title={`Project successfully ${isEdit ? "updated" : "created"}`}
        />
      </KeyboardAwareScrollView>
    )
  );
};
