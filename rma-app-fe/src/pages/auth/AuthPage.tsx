import { useState } from "react";
import { View } from "react-native";
import { MenuItem } from "../../components/pressable/menuItem";
import { Header } from "../../components/typography/header";
import { LoginPage } from "./LoginPage";
import { SignUpPage } from "./SignUpPage";

export const AuthPage = () => {
  const [page, setPage] = useState<"login" | "register" | null>(null);

  return (
    <View>
      {page === null && (
        <>
          <Header title="Welcome to RMA App" />
          <MenuItem title="Login" onPress={() => setPage("login")} />
          <MenuItem title="Sign Up" onPress={() => setPage("register")} />
        </>
      )}
      {page === "login" && <LoginPage back={() => setPage(null)} />}
      {page === "register" && <SignUpPage back={() => setPage(null)} />}
    </View>
  );
};
