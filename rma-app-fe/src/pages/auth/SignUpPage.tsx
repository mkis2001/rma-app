import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { FormContainer } from "../../components/form/formContainer";
import { FormTextInput } from "../../components/form/formTextInput";
import { LoadingScreen } from "../../components/LoadingScreen";
import { AlertModal } from "../../components/modal/AlertModal";
import { FormButton } from "../../components/pressable/formButton";
import { MenuItem } from "../../components/pressable/menuItem";
import { Header } from "../../components/typography/header";
import { supabase } from "../../services/Supabase";
import { UsernameAvailable } from "../../services/UserService";

type SignUpData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export const SignUpPage = ({ back }: { back: () => void }) => {
  const { control, handleSubmit } = useForm<SignUpData>();
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalDescription, setModalDescription] = useState("");

  const signUpWithEmail = async (data: SignUpData) => {
    if (data.password !== data.confirmPassword) {
      setModalDescription("Passwords do not match");
      setIsOpen(true);
      return;
    }
    setLoading(true);

    const { available } = await UsernameAvailable(data.username);
    if (!available) {
      setModalDescription("Username is not available");
      setIsOpen(true);
      setLoading(false);
      return;
    }
    const { data: signInData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setModalDescription(error.message);
      setIsOpen(true);
    }
    if (signInData) {
      console.log(signInData);
    }
    setLoading(false);
  };

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <View>
      <MenuItem title="Back" onPress={back} />
      <Header title="Sign Up" />
      <FormContainer>
        <FormTextInput
          name="username"
          label="Username"
          placeholder="Enter your username"
          control={control}
        />
        <FormTextInput
          name="email"
          label="Email"
          placeholder="Enter your email"
          control={control}
        />
        <FormTextInput
          name="password"
          label="Password"
          placeholder="Enter your password"
          control={control}
          secureTextEntry={true}
        />
        <FormTextInput
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm password"
          control={control}
          secureTextEntry={true}
        />
        <FormButton
          title="Sign Up"
          type="submit"
          onPress={handleSubmit(signUpWithEmail)}
        />
      </FormContainer>

      <AlertModal
        title="Error"
        description={modalDescription}
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      />
    </View>
  );
};
