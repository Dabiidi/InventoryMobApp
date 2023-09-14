import React, { useState, useEffect } from "react";
import { View, Button, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  BarcodeBox,
  StyledBarCodeScanner,
  Texts,
  Container,
  OutputData,
} from "../../Styles/SearchStyle";

interface Items {
  name: string;
  quantity: number;
  total: number;
}
const ScantoSearch = () => {
  const [hasPermission, setHasPermission] = useState<Boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [text, setText] = useState<string>("Not yet Scanned");
  const [itemData, setItemData] = useState<any | null>(null);
  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const scanFalse = () => {
    setScanned(false);
    setText("");
    setItemData("");
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    setText(data);

    const [Name] = data.split(",");

    // Check the database for the item using the item's name
    const itemExists = await checkItemExistence(Name);

    if (itemExists) {
      console.log("ITEMS HERE", itemExists);

      // Fetch and display item data from the database
      alert("Item Found!");
      setItemData(itemExists);
    } else {
      setItemData("Item not found in the database");
    }
  };

  const checkItemExistence = async (itemName: string) => {
    try {
      const response = await fetch(
        `http://192.168.110.237:4000/inventoryapp/itemlist/${itemName}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("The data", data);
        return data;
      } else {
        // Handle error response
        console.error("Error checking item existence");
        return false;
      }
    } catch (error) {
      // Handle connection errors
      console.error("Error:", error);
      return false;
    }
  };

  if (hasPermission === false) {
    return (
      <View>
        <Texts style={{ margin: 10 }}> No access to camera.</Texts>
        <Button
          title={"allow camera"}
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }

  return (
    <>
      <Container>
        <Texts>Scan QR to Search an Item</Texts>
        <BarcodeBox>
          <StyledBarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
        </BarcodeBox>

        <Container>
          <OutputData>Scanned Data: {text}</OutputData>

          <OutputData>Item Name: {itemData?.name}</OutputData>
          <OutputData>Item Quantity: {itemData?.quantity}</OutputData>
          <OutputData>Item Total: {itemData?.price}</OutputData>
          <OutputData>Item Description: {itemData?.desc}</OutputData>

          <Button
            title={"Scan again?"}
            onPress={() => scanFalse()}
            color="tomato"
          />
        </Container>
      </Container>
    </>
  );
};

export default ScantoSearch;
