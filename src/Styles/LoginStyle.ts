import { TextInput } from "react-native";
import styled from "styled-components/native";

export const Header = styled.View`
  background-color: #ffffdd;
  height: 250px;
`;
export const LoginContainer = styled.View`
  flex: 1;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 100px;
  gap: 20px;

  background-color: #ffffdd;
`;

export const LoginText = styled.Text`
  font-size: 30px;
  font-weight: 600;
  margin-vertical: 40px;
`;

export const Logo = styled.Image`
  margin-top: 50px;
  width: 100px;
  height: 100px;
`;

export const Texts = styled.Text`
  color: #000000;

  font-size: 30px;
`;

export const EmailInput = styled(TextInput).attrs({ placeholder: "Email" })`
  background-color: #d3d3d3;
  height: 50px;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
`;

export const PassInput = styled(TextInput).attrs({
  placeholder: "Password",
  secureTextEntry: true,
})`
  background-color: #d3d3d3;
  height: 50px;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
`;
export const LoginButton = styled.TouchableOpacity`
  background-color: #016a70;
  height: 60px;
  width: 100%;
  border-radius: 40px;
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  font-size: 23px;
  font-weight: 400;
  color: #fff;
`;

export const ForgotPassword = styled.Text`
  color: #5db075;
  font-size: 18px;
  font-weight: 500;
`;
