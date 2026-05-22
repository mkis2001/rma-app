import { RouteProp } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { FormContainer } from "../../components/form/formContainer";
import { FormTextInput } from "../../components/form/formTextInput";
import { RootStackParamList } from "../../components/navigation/Navigation";
import { FormButton } from "../../components/pressable/formButton";
import { Header } from "../../components/typography/header";

type ProjectFormProps = RouteProp<RootStackParamList, "ProjectForm">;

type Props = {
  route: ProjectFormProps;
};

export const ProjectForm = ({ route }: Props) => {
  const { type } = route.params;
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <View>
      <Header
        title={`${type == "create" ? "Create" : "Edit"} Project`}
        type="h1"
      />
      <FormContainer>
        <FormTextInput
          control={control}
          name="name"
          placeholder="Project name"
        />
        <FormTextInput
          control={control}
          name="description"
          placeholder="Project description"
          multiline={true}
        />
      </FormContainer>
      <FormButton
        title={type == "create" ? "Create" : "Save"}
        onPress={handleSubmit(onSubmit)}
        icon="circle-check"
        type="submit"
      />
    </View>
  );
};
