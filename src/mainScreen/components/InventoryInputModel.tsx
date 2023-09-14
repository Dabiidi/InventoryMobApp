import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import CustomButton from "./CustomButton";
import {
  ModalContainer,
  Texts,
  Input,
  ModalBackground,
  BarcodeBox,
  StyledBarCodeScanner,
} from "../../Styles/InventoryInputStyle";
import { StatusBar } from "expo-status-bar";

import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";

interface InventoryInputModelProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    quantity: number,
    price: number,
    desc: string
  ) => void; //pass  navigation
  isEdit: boolean;
  inventory: InventoryValues;
}

interface InventoryValues {
  name: string;
  quantity: number;
  price: number;
  desc: string;
}

const InventoryInputModel: React.FC<InventoryInputModelProps> = ({
  visible,
  onClose,
  onSubmit,
}: InventoryInputModelProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // boolean (permission true or false)
  const [scanned, setScanned] = useState<boolean>(false);
  const [text, setText] = useState<string>("Not yet scanned");

  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [desc, setDesc] = useState<string>("");

  const checkItemExistence = async (itemName: string) => {
    try {
      // Use axios to make the API request
      const response = await axios.get(
        `http://192.168.110.237:4000/inventoryapp/itemlist/${itemName}`
      );
      return response.data.exists;
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!name || !quantity || !price || !desc) {
      // Display an error message if any of the fields are empty
      alert("Please fill in all fields");
      return;
    }
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    const nameExists = await checkItemExistence(capitalizedName);
    if (nameExists) {
      alert("An item with this name already exists in the inventory");
      return;
    }

    if (
      !name &&
      !quantity.toString().trim() &&
      !price.toString().trim() &&
      !name.trim()
    )
      return onClose();

    onSubmit(name, quantity, price, desc);
    onClose();
    // Clear the form fields
    setName("");
    setQuantity(0);
    setPrice(0);
    setDesc("");
  };

  const closeModal = () => {
    onClose();
    //Clear
    setName("");
    setQuantity(0);
    setPrice(0);
    setDesc("");
  };

  const handleModalClose = () => {
    Keyboard.dismiss();
  };

  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    setText(data);

    // Extract and populate the form fields from the scanned dta
    const [Name, quant, price, Description] = data.split(",");
    setName(Name);
    setQuantity(parseInt(quant));
    setPrice(parseInt(price));
    setDesc(Description);

    console.log("Type: " + type + "\nData: " + data);
  };

  // Check permissions and return the screens
  if (hasPermission === false) {
    return (
      <View>
        <Texts style={{ margin: 10 }}>No access to camera</Texts>
        <Button
          title={"Allow Camera"}
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }

  const scanFalse = () => {
    setScanned(false);
    setName("");
    setQuantity(0);
    setPrice(0);
    setDesc("");
  };
  return (
    <>
      <Modal visible={visible} animationType="fade">
        <StatusBar style="auto" />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ModalContainer>
            <Texts>Add Inventory Item</Texts>

            <Input
              placeholder="Name"
              autoCapitalize="words"
              onChangeText={(text) => setName(text)}
              value={name}
            />
            <Input
              placeholder="Quantity"
              onChangeText={(text) => setQuantity(parseInt(text))}
              value={quantity ? quantity.toString() : ""}
              keyboardType="numeric"
            />
            <Input
              placeholder="Price"
              onChangeText={(text) => setPrice(parseFloat(text))}
              value={price ? price.toString() : ""}
              keyboardType="numeric"
            />
            <Input
              placeholder="Description"
              autoCapitalize="words"
              onChangeText={(text) => setDesc(text)}
              value={desc}
            />

            <CustomButton
              title="OK"
              backgroundColor="#2F4F4F"
              textColor="#fff"
              onPress={handleSubmit}
            />
            <CustomButton
              title="Cancel"
              backgroundColor="#2F4F4F"
              textColor="#fff"
              onPress={closeModal}
            />

            <BarcodeBox>
              <StyledBarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              />
            </BarcodeBox>

            {scanned && (
              <Button
                title={"Scan again?"}
                onPress={() => scanFalse()}
                color="tomato"
              />
            )}
          </ModalContainer>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={handleModalClose}>
          <ModalBackground />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default InventoryInputModel;
