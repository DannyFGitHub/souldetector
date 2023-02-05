// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  where,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUatCHTZqXdAJQrVca5JTLqN8rWB9B9e0",
  authDomain: "mentiras-282c2.firebaseapp.com",
  projectId: "mentiras-282c2",
  storageBucket: "mentiras-282c2.appspot.com",
  messagingSenderId: "783934346983",
  appId: "1:783934346983:web:9e0db71c052f4ff34eb442",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Use anonymous authentication
if (!auth.currentUser) {
  signInAnonymously(auth)
    .then((userCredential) => {
      // Signed in..
      const user = userCredential.user;
      console.log("User: ", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error: ", errorCode, errorMessage);
    });
}

async function loadRequests(onLoad) {
  if (auth.currentUser) {
    const myRequestsQuery = query(
      collection(db, "requestQueue"),
      // orderBy("timestamp", "desc"),
      where("userId", "==", auth.currentUser.uid)
      //   where("status", "==", "processed")
    );
    const myRequests = await getDocs(myRequestsQuery);
    myRequests.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      onLoad(id, data.requestText, data.response, data.status, data.timestamp);
    });
  }
}

// Submit a request to requestQueue collection, status pending, textRequest is the text to be translated
export function submitRequest(requestText) {
  addDoc(collection(db, "requestQueue"), {
    userId: auth.currentUser.uid,
    status: "pending",
    requestText,
    timestamp: serverTimestamp(),
  }).then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  });
}

export { loadRequests };
