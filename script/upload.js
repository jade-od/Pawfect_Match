import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBq7_eJtK-lHLAifo55UwLGhsT5SKq5LP0",
  authDomain: "pawfect-match-55596.firebaseapp.com",
  projectId: "pawfect-match-55596",
  storageBucket: "pawfect-match-55596.appspot.com",
  messagingSenderId: "458265739863",
  appId: "1:458265739863:web:432d45d710963266611912",
  measurementId: "G-MHVQQD7XVR"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('uploadForm').onsubmit = async function (e) {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user.username || user.userType !== "shelter") {
    document.getElementById("uploadMsg").innerHTML = "<p style='color:red;'>Only logged-in shelters can upload pets.</p>";
    return;
  }
  const petData = {
    Name: document.getElementById('petName').value,
    Breed: document.getElementById('petBreed').value,
    Species: document.getElementById('petSpecies').value, // <-- species dropdown
    Age: Number(document.getElementById('petAge').value),
    Temperament: document.getElementById('petTemperament').value,
    daysInShelter: Number(document.getElementById('petDays').value),
    image: document.getElementById('petImage').value,
    Description: document.getElementById('petDescription').value,
    uploader: user.username
  };
  try {
    await addDoc(collection(db, "pets"), petData);
    document.getElementById("uploadMsg").innerHTML = "<p style='color:green;'>Pet uploaded successfully!</p>";
    document.getElementById("uploadForm").reset();
  } catch (err) {
    document.getElementById("uploadMsg").innerHTML = "<p style='color:red;'>Error: " + err.message + "</p>";
  }
};
