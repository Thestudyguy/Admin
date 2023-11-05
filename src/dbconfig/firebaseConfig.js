import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyCEr9ntVT2K79x-3x1bTl1E5wDyDqGE51Q",
  authDomain: "timeminder-e87c7.firebaseapp.com",
  databaseURL: "https://timeminder-e87c7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "timeminder-e87c7",
  storageBucket: "timeminder-e87c7.appspot.com",
  messagingSenderId: "1004941705061",
  appId: "1:1004941705061:web:a40b36ab0d60326e42ab8c",
  measurementId: "G-8F0E7DPLHP"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);