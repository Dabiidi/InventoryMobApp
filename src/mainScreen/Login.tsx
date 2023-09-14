import {
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  LoginButton,
  LoginContainer,
  ButtonText,
  Texts,
  EmailInput,
  PassInput,
  Logo,
  Header,
} from "../Styles/LoginStyle";
import axios from "axios";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

interface LoginFormProps {
  navigate: (screen: string, params?: object) => void;
}
interface LandingScreenProps {
  navigation: LoginFormProps;
}

const Login: React.FC<LandingScreenProps> = ({ navigation }) => {
  const { navigate } = navigation;

  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  }); // Asking for values of email and password
  const [errors, setErrors] = useState<LoginFormErrors>({}); // Check if the user fill data is incorrect

  const validateEmail = (email: string) => {
    // Check email validation

    const emailRegex = /\S+@\S+\.\S+/; //Regix method
    if (!emailRegex.test(email)) {
      //test all the users input and check if it followed the regex method
      return "Invalid email address";
    }
    return undefined;
  };

  const validatePassword = (password: string) => {
    // Check password validation
    if (password.length < 6) {
      //Password must be more than 6 characters
      return "Password must be at least 6 characters";
    }
    return undefined;
  };

  const handleChange = (name: keyof LoginFormValues, value: string) => {
    // check the input
    setValues({ ...values, [name]: value }); // spread operator ...
    setErrors({ ...errors, [name]: undefined });
  };
  const handleSubmit = async () => {
    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
    } else {
      try {
        const handleSubmit = async () => {
          const emailError = validateEmail(values.email);
          const passwordError = validatePassword(values.password);

          if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
          } else {
            try {
              console.log(values.email, values.password);
              const response = await axios.post(
                "http://192.168.110.237:4000/inventoryapp/userlogs",
                { name: values.email, pass: values.password }
              ); //own ip (android)
              //10.0.2.2
              console.log("Login Success", response);

              navigate("Inventory Screen", { email: values.email });
            } catch (error: any) {
              console.log("Error Login", error.message);
            }
          }
        };

        console.log(values.email, values.password);
        const response = await axios.post(
          "http://192.168.110.237:4000/inventoryapp/userlogs",
          { name: values.email, pass: values.password }
        ); //own ip (android)
        //10.0.2.2
        navigate("Inventory Screen", { email: values.email });
      } catch (error: any) {
        console.log("Error Password", error.message);
      }
    }
  };

  return (
    <>
      <ScrollView>
        <KeyboardAvoidingView
          behavior="padding"
          style={{ backgroundColor: "#FFFFDD" }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LoginContainer>
              <StatusBar style="auto" />
              <Logo source={require("../Images/Logo1.png")} />
              <Texts> Inventory Manager </Texts>

              <EmailInput
                placeholder="Email"
                value={values.email}
                onChangeText={(value) => handleChange("email", value)}
              />
              {errors.email && (
                <Text style={{ color: "red" }}>{errors.email}</Text>
              )}

              <PassInput
                placeholder="Password"
                secureTextEntry
                value={values.password}
                onChangeText={(value) => handleChange("password", value)}
              />
              {errors.password && (
                <Text style={{ color: "red" }}>{errors.password}</Text>
              )}

              <LoginButton onPress={handleSubmit}>
                <ButtonText>Login</ButtonText>
              </LoginButton>
            </LoginContainer>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        <Header></Header>
      </ScrollView>
    </>
  );
};
export default Login;
