import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", async function () {
  const petList = document.getElementById("petList");
  petList.innerHTML = "<p>Loading pets...</p>";

  try {
    // Query pets, ordered by daysInShelter DESCENDING
    const petsCol = collection(db, "pets");
    const petsQuery = query(petsCol, orderBy("daysInShelter", "desc"));
    const petSnapshot = await getDocs(petsQuery);

    if (petSnapshot.empty) {
      petList.innerHTML = "<p>No pets found!</p>";
      return;
    }

    petList.innerHTML = "";
    petSnapshot.forEach(doc => {
      const pet = doc.data();
      const card = document.createElement("div");
      card.className = "pet-card";
      card.style.cursor = "pointer";

      card.innerHTML = `
        <img src="${pet.image}" alt="${pet.Name}">
        <h3>${pet.Name}</h3>
        <p>Breed: ${pet.Breed}</p>
        <p>Age: ${pet.Age}</p>
        <p>Days in Shelter: ${pet.daysInShelter}</p>
        <p>${pet.Description}</p>
      `;

      card.onclick = () => {
        window.location.href = `pets.html?id=${doc.id}`;
      };

      petList.appendChild(card);
    });
  } catch (error) {
    petList.innerHTML = `<p style="color: red;">Error loading pets: ${error.message}</p>`;
    console.error("Error loading pets from Firestore:", error);
  }
});
