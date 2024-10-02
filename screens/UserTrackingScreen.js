// Import necessary modules
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getDatabase, ref, set } from "firebase/database";

export default function DriverLocationUpdater() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Initialize the Firebase Realtime Database
  const database = getDatabase();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Watch position updates
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update when the driver moves 10 meters
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setLocation({ latitude, longitude });

          // Send live location to Firebase
          set(ref(database, "rides/activeDriver"), {
            latitude: latitude,
            longitude: longitude,
          });
        }
      );

      return () => {
        // Unsubscribe from location updates when component unmounts
        locationSubscription.remove();
      };
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{errorMsg ? errorMsg : "Waiting for location..."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01, // Smaller delta for a more zoomed-in view
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true} // Optional: Shows device's location as well
        followsUserLocation={true} // Optional: Centers map on the driver's location
      >
        {/* Driver's live location marker */}
        <Marker
          coordinate={location}
          title={"Driver's Location"}
          description={"This is the driver's current location"}
          pinColor="red" // Custom marker color
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
  },
});
