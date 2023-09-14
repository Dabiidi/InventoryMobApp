import React, { isValidElement, useEffect, useState } from "react";
import { StyleSheet, Alert, FlatList, TextInput, Text } from "react-native";
import InventoryComponent from "../mainScreen/components/Inventory";
import FloatingButton from "../mainScreen/components/FloatingBtn";
import InventoryInputModel from "../mainScreen/components/InventoryInputModel";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";

import { useInventory } from "../mainScreen/Context/InventoryContext";
import {
  Container,
  Headers,
  ScanSearch,
  LogoutButton,
  SearchInput,
  TextStyle,
  WelcomeText,
  SearchStyle,
} from "../Styles/InventoryScreenStyle";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface NewItem {
  name: string;
  quantity: number;
  price: number;
  desc: string;
}

const InventoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [modalVisible, setModalVisible] = useState(false);
  const { inventories, setInventories } = useInventory();

  const [search, setSearch] = useState(""); // Search data

  const [masterDataSource, setMasterDataSource] = useState([]); // All data

  const navigateToScreen = (inventory: any) => {
    navigation.navigate("Inventory Detail", { inventory });
  };

  type DashboardScreenRouteParams = {
    email: string;
  };
  const route =
    useRoute<RouteProp<Record<string, DashboardScreenRouteParams>, string>>();

  const { email } = route.params;

  const addItemMutation = useMutation(
    async (newItem: NewItem) => {
      const response = await axios.post(
        "http://192.168.110.237:4000/inventoryapp/itemlist",
        newItem
      );
      return response.data;
    },
    {
      onSuccess: () => {
        // Trigger a manual refetch of the inventory data when an item is added.
        refetch();
      },
    }
  );

  const handleOnSubmit = async (
    name: string,
    quantity: number,
    price: number,
    desc: string
  ) => {
    // Capitalize the first letter of the item name
    const capitalizedItemName = name.charAt(0).toUpperCase() + name.slice(1);

    const newItem = {
      name: capitalizedItemName, // Use the capitalized name
      quantity,
      price,
      desc,
    };

    try {
      Alert.alert(`Successfully Added Item ${name}.`);

      await addItemMutation.mutateAsync(newItem);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const searchFilterFunction = (text: any) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the inventories
      const newData = inventories.filter(function (item) {
        // Applying filter for the inserted text in the search bar (Checking the name)
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setInventories(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setInventories(masterDataSource);
      setSearch(text);
    }
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["Items"],
    queryFn: async () => {
      const response = await axios.get(
        "http://192.168.110.237:4000/inventoryapp/itemlist"
      );

      setInventories(response.data);
      setMasterDataSource(response.data);
      return response.data;
    },
    staleTime: 5000, // 5 seconds in milliseconds
  });

  if (isLoading) return <Text> Loading dat</Text>;

  return (
    <>
      <Container>
        <Headers>
          <WelcomeText>Welcome: {email} </WelcomeText>
          <LogoutButton onPress={() => navigation.navigate("Login")}>
            <TextStyle>Logout</TextStyle>
          </LogoutButton>
        </Headers>
        <SearchInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          placeholder="Click here to search an item"
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
        />

        <ScanSearch onPress={() => navigation.navigate("Search Item QR")}>
          <SearchStyle>Scan To Search</SearchStyle>
        </ScanSearch>

        <FlatList
          data={inventories}
          renderItem={({ item }) => (
            <InventoryComponent
              onPress={() => navigateToScreen(item)}
              item={item}
            />
          )}
          scrollEnabled
          // renderItem={({item}) => (<InventoryComponent items={[item]} onPress={() => navigateToScreen(item) }></InventoryComponent>)}
          // keyExtractor={(item, index) => `${item.name}_${index}`}
          keyExtractor={(item) => item.name}
        />

        <FloatingButton onPress={() => setModalVisible(true)} title={""} />
      </Container>
      <InventoryInputModel
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleOnSubmit}
        isEdit={false}
        inventory={inventories[0]} // Pass a single item from the array
      ></InventoryInputModel>
    </>
  );
};

export default InventoryScreen;
