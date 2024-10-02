import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient"; // Importing LinearGradient
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"; // Importing Places Autocomplete

const hospitalOptions = ["Government Hospitals", "Private Hospitals"];

export default function DashboardScreen({ navigation }) {
  const [region, setRegion] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(
    "Select Hospital Type"
  );
  const [loading, setLoading] = useState(false);

  // Function to get the user's location
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied."
      );
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const confirmLocation = async () => {
    if (selectedHospital === "Select Hospital Type") {
      Alert.alert("Error", "Please select a hospital type.");
      return;
    }

    setLoading(true);
    try {
      fetch(
        "https://medrush-e34ac-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Location Data",
            body: `Latitude: ${region.latitude}, Longitude: ${region.longitude}`,
            hospitalType: selectedHospital,
            userId: 1,
          }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((json) => {
          console.log("Data sent to Firebase:", json);
          Alert.alert(
            "Success",
            "Location data sent to Firebase successfully."
          );
          // Navigate to the Booking screen
          navigation.navigate("Booking");
        })
        .catch((error) => {
          console.error("Error sending data to Firebase:", error);
          Alert.alert("Error", "Failed to send data to Firebase.");
        });
    } catch (error) {
      console.error("Error sending data: ", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <LinearGradient colors={["#ff9a9e", "#fad0c4"]} style={styles.container}>
      {/* MedRush Logo */}
      <View style={styles.header}>
        <Text style={styles.title}>MEDRUSH</Text>
      </View>

      {/* Google Places Autocomplete */}
      <GooglePlacesAutocomplete
        placeholder="Search for a location"
        fetchDetails={true} // This enables detailed search results
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          const { lat, lng } = details.geometry.location;
          setRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }}
        query={{
          key: "AIzaSyDbGjgmXj-yRCDJJKK4_LI8dMuWF8G806k", // Replace with your Google Maps API Key
          language: "en", // Set the language for the results
        }}
        styles={{
          container: { flex: 0 },
          textInputContainer: {
            flexDirection: "row",
            alignItems: "center",
            margin: 15,
            backgroundColor: "#fff",
            paddingHorizontal: 15,
            borderRadius: 20,
            elevation: 5,
          },
          textInput: {
            flex: 1,
            paddingVertical: 10,
            color: "#333",
          },
        }}
      />

      {/* Hospital Selector */}
      <View style={styles.hospitalContainer}>
        <TouchableOpacity
          style={styles.hospitalButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.hospitalText}>{selectedHospital}</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Hospital Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={hospitalOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.hospitalItem}
                  onPress={() => {
                    setSelectedHospital(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.hospitalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* GPS Location Button */}
      <View style={styles.gpsContainer}>
        <TouchableOpacity onPress={getLocation} style={styles.gpsButton}>
          <MaterialIcons name="my-location" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Google Maps View */}
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
        />
      </MapView>

      {/* Confirm Location Button */}
      <View style={styles.confirmContainer}>
        <TouchableOpacity
          onPress={confirmLocation}
          style={styles.confirmButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Placeholder */}
      <View style={styles.bottomNav}>
        <MaterialIcons name="home" size={30} color="#ff6347" />
        <MaterialIcons name="person" size={30} color="#ff6347" />
        <MaterialIcons name="chat" size={30} color="#ff6347" />
      </View>
    </LinearGradient>
  );
}

// Enhanced Styles for DashboardScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#f77f82",
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#333",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  hospitalContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  hospitalButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6347",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 3,
  },
  hospitalText: {
    marginRight: 5,
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  hospitalItem: {
    padding: 15,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  hospitalItemText: {
    fontSize: 18,
    color: "#333",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f77f82",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  gpsContainer: {
    alignItems: "flex-end",
    margin: 10,
  },
  gpsButton: {
    backgroundColor: "#ff6347",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  map: {
    flex: 1,
    width: "100%",
    borderRadius: 20,
    marginVertical: 10,
    elevation: 4,
    overflow: "hidden", // Ensures the rounded corners apply to the MapView
  },
  confirmContainer: {
    padding: 15,
    alignItems: "center",
    backgroundColor: "#f77f82",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 3,
  },
  confirmButton: {
    backgroundColor: "#ff6347",
    padding: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 4,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 4,
  },
});
