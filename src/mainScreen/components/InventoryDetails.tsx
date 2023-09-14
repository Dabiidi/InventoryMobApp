import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, TextInput } from "react-native";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import { Alert } from "react-native";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { useInventory } from "../Context/InventoryContext";
import InventoryInputModel from "./InventoryInputModel";

import {
  Container,
  Name,
  Total,
  Price,
  Desc,
  TextInputs,
  Buttons,
  ButtonText,
} from "../../Styles/InventoryDetailStyle";
import axios from "axios";

type Item = {
  name: string;
  quantity: number;
  price: number;
  desc: string;
};

type InventoryDetailRouteParamList = {
  "Inventory Detail": {
    inventory: Item;
  };
};

type Props2 = {
  route: RouteProp<InventoryDetailRouteParamList, "Inventory Detail">;
};

const InventoryDetails: React.FC<Props2> = ({ route }: Props2) => {
  const { inventory } = route.params;
  console.log(inventory.name);
  const navigation = useNavigation();
  const { setInventories } = useInventory();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const deleteInventory = async () => {
    try {
      const response = await axios.delete(
        `http://192.168.110.237:4000/inventoryapp/itemlist/${inventory.name}`
      );
      // The DELETE request was successful
      // You can handle any further logic here

      if (response.status === 200) {
        setInventories((prevInventories) =>
          prevInventories.filter((item: Item) => item.name !== inventory.name)
        );
        Alert.alert(
          "Delete an item",
          `Item ${inventory.name} is deleted from the Inventory.`,
          [
            {
              text: "Ok",
              onPress: () => console.log("Deleted"),
            },
          ]
        );

        navigation.goBack();
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting inventory:", error);
    }
  };

  const displayDeleteAlert = () => {
    Alert.alert(
      "Delete an item",
      "This action will delete your item in your inventory!",
      [
        {
          text: "No Thanks",
          onPress: () => console.log("no thanks"),
        },

        {
          text: "Delete",

          onPress: () => deleteInventory(),
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const handleUpdate = async (
    name: string,
    quantity: number,
    price: number,
    desc: string
  ) => {
    const updatedInventory = {
      ...inventory,
      name,
      quantity,
      price,
      desc,
    };

    try {
      const response = await fetch(
        `http://192.168.110.237:4000/inventoryapp/itemlist/${inventory.name}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedInventory),
        }
      );
      if (response.ok) {
        setInventories((prevInventories) =>
          prevInventories.map((item: Item) =>
            item.name === inventory.name ? updatedInventory : item
          )
        );
        Alert.alert(
          "Item Updated",
          `Item ${inventory.name} Updated to the Inventory.`,
          [
            {
              text: "Ok",
              onPress: () => navigation.goBack(),
            },
          ]
        );
        handleOnClose();
      } else {
        console.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };
  const handleOnClose = () => {
    setShowModal(false);
    setIsEdit(false); // Reset isEdit state
  };

  const openEditModal = () => {
    setIsEdit(false);
    setShowModal(true);
  };
  const [addQuantity, setAddQuantity] = useState(""); // State for adding quantity
  const [deductQuantity, setDeductQuantity] = useState(""); // State for deducting quantity

  const handleAddQuantity = async () => {
    const newQuantity = parseInt(addQuantity);

    if (!isNaN(newQuantity)) {
      const updatedInventory = {
        ...inventory,
        quantity: inventory.quantity + newQuantity, // Add the input quantity
      };

      await updateInventory(updatedInventory);
    }
  };

  const handleDeductQuantity = async () => {
    const newQuantity = parseInt(deductQuantity);

    if (!isNaN(newQuantity) && inventory.quantity >= newQuantity) {
      const updatedInventory = {
        ...inventory,
        quantity: inventory.quantity - newQuantity, // Deduct the input quantity
      };

      await updateInventory(updatedInventory);
    }
  };

  const updateInventory = async (updatedInventory: Item) => {
    try {
      const response = await fetch(
        `http://192.168.110.237:4000/inventoryapp/itemlist/${inventory.name}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedInventory),
        }
      );
      if (response.ok) {
        setInventories((prevInventories) =>
          prevInventories.map((item: Item) =>
            item.name === inventory.name ? updatedInventory : item
          )
        );
        Alert.alert(
          "Item Updated",

          `Item ${inventory.name} is updated to the Inventory.`,

          [
            {
              text: "Ok",
              onPress: () => navigation.goBack(),
            },
          ]
        );
        handleOnClose();
      } else {
        console.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  return (
    <>
      <Container>
        <Name>Item Name: {inventory.name}</Name>
        <Total>Total: {inventory.quantity}</Total>
        <Price>Price: {inventory.price}</Price>
        <Desc>Description: {inventory.desc}</Desc>

        <DeleteButton onPress={displayDeleteAlert} />
        <EditButton onPress={openEditModal} />

        <InventoryInputModel
          isEdit={isEdit}
          inventory={inventory}
          visible={showModal}
          onClose={handleOnClose}
          onSubmit={handleUpdate}
        />
      </Container>

      <TextInputs
        placeholder="Add Quantity"
        keyboardType="numeric"
        onChangeText={(text: any) => setAddQuantity(text)}
      />
      <Buttons onPress={handleAddQuantity}>
        <ButtonText>Add Item Quantity</ButtonText>
      </Buttons>

      <TextInputs
        placeholder="Deduct Quantity"
        keyboardType="numeric"
        onChangeText={(text: any) => setDeductQuantity(text)}
      />
      <Buttons onPress={handleDeductQuantity}>
        <ButtonText>Deduct Item Quantity</ButtonText>
      </Buttons>
    </>
  );
};

export default InventoryDetails;
