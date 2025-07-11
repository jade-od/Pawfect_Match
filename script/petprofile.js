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

let allPetsArray = [];

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("allPets");
  const speciesFilter = document.getElementById("speciesFilter");
  const tempermentFilter = document.getElementById("tempermentFilter");
  const ageFilter = document.getElementById("ageFilter");

  container.innerHTML = "<p>Loading pets...</p>";

  try {
    const petsCol = collection(db, "pets");
    const snapshot = await getDocs(petsCol);

    if (snapshot.empty) {
      container.innerHTML = "<p>No pets found in the shelter.</p>";
      return;
    }

    allPetsArray = [];
    snapshot.forEach((doc) => {
      const pet = doc.data();
      pet._docId = doc.id;
      allPetsArray.push(pet);
    });

    renderPets();

    speciesFilter.addEventListener("change", renderPets);
    tempermentFilter.addEventListener("change", renderPets);
    ageFilter.addEventListener("change", renderPets);

    function renderPets() {
      const speciesVal = speciesFilter.value;
      const tempVal = tempermentFilter.value;
      const ageVal = ageFilter.value;

      container.innerHTML = "";

      const filteredPets = allPetsArray.filter((pet) => {
        // Filter by species
        if (speciesVal && pet.Species !== speciesVal) return false;

        // Filter by temperament
        if (tempVal && !(pet.Temperament && pet.Temperament.includes(tempVal)))
          return false;

        // Filter by age group
        if (ageVal) {
          const age = Number(pet.Age); // assume Age is a number
          if (
            (ageVal === "Young" && age > 2) ||
            (ageVal === "Adult" && (age < 3 || age > 6)) ||
            (ageVal === "Senior" && age < 7)
          ) {
            return false;
          }
        }

        return true;
      });

      if (filteredPets.length === 0) {
        container.innerHTML = "<p>No pets match your filters.</p>";
        return;
      }

      filteredPets.forEach((pet) => {
        const card = document.createElement("div");
        card.className = "pet-card";
        card.innerHTML = `
          <img src="${pet.image}" alt="${pet.Name}">
          <h3>${pet.Name}</h3>
          <p>Breed: ${pet.Breed}</p>
          <p>Age: ${pet.Age}</p>
          <p>Species: ${pet.Species}</p>
        `;
        card.onclick = () => {
          window.location.href = `pets.html?id=${pet._docId}`;
        };
        container.appendChild(card);
      });
    }
  } catch (err) {
    container.innerHTML = `<p style="color:red;">Error loading pets: ${err.message}</p>`;
  }
});
