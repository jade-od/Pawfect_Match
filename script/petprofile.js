import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBq7_eJtK-lHLAifo55UwLGhsT5SKq5LP0",
  authDomain: "pawfect-match-55596.firebaseapp.com",
  projectId: "pawfect-match-55596",
  storageBucket: "pawfect-match-55596.appspot.com",
  messagingSenderId: "458265739863",
  appId: "1:458265739863:web:432d45d710963266611912",
  measurementId: "G-MHVQQD7XVR",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("allPets");
  container.innerHTML = "<p>Loading pets...</p>";

  try {
    const petsCol = collection(db, "pets");
    const snapshot = await getDocs(petsCol);
    container.innerHTML = ""; // Clear loading message

    if (snapshot.empty) {
      container.innerHTML = "<p>No pets found in the shelter.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const pet = doc.data();
      const card = document.createElement("div");
      card.className = "pet-card";
      card.innerHTML = `
        <img src="${pet.image}" alt="${pet.Name}">
        <h3>${pet.Name}</h3>
        <p>Breed: ${pet.Breed}</p>
        <p>Age: ${pet.Age}</p>
      `;
      card.onclick = () => {
        window.location.href = `pets.html?id=${doc.id}`;
      };
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<p style="color:red;">Error loading pets: ${err.message}</p>`;
  }
});
