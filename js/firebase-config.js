// Firebase Configuration - Fourstyle
const firebaseConfig = {
  apiKey: "AIzaSyDSAK51a6XlqgfhK9oFPCzOLoCo5fxvpSk",
  authDomain: "fourstyle.firebaseapp.com",
  databaseURL: "https://fourstyle-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fourstyle",
  storageBucket: "fourstyle.firebasestorage.app",
  messagingSenderId: "1094714467126",
  appId: "1:1094714467126:web:b98e65419abdb1ccd24997",
  measurementId: "G-TFVHLLZRXM"
};

// Initialize Firebase (compat mode for simple use)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
