import React from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { styled } from "styled-components/native";

type Item = {
  name: string;
  quantity: number;
  price: number;
  desc: string;
};

type MyProps = {
  item: Item;
  onPress: (item: any) => void;
};
const InventoryComponent = ({ item, onPress }: MyProps) => {
  // const renderItem: ListRenderItem<Item> = ({ item }) => {


  const { name, quantity, price, desc } = item;

  return (
    <TouchableOpacity onPress={onPress}>
      <Container>
        <Name>Item Name: {name}</Name>
        <InfoText>Quantity: {quantity}</InfoText>
        <InfoText>Price: {price}</InfoText>
        <InfoText>Description: {desc}</InfoText>
      </Container>
    </TouchableOpacity>
  );
};

const Container = styled.View`
  background-color: #2f4f4f;
  padding: 20px;
  margin-top: 8px;
  border-radius: 8px;
`;

const Name = styled.Text`
  font-weight: bold;
  font-size: 20px;
  color: #fff;
`;

const InfoText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #fff;
`;

export default InventoryComponent;
