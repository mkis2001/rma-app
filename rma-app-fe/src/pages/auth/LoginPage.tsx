import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { FormContainer } from "../../components/form/formContainer";
import { FormTextInput } from "../../components/form/formTextInput";
import { LoadingScreen } from "../../components/LoadingScreen";
import { FormButton } from "../../components/pressable/formButton";
import { MenuItem } from "../../components/pressable/menuItem";
import { Header } from "../../components/typography/header";
import { supabase } from "../../services/Supabase";

type LoginData = {
  email: string;
  password: string;
};

export const LoginPage = ({ back }: { back: () => void }) => {
  const { control, handleSubmit } = useForm<LoginData>();
  const [isLoading, setLoading] = useState(false);

  const logInWithEmail = async (data: LoginData) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setLoading(false);
  };

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <View>
      <MenuItem title="Back" onPress={back} />
      <Header title="Login" />
      <FormContainer>
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
        <FormButton
          title="Login"
          type="submit"
          onPress={handleSubmit(logInWithEmail)}
        />
      </FormContainer>
    </View>
  );
};
