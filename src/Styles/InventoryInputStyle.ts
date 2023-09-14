import styled from "styled-components/native";
import { BarCodeScanner } from "expo-barcode-scanner";

export const ModalContainer = styled.View`
  padding: 0 20px;
  background-color: #fff;
  height: 50px;
  margin-top: 20px;
  flex: 1;
`;

export const ModalBackground = styled.View`
  background-color: white;
`;

export const Input = styled.TextInput`
  border-bottom-width: 2px;
  border-bottom-color: black;
  font-size: 15px;
  color: black;
  margin-top: 20px;
`;

export const Texts = styled.Text`
  font-size: 30px;
  left: 50px;
  margin-top: 20px;
`;

export const BarcodeBox = styled.View`
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 300px;
  overflow: hidden;
  border-radius: 30px;
  background-color: tomato;
  left: 25px;
`;

export const StyledBarCodeScanner = styled(BarCodeScanner)`
  width: 400px;
  height: 400px;
`;
