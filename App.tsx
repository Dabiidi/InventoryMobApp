import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./src/mainScreen/Login";

import InventoryDetails from "./src/mainScreen/components/InventoryDetails";
import InventoryScreen from "./src/mainScreen/InventoryScreen";
import InventoryProviders from "./src/mainScreen/Context/InventoryContext";
import ScanSearch from "./src/mainScreen/components/ScantoSearch";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const Stack = createNativeStackNavigator();

const tabStack = createBottomTabNavigator();

const queryClient = new QueryClient();

export default function App() {
  const RenderDetaiScreen = (props: any) => <InventoryDetails {...props} />;

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <InventoryProviders>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Inventory Screen"
              component={InventoryScreen}
              options={{
                headerBackVisible: false,
              }}
            />
            <Stack.Screen name="Search Item QR" component={ScanSearch} />
            <Stack.Screen
              name="Inventory Detail"
              component={RenderDetaiScreen}
            />
          </Stack.Navigator>
        </InventoryProviders>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

// const Stack = createStackNavigator();
