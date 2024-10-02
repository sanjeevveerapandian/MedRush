import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { getDatabase, ref, set } from "firebase/database"; // Import Firebase functions
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMcyLhKE6XrppBhyB7LssyWZ77g6v5QHk",
  authDomain: "medrush-e34ac.firebaseapp.com",
  databaseURL:
    "https://medrush-e34ac-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "medrush-e34ac",
  storageBucket: "medrush-e34ac.appspot.com",
  messagingSenderId: "862532060031",
  appId: "1:862532060031:web:b43437c83c6c5e0211d04a",
  measurementId: "G-13VXDLJTRY",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function BookingScreen({ navigation }) {
  const handleConfirmBooking = () => {
    // Update the booking status in Firebase
    set(ref(database, "rides/bookingStatus"), {
      status: "confirmed",
      timestamp: Date.now(),
    })
      .then(() => {
        // Navigate to UserTrackingScreen
        navigation.navigate("UserTracking");
      })
      .catch((error) => {
        console.error("Error updating booking status:", error);
        Alert.alert("Error", "Failed to confirm the booking.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Please confirm your booking.</Text>
      <Button title="Confirm Booking" onPress={handleConfirmBooking} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
  },
});
