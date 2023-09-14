import styled from "styled-components/native";
import { BarCodeScanner } from "expo-barcode-scanner";

export const Container = styled.View`
  flex: 1;
`;

export const Button = styled.TouchableOpacity``;

export const BarcodeBox = styled.View`
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 300px;
  overflow: hidden;
  border-radius: 30px;
  background-color: tomato;
  left: 50px;
`;

export const StyledBarCodeScanner = styled(BarCodeScanner)`
  width: 400px;
  height: 400px;
`;

export const Texts = styled.Text`
  color: #000;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 50px;
  margin-top: 50px;
`;

export const OutputData = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;
