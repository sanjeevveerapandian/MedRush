// services/firebaseDriver.js
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOWWziKbukqcKywzUILVVINkoVIIVvYxg",
  authDomain: "driver-cfd31.firebaseapp.com",
  projectId: "driver-cfd31",
  storageBucket: "driver-cfd31.appspot.com",
  messagingSenderId: "1029882714542",
  appId: "1:1029882714542:web:0685026e84c0072ed7903f",
  measurementId: "G-KSJHE2PZTN",
  databaseURL:
    "https://driver-cfd31-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase only if it hasn't been initialized yet
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Export the initialized database instance
export const database = getDatabase();
