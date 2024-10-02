import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import BookingScreen from "./screens/BookingScreen"; // Import the BookingScreen
import UserTrackingScreen from "./screens/UserTrackingScreen"; // Import the UserTrackingScreen

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Setting background color for Login screen's header */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerStyle: { backgroundColor: "#f77f82" }, // Sets header background color
            headerTintColor: "#fff", // Sets color of text/icons in the header
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerStyle: { backgroundColor: "#f77f82" }, // Example color for Register
            headerTintColor: "#fff", // Color of the text/icons in the header
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerStyle: { backgroundColor: "#f77f82" }, // Example color for Dashboard
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={{
            headerStyle: { backgroundColor: "#f77f82" }, // Custom color for Booking Screen
            headerTintColor: "#fff", // White text color
            title: "Confirm Ride", // Custom title for the screen
          }}
        />
        <Stack.Screen
          name="UserTracking"
          component={UserTrackingScreen}
          options={{
            headerStyle: { backgroundColor: "#f77f82" }, // Custom color for User Tracking Screen
            headerTintColor: "#fff", // White text color
            title: "Track Driver", // Custom title for the screen
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
