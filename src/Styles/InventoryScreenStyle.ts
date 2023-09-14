import { TextInput } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
  justify-content: center;
  padding: 0 10px;
  border-radius: 15px;
`;
export const ScanSearch = styled.TouchableOpacity`
  background-color: #e5d283;
  border-radius: 20px;
  font-weight: bold;
  margin-top: 8px;
`;

export const WelcomeText = styled.Text`
  flex-direction: row;
  align-items: center;
  font-weight: bold;
`;

export const Headers = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TextStyle = styled.Text`
  font-size: 18px;
  color: #fff;
  padding: 10px 20px;
  text-align: center;
  font-weight: bold;
`;
export const SearchStyle = styled.Text`
  font-size: 18px;
  color: #000;
  padding: 10px 20px;
  text-align: center;
  font-weight: bold;
`;
export const SearchInput = styled(TextInput).attrs({
  placeholder: "Search an item",
})`
  margin-top: 5px;
  flex-direction: row;
  background-color: #d3d3d3;
  height: 50px;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
`;

export const LogoutButton = styled.TouchableOpacity`
  background-color: #2f4f4f;
  border-radius: 20px;
  font-weight: bold;
  margin-top: 8px;
`;

