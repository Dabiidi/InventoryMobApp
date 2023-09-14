import React, { ReactNode, useEffect, useState, useContext } from "react";
import { ActivityIndicator, Text } from "react-native";
import {
  QueryClient,
  QueryClientProvider,
  isError,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";

type Item = {
  name: string;
  quantity: number;
  price: number;
  desc: string;
}; //iventory details

interface ItemContextType {
  inventories: Item[];
  setInventories: React.Dispatch<React.SetStateAction<Item[]>>;
  findInventory: () => void;
}

const initialContext: ItemContextType = {
  inventories: [],
  setInventories: () => {},
  findInventory: () => {},
};

interface InventoryProviderProps {
  children: ReactNode; // Use ReactNode type  for children prop (Pwede any values for the children)
}

const InventoryContext = React.createContext<ItemContextType>(initialContext); //Getting

const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [inventories, setInventories] = useState<Item[]>([]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["Items"],

    queryFn: async () => {
      const response = await axios.get(
        "http://192.168.110.237:4000/inventoryapp/itemlist"
      );

      return response.data;
    },
  });
  console.log(inventories);
  useEffect(() => {
    if (data && !isLoading) {
      setInventories(data);
    }
  }, [isLoading, data]);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text> Error gathering data.</Text>;
  const findInventory = () => data;

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;

  if (error) return <Text> Error gathering data.</Text>;
  return (
    <InventoryContext.Provider
      value={{ inventories, setInventories, findInventory }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);

export default InventoryProvider;
